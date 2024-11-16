export interface AuthResponse {
  access_token: string;
}

export interface AuthRequestBody {
  email: string;
  password: string;
  gotrue_meta_security: Record<string, never>;
}
