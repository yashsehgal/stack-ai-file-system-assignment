import { ApplicationContextType } from '../interfaces/application-context-type';

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
} as const;
