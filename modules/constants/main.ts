import { ApplicationContextType } from '../interfaces/application-context-type';
import { KNOWLEDGE_BASE_CONTENT_VIEW } from '../knowledge-base/interfaces/main';

// Initial store for filling, resetting ApplicationContext
export const INITIAL_APPLICATION_CONTEXT_DATA: ApplicationContextType = {
  knowledgeBaseTitle: 'Untitled',
  setKnowledgeBaseTitle: () => {
    throw new Error('[setKnowledgeBaseTitle]: This error has occurred while setting up the ApplicationContext initial state.');
  },
  googleDriveSelectedFiles: [],
  setGoogleDriveSelectedFiles: () => {
    throw new Error('[setGoogleDriveSelectedFiles]: This error has occured while setting up the ApplicationContext initial state');
  },
  googleDriveFolderContents: {},
  setGoogleDriveFolderContents: () => {
    throw new Error('[setGoogleDriveFolderContents]: This error has occured while setting up the ApplicationContext initial state');
  },
  knowledgeBaseContentView: KNOWLEDGE_BASE_CONTENT_VIEW.LIST,
  setKnowledgeBaseContentView: () => {
    throw new Error('[setKnowledgeBaseContentView]: This error has occured while setting up the ApplicationContext initial state');
  },
  knowledgeBaseID: '',
  setKnowledgeBaseID: () => {
    throw new Error('[setKnowledgeBaseID]: This error has occured while setting up the ApplicationContext initial state');
  },
  knowledgeBaseData: [],
  setKnowledgeBaseData: () => {
    throw new Error('[setKnowledgeBaseData]: This error has occured while setting up the ApplicationContext initial state');
  },
  resetSelectedFiles: () => undefined,
} as const;
