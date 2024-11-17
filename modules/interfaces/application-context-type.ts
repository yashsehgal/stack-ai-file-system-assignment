import { Resource } from '@/services/interfaces';
import { SetStateAction } from 'react';

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

  // Resetter method for clearing selected files
  resetSelectedFiles: () => void;
};
