'use server';
import { SUPABASE } from '@/constants/environment';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AUTH_HEADERS_GETTER_TIMEOUT } from './constants';
import { AuthRequestBody, AuthResponse } from './interfaces';
import { STACK_AI_BACKEND_URL } from '@/constants/main';

// Creating a session for Google Drive related operations
const GoogleDriveSession = axios.create();

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
