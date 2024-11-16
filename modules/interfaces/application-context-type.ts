import { SetStateAction } from 'react';

export type ApplicationContextType = {
  knowledgeBaseTitle: string;
  setKnowledgeBaseTitle: React.Dispatch<SetStateAction<string>>;
};
