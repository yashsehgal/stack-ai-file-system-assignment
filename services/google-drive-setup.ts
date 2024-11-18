'use server';
import { SUPABASE } from '@/constants/environment';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AUTH_HEADERS_GETTER_TIMEOUT } from './constants';
import { AuthRequestBody, AuthResponse, Resource } from './interfaces';
import { STACK_AI_BACKEND_URL } from '@/constants/main';

// Creating a session for Google Drive related operations
export const GoogleDriveSession = axios.create();

/**
 * Retrieves authentication headers using email and password.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to an object containing the Authorization header.
 * @throws An error if authentication fails.
 */
export async function getAuthHeaders(email: string, password: string): Promise<{ Authorization: string }> {
  const authApi: AxiosInstance = axios.create({
    baseURL: SUPABASE.AUTH_URL,
    timeout: AUTH_HEADERS_GETTER_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Apikey: SUPABASE.ANON_KEY,
    },
  });

  try {
    // Sending a POST request to authenticate the user and retrieve the access token
    const { data } = await authApi.post<AuthResponse>('/auth/v1/token?grant_type=password', {
      email,
      password,
      gotrue_meta_security: {},
    } as AuthRequestBody);

    return {
      Authorization: `Bearer ${data.access_token}`, // Returning the Authorization header with the access token
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      throw new Error(
        `Authentication failed (${status}): ${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`,
      );
    }
    throw new Error('Authentication failed with unknown error');
  }
}

// Immediately invoked function to set default headers for GoogleDriveSession
(async () => {
  const authHeaders = await getAuthHeaders(SUPABASE.EMAIL_ADDRESS, SUPABASE.PASSWORD);
  GoogleDriveSession.defaults.headers.common = {
    ...GoogleDriveSession.defaults.headers.common,
    ...authHeaders, // Merging the retrieved auth headers into the default headers
  };
})();

/**
 * Fetches the organization ID of the current user.
 * @returns A promise that resolves to the organization ID.
 * @throws An error if fetching the organization ID fails.
 */
export async function getOrganizationId() {
  try {
    // Sending a GET request to retrieve the current organization ID
    const response = await GoogleDriveSession.get(`${STACK_AI_BACKEND_URL}/organizations/me/current`);
    const orgId = response.data.org_id; // Extracting the organization ID from the response
    return orgId;
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    throw error; // Re-throwing the error for handling in the calling code
  }
}

/**
 * Retrieves the first connection for Google Drive.
 * @returns A promise that resolves to the connection object.
 * @throws An error if fetching the connection fails.
 */
export async function getConnection() {
  const connectionListUrl = `${STACK_AI_BACKEND_URL}/connections?connection_provider=gdrive&limit=1`;

  try {
    // Make GET request to the connections API
    const response = await GoogleDriveSession.get(connectionListUrl);

    // Check if the response status indicates an error
    if (response.status !== 200) {
      throw new Error(`Failed to fetch connections: ${response.status}`);
    }

    // Extract the first connection from the response
    const connection = response.data[0];

    return connection; // Returning the connection object
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error; // Re-throw the error for handling in the calling code
  }
}

/**
 * Retrieves URLs for connection resources and children resources.
 * @returns A promise that resolves to an object containing the connection resources URL and children resources URL.
 * @throws An error if fetching the connection URLs fails.
 */
export async function getConnectionUrls(): Promise<{ connectionResourcesUrl: string; childrenResourcesUrl: string }> {
  try {
    const connection = await getConnection(); // Fetching the connection object
    const connection_id = connection.connection_id; // Extracting the connection ID

    // Constructing URLs for connection resources and children resources
    const connectionResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources`;
    const childrenResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources/children`;

    return {
      connectionResourcesUrl,
      childrenResourcesUrl,
    };
  } catch (error) {
    console.error('Error in getConnectionUrls:', error);
    throw error; // Re-throwing the error for handling in the calling code
  }
}

/**
 * Fetches root resources from Google Drive.
 * @returns A promise that resolves to an array of Resource objects or undefined if no resources are found.
 * @throws An error if fetching root resources fails.
 */
export async function getRootResources(): Promise<Resource[] | undefined> {
  const { childrenResourcesUrl } = await getConnectionUrls(); // Fetching the children resources URL

  try {
    // For root resources, don't include resource_id parameter
    const response = await GoogleDriveSession.get(childrenResourcesUrl);
    const rootResources: Resource[] = response.data; // Extracting root resources from the response

    if (rootResources.length === 0) {
      return; // Returning undefined if no resources are found
    }

    return rootResources; // Returning the array of root resources
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching root resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

/**
 * Fetches specific files from Google Drive based on resource ID.
 * @param resourceId - The ID of the resource to fetch.
 * @param resourcesUrl - The URL to fetch resources from.
 * @returns A promise that resolves to an array of Resource objects.
 * @throws An error if fetching specific files fails.
 */
export async function getSpecificFile(resourceId: string, resourcesUrl: string): Promise<Resource[]> {
  try {
    // Special case for root directory
    if (resourceId === 'STACK_VFS_VIRTUAL_DIRECTORY') {
      // For root directory, don't include resource_id parameter
      const response = await GoogleDriveSession.get(resourcesUrl);
      let resources: Resource[] = response.data; // Extracting resources from the response

      if (!resources) {
        return []; // Returning an empty array if no resources are found
      }

      if (!Array.isArray(resources)) {
        resources = [resources]; // Ensuring resources is an array
      }

      return resources; // Returning the array of resources
    }

    // Normal case for other directories
    const url = `${resourcesUrl}?resource_id=${resourceId}`; // Constructing the URL with resource ID

    const response = await GoogleDriveSession.get(url);
    let resources: Resource[] = response.data; // Extracting resources from the response

    if (!resources) {
      return []; // Returning an empty array if no resources are found
    }

    if (!Array.isArray(resources)) {
      resources = [resources]; // Ensuring resources is an array
    }

    return resources; // Returning the array of resources
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error in getSpecificFile:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      // Return empty array instead of throwing for 404
      if (error.response?.status === 404) {
        return []; // Returning an empty array for 404 errors
      }
    }
    throw error; // Re-throwing the error for handling in the calling code
  }
}

/**
 * Fetches the contents of a folder based on resource ID.
 * @param resourceId - The ID of the resource (folder) to fetch contents from.
 * @param resourcesUrl - The URL to fetch resources from.
 * @returns A promise that resolves to an array of Resource objects.
 * @throws An error if fetching folder contents fails.
 */
export async function fetchFolderContents(resourceId: string, resourcesUrl: string): Promise<Resource[]> {
  // Prepare query parameters
  const data = { resource_id: resourceId }; // Creating an object with resource ID
  const encodedQueryParams = new URLSearchParams(data).toString(); // Encoding query parameters
  const url = `${resourcesUrl}?${encodedQueryParams}`; // Constructing the URL with query parameters

  try {
    // Send the GET request using the GoogleDriveSession
    const response = await GoogleDriveSession.get(url);

    // Check if the response is empty
    let resources: Resource[] = response.data; // Extracting resources from the response

    if (resources.length === 0) {
      return []; // Returning an empty array if no resources are found
    }

    // If response is a dictionary, convert it to an array (handle single resource case)
    if (resources && !Array.isArray(resources)) {
      resources = [resources]; // Ensuring resources is an array
    }

    return resources; // Returning the array of resources
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error; // Re-throwing the error for handling in the calling code
  }
}
