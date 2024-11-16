'use client';
import { useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContextType } from '../interfaces/application-context-type';
import { ApplicationContext } from '../contexts/application-context';

export function ApplicationContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState<string>(INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle);
  const ProviderData: ApplicationContextType = {
    knowledgeBaseTitle,
    setKnowledgeBaseTitle,
  } as const;
  return <ApplicationContext.Provider value={ProviderData}>{children}</ApplicationContext.Provider>;
}
