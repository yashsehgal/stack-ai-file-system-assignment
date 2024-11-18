'use client';
import { Resource } from '@/services/interfaces';
import { useEffect, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { ApplicationContextType } from '../interfaces/application-context-type';
import { KNOWLEDGE_BASE_CONTENT_VIEW } from '../knowledge-base/interfaces/main';
import { fetchKnowledgeBaseResources } from '@/services/manage-knowledge-base';

export function ApplicationContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState<string>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle);
  const [googleDriveSelectedFiles, setGoogleDriveSelectedFiles] = useState<Resource[]>(
    INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles,
  );
  const [googleDriveFolderContents, setGoogleDriveFolderContents] = useState<{ [key: string]: Resource[] }>({});
  const [knowledgeBaseContentView, setKnowledgeBaseContentView] = useState<KNOWLEDGE_BASE_CONTENT_VIEW>(
    INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseContentView,
  );
  const [knowledgeBaseID, setKnowledgeBaseID] = useState<string>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseID);
  const [knowledgeBaseData, setKnowledgeBaseData] = useState<Resource[]>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseData);

  const resetSelectedFiles = () => {
    setGoogleDriveSelectedFiles(INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles);
  };

  const syncKnowledgeBase = async () => {
    const response = await fetchKnowledgeBaseResources(knowledgeBaseID);
    if (typeof response !== 'undefined' && !!response.length) {
      setKnowledgeBaseData(response);
    }
  };

  useEffect(() => {
    if (typeof knowledgeBaseID !== 'undefined' && !!knowledgeBaseID) {
      syncKnowledgeBase();
    }
  }, [knowledgeBaseID]);

  useEffect(() => console.log('Knowledge base data', knowledgeBaseData), [knowledgeBaseData]);

  const ProviderData: ApplicationContextType = {
    knowledgeBaseTitle,
    setKnowledgeBaseTitle,
    googleDriveSelectedFiles,
    setGoogleDriveSelectedFiles,
    googleDriveFolderContents,
    setGoogleDriveFolderContents,
    knowledgeBaseContentView,
    setKnowledgeBaseContentView,
    knowledgeBaseID,
    setKnowledgeBaseID,
    knowledgeBaseData,
    setKnowledgeBaseData,
    resetSelectedFiles,
  } as const;

  return <ApplicationContext.Provider value={ProviderData}>{children}</ApplicationContext.Provider>;
}
