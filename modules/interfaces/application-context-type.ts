import { Resource } from '@/services/interfaces';
import { SetStateAction } from 'react';
import { KNOWLEDGE_BASE_CONTENT_VIEW } from '../knowledge-base/interfaces/main';

export type ApplicationContextType = {
  // State and dispatcher for knowledge-base title
  knowledgeBaseTitle: string;
  setKnowledgeBaseTitle: React.Dispatch<SetStateAction<string>>;

  // State and dispatcher for handling list of selected google drive files
  googleDriveSelectedFiles: Resource[];
  setGoogleDriveSelectedFiles: React.Dispatch<SetStateAction<Resource[]>>;

  // State and dispatcher for handling the google-drive folder content, gets fetched and updated at render time
  googleDriveFolderContents: { [key: string]: Resource[] };
  setGoogleDriveFolderContents: React.Dispatch<SetStateAction<{ [key: string]: Resource[] }>>;

  // State and dispatcher for storing and toggling the knowledge-base content view
  knowledgeBaseContentView: KNOWLEDGE_BASE_CONTENT_VIEW;
  setKnowledgeBaseContentView: React.Dispatch<SetStateAction<KNOWLEDGE_BASE_CONTENT_VIEW>>;

  // State and dispatcher for storing knowledge base ID
  knowledgeBaseID: string;
  setKnowledgeBaseID: React.Dispatch<SetStateAction<string>>;

  // State and dispatcher for storing knowledge base content
  knowledgeBaseData: Resource[];
  setKnowledgeBaseData: React.Dispatch<SetStateAction<Resource[]>>;

  // Resetter method for clearing selected files
  resetSelectedFiles: () => void;
};
