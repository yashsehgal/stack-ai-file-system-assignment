'use server';
import { SUPABASE } from '@/constants/environment';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AUTH_HEADERS_GETTER_TIMEOUT } from './constants';
import { AuthRequestBody, AuthResponse, Resource } from './interfaces';
import { STACK_AI_BACKEND_URL } from '@/constants/main';

// Creating a session for Google Drive related operations
export const GoogleDriveSession = axios.create();

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
    const { data } = await authApi.post<AuthResponse>('/auth/v1/token?grant_type=password', {
      email,
      password,
      gotrue_meta_security: {},
    } as AuthRequestBody);

    return {
      Authorization: `Bearer ${data.access_token}`,
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

(async () => {
  const authHeaders = await getAuthHeaders(SUPABASE.EMAIL_ADDRESS, SUPABASE.PASSWORD);
  GoogleDriveSession.defaults.headers.common = {
    ...GoogleDriveSession.defaults.headers.common,
    ...authHeaders,
  };
})();

export async function getOrganizationId() {
  try {
    const response = await GoogleDriveSession.get(`${STACK_AI_BACKEND_URL}/organizations/me/current`);
    const orgId = response.data.org_id;
    return orgId;
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    throw error;
  }
}

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

    return connection;
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error; // Re-throw the error for handling in the calling code
  }
}

export async function getConnectionUrls(): Promise<{ connectionResourcesUrl: string; childrenResourcesUrl: string }> {
  // Extract connection_id from the connection object
  const response = await getConnection();
  const connection_id = response.connection_id;

  // Construct the URLs
  const connectionResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources`;
  const childrenResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources/children`;

  return {
    connectionResourcesUrl,
    childrenResourcesUrl,
  };
}

export async function getRootResources(): Promise<void> {
  const { childrenResourcesUrl } = await getConnectionUrls();

  try {
    // Send GET request to fetch the root resources
    const response = await GoogleDriveSession.get(childrenResourcesUrl);

    // Extract the resources from the response
    const rootResources: Resource[] = response.data;

    // Check if the response is empty
    if (rootResources.length === 0) {
      console.log('No root resources found');
      return;
    }

    // Loop through the resources and print information
    rootResources.forEach((resource) => {
      const emoji = resource.inode_type === 'directory' ? '📁' : '📄';
      console.log(`${emoji} ${resource.inode_path.path.padEnd(30)} (resource_id: ${resource.resource_id})`);
    });

    // Optionally print raw response for debugging
    console.log('\n\nRaw response:');
    console.log(response);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching root resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

export async function getSpecificFile(resourceId: string, resourcesUrl: string): Promise<void> {
  // Prepare query parameters
  const data = { resource_id: resourceId };

  // Encode query parameters using URLSearchParams (similar to urlencode in Python)
  const encodedQueryParams = new URLSearchParams(data).toString();
  const url = `${resourcesUrl}?${encodedQueryParams}`;

  try {
    // Send the GET request using the GoogleDriveSession
    const response = await GoogleDriveSession.get(url);

    // Check if the response is empty
    let resources: Resource[] = response.data;

    if (resources.length === 0) {
      console.log('No resources found');
      return;
    }

    // If response is a dictionary, convert it to an array (handle single resource case)
    if (resources && !Array.isArray(resources)) {
      resources = [resources];
    }

    // Print resources
    resources.forEach((resource) => {
      const emoji = resource.inode_type === 'directory' ? '📁' : '📄';
      console.log(`${emoji} ${resource.inode_path.path.padEnd(30)} (resource_id: ${resource.resource_id})`);
    });

    // Optionally print raw response for debugging
    console.log('\n\nRaw response:');
    console.log(response);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}
