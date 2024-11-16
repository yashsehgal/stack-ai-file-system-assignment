import { ApplicationContextType } from '../interfaces/application-context-type';

export const INITIAL_APPLICATION_CONTEXT_DATA: ApplicationContextType = {
  knowledgeBaseTitle: 'Untitled',
  setKnowledgeBaseTitle: () => {
    throw new Error('This error has occurred while setting up the ApplicationContext initial state.');
  },
} as const;
