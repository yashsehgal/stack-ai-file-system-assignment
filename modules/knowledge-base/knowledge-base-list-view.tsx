import { useContext } from 'react';
import { KnowledgeBaseListNode } from './knowledge-base-list-node';
import { ApplicationContext } from '../contexts/application-context';
import { getConnectionUrls } from '@/services/google-drive-setup';
import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';

export function KnowledgeBaseListView(): JSX.Element {
  const { knowledgeBaseID } = useContext(ApplicationContext);

  const {
    data: rootResources,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['knowledge-base-root', knowledgeBaseID],
    queryFn: () => fetchKnowledgeBaseChildren(knowledgeBaseID, '/'),
    enabled: !!knowledgeBaseID,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading knowledge base</div>;
  }

  return (
    <div className="KnowledgeBaseListView-container">
      {rootResources?.map((resource) => (
        <KnowledgeBaseListNode key={`root-${resource.resource_id}`} resource={resource} />
      ))}
    </div>
  );
}
