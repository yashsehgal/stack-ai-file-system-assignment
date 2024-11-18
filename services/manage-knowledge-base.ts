'use server';
import { STACK_AI_BACKEND_URL } from '@/constants/main';
import { AxiosError } from 'axios';
import { getConnection, getOrganizationId, getSpecificFile, GoogleDriveSession } from './google-drive-setup';
import { CreateKbData, KnowledgeBaseResponse, Resource } from './interfaces';

// This file contains services related to managing a knowledge base, including creation, synchronization, and fetching resources.

/**
 * Creates a new knowledge base.
 *
 * @param {string} connectionId - The ID of the connection to use for creating the knowledge base.
 * @param {string[]} connectionSourceIds - An array of source IDs to be associated with the knowledge base.
 * @returns {Promise<string | null>} - The ID of the newly created knowledge base or null if creation fails.
 */
export async function createKnowledgeBase(connectionId: string, connectionSourceIds: string[]): Promise<string | null> {
  // Constructs the URL for creating a new knowledge base
  const createKbUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases`;

  // Prepares the data to be sent in the request for creating a knowledge base
  const data: CreateKbData = {
    connection_id: connectionId,
    connection_source_ids: connectionSourceIds,
    indexing_params: {
      ocr: false, // Optical Character Recognition setting
      unstructured: true, // Indicates if unstructured data should be indexed
      embedding_params: {
        embedding_model: 'text-embedding-ada-002', // Model used for embedding
        api_key: null, // API key for embedding service
      },
      chunker_params: {
        chunk_size: 1500, // Size of each chunk of data
        chunk_overlap: 500, // Overlap between chunks
        chunker: 'sentence', // Method of chunking data
      },
    },
    org_level_role: null, // Organization level role (if applicable)
    cron_job_id: null, // ID for any scheduled jobs (if applicable)
  } as const;

  try {
    // Sends a POST request to create the knowledge base
    const response = await GoogleDriveSession.post(createKbUrl, data);

    // Checks if the response contains data
    if (!response.data) {
      console.error('No data received from knowledge base creation');
      return null; // Returns null if no data is received
    }

    // Parses the response to extract the knowledge base ID
    const newKbJson: KnowledgeBaseResponse = response.data;
    return newKbJson.knowledge_base_id; // Returns the newly created knowledge base ID
  } catch (error) {
    // Handles errors that may occur during the request
    if (error instanceof AxiosError) {
      console.error('Error creating knowledge base:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error; // Rethrows the error for further handling
  }
}

/**
 * Triggers synchronization of a knowledge base.
 *
 * @param {string} knowledgeBaseId - The ID of the knowledge base to sync.
 * @param {string} orgId - The ID of the organization associated with the knowledge base.
 * @returns {Promise<void>} - A promise that resolves when the sync is triggered.
 */
export async function syncKnowledgeBase(knowledgeBaseId: string, orgId: string): Promise<void> {
  // Constructs the URL to trigger synchronization of the knowledge base
  const kbSyncUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`;

  try {
    // Sends a GET request to trigger the sync process
    const response = await GoogleDriveSession.get(kbSyncUrl);
  } catch (error) {
    // Handles errors that may occur during the request
    if (error instanceof AxiosError) {
      console.error('Error syncing knowledge base:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

/**
 * Fetches resources associated with a specific knowledge base.
 *
 * @param {string} knowledgeBaseId - The ID of the knowledge base to fetch resources from.
 * @returns {Promise<Resource[] | undefined>} - An array of resources or undefined if no resources are found.
 */
export async function fetchKnowledgeBaseResources(knowledgeBaseId: string): Promise<Resource[] | undefined> {
  // Constructs the URL to fetch resources associated with the specified knowledge base
  const kbChildrenResourcesUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/${knowledgeBaseId}/resources/children`;

  // Prepares the data for the request
  const data = {
    resource_path: '/', // Specifies the path to fetch resources from
  };

  // Encodes the query parameters for the request
  const encodedQueryParams = new URLSearchParams(data as unknown as any).toString();
  const url = `${kbChildrenResourcesUrl}?${encodedQueryParams}`;

  try {
    // Sends a GET request to fetch the resources
    const response = await GoogleDriveSession.get(url);

    // Extracts the resources from the response
    let resources: Resource[] = response.data;

    // Checks if resources are empty
    if (resources.length === 0) {
      return; // Returns undefined if no resources are found
    }

    // Ensures resources are returned as an array
    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    return resources; // Returns the fetched resources
  } catch (error) {
    // Handles errors that may occur during the request
    if (error instanceof AxiosError) {
      console.error('Error fetching resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

/**
 * Handles the creation of a knowledge base using selected files.
 *
 * @param {Resource[]} selectedFiles - An array of selected files to be included in the knowledge base.
 * @returns {Promise<string | undefined>} - The ID of the created knowledge base or undefined if creation fails.
 */
export async function handleKnowledgeBaseCreation(selectedFiles: Resource[]): Promise<string | undefined> {
  // Validates the input to ensure files are selected
  if (!selectedFiles || selectedFiles.length === 0) {
    throw new Error('No files selected'); // Throws an error if no files are selected
  }

  // Extracts only file IDs from the selected files (ignoring folders)
  const fileIds = selectedFiles.filter((file) => file.inode_type === 'file').map((file) => file.resource_id);

  // Validates that there are valid file IDs
  if (fileIds.length === 0) {
    throw new Error('No valid files selected'); // Throws an error if no valid files are found
  }

  try {
    // Retrieves the connection object
    const connection = await getConnection();
    if (!connection?.connection_id) {
      throw new Error('Failed to get valid connection'); // Throws an error if the connection is invalid
    }

    // Retrieves the organization ID
    const orgId = await getOrganizationId();
    if (!orgId) {
      throw new Error('Failed to get organization ID'); // Throws an error if the organization ID is not found
    }

    // Creates the knowledge base using the connection ID and file IDs
    const knowledgeBaseId = await createKnowledgeBase(connection.connection_id, fileIds);
    if (!knowledgeBaseId) {
      throw new Error('Failed to create knowledge base'); // Throws an error if knowledge base creation fails
    }

    // Triggers synchronization of the newly created knowledge base
    await syncKnowledgeBase(knowledgeBaseId, orgId);
    return knowledgeBaseId; // Returns the ID of the created knowledge base
  } catch (error) {
    console.error('Error in knowledge base creation:', error);
    throw error instanceof Error ? error : new Error('Failed to create knowledge base'); // Rethrows the error for further handling
  }
}

/**
 * Fetches child resources of a specific knowledge base.
 *
 * @param {string} knowledgeBaseId - The ID of the knowledge base to fetch child resources from.
 * @param {string} resourcePath - The path to fetch child resources from.
 * @returns {Promise<Resource[]>} - An array of child resources.
 */
export async function fetchKnowledgeBaseChildren(knowledgeBaseId: string, resourcePath: string): Promise<Resource[]> {
  // Constructs the URL to fetch child resources of the specified knowledge base
  const kbChildrenResourcesUrl = `${STACK_AI_BACKEND_URL}/knowledge_bases/${knowledgeBaseId}/resources/children`;

  // Prepares the data for the request
  const data = {
    resource_path: resourcePath, // Specifies the path to fetch child resources from
  };

  // Encodes the query parameters for the request
  const encodedQueryParams = new URLSearchParams(data).toString();
  const url = `${kbChildrenResourcesUrl}?${encodedQueryParams}`;

  try {
    // Sends a GET request to fetch the child resources
    const response = await GoogleDriveSession.get(url);
    let resources: Resource[] = response.data;

    // Ensures resources are returned as an array
    if (!Array.isArray(resources)) {
      resources = resources ? [resources] : [];
    }

    return resources; // Returns the fetched child resources
  } catch (error) {
    console.error('Error fetching knowledge base children:', error);
    return []; // Returns an empty array in case of an error
  }
}
