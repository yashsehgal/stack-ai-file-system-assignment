import { KnowledgeBaseEmptyState } from './knowledge-base-empty-state';
import { KnowledgeBaseNavigation } from './knowledge-base-navigation';

export function KnowledgeBase(): JSX.Element {
  return (
    <div className="KnowledgeBase-container grid">
      <KnowledgeBaseNavigation />
      <KnowledgeBaseEmptyState className="py-56" />
    </div>
  );
}