'use client';
import { Resource } from '@/services/interfaces';
import { useCallback, useEffect, useState } from 'react';
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

  const updateKnowledgeBaseWithChildren = useCallback((path: string, children: Resource[]) => {
    setKnowledgeBaseData((prevData) => {
      const newData = [...prevData];

      children.forEach((child) => {
        const existingIndex = newData.findIndex((item) => item.resource_id === child.resource_id);
        if (existingIndex === -1) {
          newData.push(child);
        } else {
          // Update existing item with new data
          newData[existingIndex] = child;
        }
      });

      return newData;
    });
  }, []);

  const removeKnowledgeBaseResources = useCallback((resourceId: string) => {
    setKnowledgeBaseData((prevData) => {
      const resourceToRemove = prevData.find((r) => r.resource_id === resourceId);

      if (!resourceToRemove) return prevData;

      if (resourceToRemove.inode_type === 'directory') {
        // For directories, remove the directory and its direct children only
        const folderPath = resourceToRemove.inode_path.path;
        return prevData.filter((item) => {
          // Keep items that:
          // 1. Don't match the folder path exactly
          // 2. Aren't direct children of this folder
          const isDirectChild =
            item.inode_path.path.startsWith(folderPath + '/') && item.inode_path.path.slice(folderPath.length + 1).split('/').length === 1;

          return item.inode_path.path !== folderPath && !isDirectChild;
        });
      } else {
        // For files, just remove the specific file
        return prevData.filter((item) => item.resource_id !== resourceId);
      }
    });
  }, []);

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
    updateKnowledgeBaseWithChildren,
    removeKnowledgeBaseResources,
    resetSelectedFiles,
  } as const;

  return <ApplicationContext.Provider value={ProviderData}>{children}</ApplicationContext.Provider>;
}
