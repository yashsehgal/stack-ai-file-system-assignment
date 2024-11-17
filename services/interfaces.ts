export interface AuthResponse {
  access_token: string;
}

export interface AuthRequestBody {
  email: string;
  password: string;
  gotrue_meta_security: Record<string, never>;
}

export interface Resource {
  inode_type: string; // 'directory' or 'file'
  inode_path: {
    path: string;
  };
  resource_id: string;
}
