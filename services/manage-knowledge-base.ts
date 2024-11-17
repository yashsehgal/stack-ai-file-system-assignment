import { AxiosError } from 'axios';
import { GoogleDriveSession } from './google-drive-setup';
import { STACK_AI_BACKEND_URL } from '@/constants/main';
import { CreateKbData, KnowledgeBaseResponse, Resource } from './interfaces';

export async function createKnowledgeBase(connectionId: string, connectionSourceIds: string[]): Promise<string | null> {
  const createKbUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases`;

  // Create the request data body
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
  };

  console.log('Pinging:', createKbUrl);

  try {
    // Send the POST request to create the knowledge base
    const response = await GoogleDriveSession.post(createKbUrl, data);

    // Extract the JSON response
    const newKbJson: KnowledgeBaseResponse = response.data;
    console.log('Knowledge Base Created:', newKbJson);

    // Return the knowledge base ID
    return newKbJson.knowledge_base_id;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error creating knowledge base:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return null;
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

export async function printKbResources(knowledgeBaseId: string): Promise<void> {
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

    // Loop through the resources and print their details
    resources.forEach((resource) => {
      const emoji = resource.inode_type === 'directory' ? '📁' : '📄';
      console.log(
        `${emoji} ${resource.inode_path.path.padEnd(30)} (resource_id: ${resource.resource_id}) status: ${resource.status || 'N/A'}`,
      );
    });
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
