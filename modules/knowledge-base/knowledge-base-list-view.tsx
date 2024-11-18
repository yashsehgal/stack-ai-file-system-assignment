import { useContext, useMemo } from 'react';
import { KnowledgeBaseListNode } from './knowledge-base-list-node';
import { ApplicationContext } from '../contexts/application-context';
import { getConnectionUrls } from '@/services/google-drive-setup';
import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';

export function KnowledgeBaseListView(): JSX.Element {
  const { knowledgeBaseID, knowledgeBaseData } = useContext(ApplicationContext);

  const {
    data: rootResources,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['knowledge-base-root', knowledgeBaseID],
    queryFn: async () => {
      if (!knowledgeBaseID) return [];
      const resources = await fetchKnowledgeBaseChildren(knowledgeBaseID, '/');
      return resources;
    },
    enabled: !!knowledgeBaseID,
  });

  // Show empty state if no data
  if (knowledgeBaseData.length === 0) {
    return <div>No files or folders found</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading knowledge base</div>;

  return (
    <div className="KnowledgeBaseListView-container">
      {rootResources?.map((resource) => (
        <KnowledgeBaseListNode key={`root-${resource.resource_id}`} resource={resource} />
      ))}
    </div>
  );
}
