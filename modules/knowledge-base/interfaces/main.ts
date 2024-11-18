import { Resource } from '@/services/interfaces';

export interface KnowledgeBaseGridCardProps {
  resource: Resource;
}

export interface KnowledgeBaseListNodeProps {
  resource: Resource;
  level?: number;
}

export enum KNOWLEDGE_BASE_CONTENT_VIEW {
  LIST = 'LIST',
  GRID = 'GRID',
}

export interface KnowledgeBaseGridNodeProps {
  resource: Resource;
  onNavigate: (path: string) => void;
}
