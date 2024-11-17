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
