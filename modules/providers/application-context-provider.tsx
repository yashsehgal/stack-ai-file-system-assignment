'use client';
import { Resource } from '@/services/interfaces';
import { useEffect, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { ApplicationContextType } from '../interfaces/application-context-type';

export function ApplicationContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState<string>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle);
  const [googleDriveSelectedFiles, setGoogleDriveSelectedFiles] = useState<Resource[]>(
    INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles,
  );
  const [googleDriveFolderContents, setGoogleDriveFolderContents] = useState<{ [key: string]: Resource[] }>({});

  const resetSelectedFiles = () => {
    setGoogleDriveSelectedFiles(INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles);
  };

  const ProviderData: ApplicationContextType = {
    knowledgeBaseTitle,
    setKnowledgeBaseTitle,
    googleDriveSelectedFiles,
    setGoogleDriveSelectedFiles,
    googleDriveFolderContents,
    setGoogleDriveFolderContents,
    resetSelectedFiles,
  } as const;

  useEffect(() => console.log('selected files', googleDriveSelectedFiles), [googleDriveSelectedFiles]);

  return <ApplicationContext.Provider value={ProviderData}>{children}</ApplicationContext.Provider>;
}
