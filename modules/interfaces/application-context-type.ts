import { Resource } from '@/services/interfaces';
import { SetStateAction } from 'react';

export type ApplicationContextType = {
  knowledgeBaseTitle: string;
  setKnowledgeBaseTitle: React.Dispatch<SetStateAction<string>>;

  googleDriveSelectedFiles: Resource[];
  setGoogleDriveSelectedFiles: React.Dispatch<SetStateAction<Resource[]>>;

  googleDriveFolderContents: { [key: string]: Resource[] };
  setGoogleDriveFolderContents: React.Dispatch<SetStateAction<{ [key: string]: Resource[] }>>;
};
