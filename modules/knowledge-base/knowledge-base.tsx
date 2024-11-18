'use client';
import { useContext } from 'react';
import { KnowledgeBaseEmptyState } from './knowledge-base-empty-state';
import { KnowledgeBaseNavigation } from './knowledge-base-navigation';
import { ApplicationContext } from '../contexts/application-context';
import { KnowledgeBaseContent } from './knowledge-base-content';

// This component renders the complete module layout for KnowledgeBase
export function KnowledgeBase(): JSX.Element {
  const { knowledgeBaseData } = useContext(ApplicationContext);
  const SHOW_KNOWLEDGE_BASE_CONTENT: boolean = knowledgeBaseData.length !== 0;

  return (
    <div className="KnowledgeBase-container grid">
      <KnowledgeBaseNavigation />
      {/* Conditionally rendering the knowledge base content. If not available, rendering empty state view */}
      {SHOW_KNOWLEDGE_BASE_CONTENT ? <KnowledgeBaseContent /> : <KnowledgeBaseEmptyState className="py-56" />}
    </div>
  );
}
