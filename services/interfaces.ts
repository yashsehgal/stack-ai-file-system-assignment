export interface AuthResponse {
  access_token: string;
}

export interface AuthRequestBody {
  email: string;
  password: string;
  gotrue_meta_security: Record<string, never>;
}

export interface Resource {
  knowledge_base_id: string;
  created_at: string;
  modified_at: string;
  indexed_at: string | null;
  inode_type: 'directory' | 'file';
  resource_id: string;
  inode_path: {
    path: string;
  };
  inode_id: string;
  content_hash?: string;
  content_mime?: string;
  size?: number;
  status?: string;
}

interface IndexingParams {
  ocr: boolean;
  unstructured: boolean;
  embedding_params: {
    embedding_model: string;
    api_key: string | null;
  };
  chunker_params: {
    chunk_size: number;
    chunk_overlap: number;
    chunker: string;
  };
}

export interface CreateKbData {
  connection_id: string;
  connection_source_ids: string[];
  indexing_params: IndexingParams;
  org_level_role: string | null;
  cron_job_id: string | null;
}

export interface KnowledgeBaseResponse {
  knowledge_base_id: string;
}
