import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';
import { STACK_AI_BACKEND_URL } from '@/constants/main';

// Middleware configuration
export const config = {
  matcher: '/api/google-drive/:path*',
};

// Create API client for middleware
const apiClient = axios.create({
  baseURL: STACK_AI_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function middleware(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set auth token for API client
    apiClient.defaults.headers.common['Authorization'] = authHeader;

    // Get the path and method
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/google-drive', '');
    const method = request.method.toLowerCase();

    // Handle the request based on method
    switch (method) {
      case 'get': {
        const { data } = await apiClient.get(path);
        return new NextResponse(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Google Drive middleware error:', error);

    if (axios.isAxiosError(error)) {
      return new NextResponse(
        JSON.stringify({
          error: error.response?.data?.message || 'API Error',
          code: error.code,
        }),
        {
          status: error.response?.status || 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
