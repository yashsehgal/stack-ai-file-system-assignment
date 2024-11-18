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
  try {
    const connection = await getConnection();
    const connection_id = connection.connection_id;

    // Match exactly with Python URL structure
    const connectionResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources`;
    const childrenResourcesUrl = `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources/children`;

    // Debug logging
    console.log('Connection ID: ', connection_id);
    console.log('Connection resources URL: ', connectionResourcesUrl);
    console.log('Children resources URL: ', childrenResourcesUrl);

    return {
      connectionResourcesUrl,
      childrenResourcesUrl,
    };
  } catch (error) {
    console.error('Error in getConnectionUrls:', error);
    throw error;
  }
}

export async function getRootResources(): Promise<Resource[] | undefined> {
  const { childrenResourcesUrl } = await getConnectionUrls();

  try {
    // For root resources, don't include resource_id parameter
    const response = await GoogleDriveSession.get(childrenResourcesUrl);
    const rootResources: Resource[] = response.data;

    if (rootResources.length === 0) {
      console.log('No root resources found');
      return;
    }

    return rootResources;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching root resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

export async function getSpecificFile(resourceId: string, resourcesUrl: string): Promise<Resource[]> {
  try {
    // Special case for root directory
    if (resourceId === 'STACK_VFS_VIRTUAL_DIRECTORY') {
      // For root directory, don't include resource_id parameter
      const response = await GoogleDriveSession.get(resourcesUrl);
      let resources: Resource[] = response.data;

      if (!resources) {
        return [];
      }

      if (!Array.isArray(resources)) {
        resources = [resources];
      }

      return resources;
    }

    // Normal case for other directories
    const url = `${resourcesUrl}?resource_id=${resourceId}`;
    console.log('Fetching from URL: ', url);

    const response = await GoogleDriveSession.get(url);
    let resources: Resource[] = response.data;

    if (!resources) {
      return [];
    }

    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    return resources;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error in getSpecificFile:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      // Return empty array instead of throwing for 404
      if (error.response?.status === 404) {
        return [];
      }
    }
    throw error;
  }
}

export async function fetchFolderContents(resourceId: string, resourcesUrl: string): Promise<Resource[]> {
  // Prepare query parameters
  const data = { resource_id: resourceId };
  const encodedQueryParams = new URLSearchParams(data).toString();
  const url = `${resourcesUrl}?${encodedQueryParams}`;

  try {
    // Send the GET request using the GoogleDriveSession
    const response = await GoogleDriveSession.get(url);

    // Check if the response is empty
    let resources: Resource[] = response.data;

    if (resources.length === 0) {
      console.log('No resources found');
      return [];
    }

    // If response is a dictionary, convert it to an array (handle single resource case)
    if (resources && !Array.isArray(resources)) {
      resources = [resources];
    }

    // Log resources for debugging
    resources.forEach((resource) => {
      const emoji = resource.inode_type === 'directory' ? '📁' : '📄';
      console.log(`${emoji} ${resource.inode_path.path.padEnd(30)} (resource_id: ${resource.resource_id})`);
    });

    return resources;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching resources:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
}
