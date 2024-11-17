'use client';
import { useEffect, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContextType } from '../interfaces/application-context-type';
import { ApplicationContext } from '../contexts/application-context';
import { Resource } from '@/services/interfaces';

export function ApplicationContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState<string>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle);
  const [googleDriveSelectedFiles, setGoogleDriveSelectedFiles] = useState<Resource[]>(
    INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles,
  );
  const [googleDriveFolderContents, setGoogleDriveFolderContents] = useState<{ [key: string]: Resource[] }>({});

  const ProviderData: ApplicationContextType = {
    knowledgeBaseTitle,
    setKnowledgeBaseTitle,
    googleDriveSelectedFiles,
    setGoogleDriveSelectedFiles,
    googleDriveFolderContents,
    setGoogleDriveFolderContents,
  } as const;

  useEffect(() => console.log('selected files', googleDriveSelectedFiles), [googleDriveSelectedFiles]);

  return <ApplicationContext.Provider value={ProviderData}>{children}</ApplicationContext.Provider>;
}
