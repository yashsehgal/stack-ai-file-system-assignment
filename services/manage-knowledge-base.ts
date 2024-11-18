'use server';
import { STACK_AI_BACKEND_URL } from '@/constants/main';
import { AxiosError } from 'axios';
import { getConnection, getOrganizationId, getSpecificFile, GoogleDriveSession } from './google-drive-setup';
import { CreateKbData, KnowledgeBaseResponse, Resource } from './interfaces';

export async function createKnowledgeBase(connectionId: string, connectionSourceIds: string[]): Promise<string | null> {
  const createKbUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases`;

  const data: CreateKbData = {
    connection_id: connectionId,
    connection_source_ids: connectionSourceIds,
    indexing_params: {
      ocr: false,
      unstructured: true,
      embedding_params: {
        embedding_model: 'text-embedding-ada-002',
        api_key: null,
      },
      chunker_params: {
        chunk_size: 1500,
        chunk_overlap: 500,
        chunker: 'sentence',
      },
    },
    org_level_role: null,
    cron_job_id: null,
  } as const;

  try {
    console.log('Creating knowledge base with data:', { connectionId, fileCount: connectionSourceIds.length });

    // Use .post() directly instead of .request()
    const response = await GoogleDriveSession.post(createKbUrl, data);

    if (!response.data) {
      console.error('No data received from knowledge base creation');
      return null;
    }

    const newKbJson: KnowledgeBaseResponse = response.data;
    console.log('Knowledge base created successfully:', newKbJson);
    return newKbJson.knowledge_base_id;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error creating knowledge base:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
}

export async function syncKnowledgeBase(knowledgeBaseId: string, orgId: string): Promise<void> {
  // Construct the sync URL
  const kbSyncUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`;

  console.log('Pinging:', kbSyncUrl);

  try {
    // Send GET request to trigger the sync
    const response = await GoogleDriveSession.get(kbSyncUrl);

    // Log the response status code and text (body)
    console.log('Sync Status Code:', response.status);
    console.log('Sync Response:', response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle error if the request fails
      console.error('Error syncing knowledge base:', error.response?.data || error.message);
    } else {
      // Handle unexpected errors
      console.error('An unexpected error occurred:', error);
    }
  }
}

export async function fetchKnowledgeBaseResources(knowledgeBaseId: string): Promise<Resource[] | undefined> {
  const kbChildrenResourcesUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/${knowledgeBaseId}/resources/children`;

  const data = {
    resource_path: '/',
  };

  // Encode the query parameters (no need to use `urlencode` in JS/TS)
  const encodedQueryParams = new URLSearchParams(data as unknown as any).toString();
  const url = `${kbChildrenResourcesUrl}?${encodedQueryParams}`;

  console.log('Pinging:', url);

  try {
    // Send GET request to fetch the resources
    const response = await GoogleDriveSession.get(url);

    // Extract the resources from the response
    let resources: Resource[] = response.data;

    // Check if resources are empty
    if (resources.length === 0) {
      console.log('No resources found');
      return;
    }

    // If the resources are not an array, convert it to one (for consistency)
    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    return resources;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle error if the request fails
      console.error('Error fetching resources:', error.response?.data || error.message);
    } else {
      // Handle unexpected errors
      console.error('An unexpected error occurred:', error);
    }
  }
}

export async function handleKnowledgeBaseCreation(selectedFiles: Resource[]): Promise<string | undefined> {
  if (!selectedFiles || selectedFiles.length === 0) {
    throw new Error('No files selected');
  }

  // Get only file IDs from selected files (no folders)
  const fileIds = selectedFiles.filter((file) => file.inode_type === 'file').map((file) => file.resource_id);

  if (fileIds.length === 0) {
    throw new Error('No valid files selected');
  }

  try {
    // Get connection
    const connection = await getConnection();
    if (!connection?.connection_id) {
      throw new Error('Failed to get valid connection');
    }

    // Get organization ID
    const orgId = await getOrganizationId();
    if (!orgId) {
      throw new Error('Failed to get organization ID');
    }

    // Create knowledge base
    const knowledgeBaseId = await createKnowledgeBase(connection.connection_id, fileIds);
    if (!knowledgeBaseId) {
      throw new Error('Failed to create knowledge base');
    }

    console.log('Knowledge base created, starting sync...');

    // Sync knowledge base
    await syncKnowledgeBase(knowledgeBaseId, orgId);

    console.log('Knowledge base sync initiated');
    return knowledgeBaseId;
  } catch (error) {
    console.error('Error in knowledge base creation:', error);
    throw error instanceof Error ? error : new Error('Failed to create knowledge base');
  }
}

export async function fetchKnowledgeBaseChildren(knowledgeBaseId: string, resourcePath: string): Promise<Resource[]> {
  const kbChildrenResourcesUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/${knowledgeBaseId}/resources/children`;

  const data = {
    resource_path: resourcePath,
  };

  const encodedQueryParams = new URLSearchParams(data).toString();
  const url = `${kbChildrenResourcesUrl}?${encodedQueryParams}`;

  try {
    const response = await GoogleDriveSession.get(url);
    let resources: Resource[] = response.data;

    if (!Array.isArray(resources)) {
      resources = resources ? [resources] : [];
    }

    return resources;
  } catch (error) {
    console.error('Error fetching knowledge base children:', error);
    return [];
  }
}
