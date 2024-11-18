import { useContext, useMemo } from 'react';
import { KnowledgeBaseListNode } from './knowledge-base-list-node';
import { ApplicationContext } from '../contexts/application-context';
import { getConnectionUrls } from '@/services/google-drive-setup';
import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';
import { KnowledgeBaseListViewLoading } from './knowledge-base-list-view-loading';
import { KnowledgeBaseListViewErrorState } from './knowledge-base-list-view-error-state';
import { KnowledgeBaseEmptyState } from './knowledge-base-empty-state';

export function KnowledgeBaseListView(): JSX.Element {
  const { knowledgeBaseID, knowledgeBaseData, searchQuery } = useContext(ApplicationContext);

  // React-query block for fetching the root node data of knowledge base
  const {
    data: rootResources,
    isLoading: isKnowledgeBaseListLoading,
    isError: isKnowledgeBaseListFailed,
  } = useQuery({
    queryKey: ['knowledge-base-root', knowledgeBaseID],
    queryFn: async () => {
      if (!knowledgeBaseID) return [];
      const resources = await fetchKnowledgeBaseChildren(knowledgeBaseID, '/');
      return resources;
    },
    enabled: !!knowledgeBaseID,
  });

  // Handler method to filtering of root level files and folders
  const filteredRootResources = useMemo(() => {
    if (!rootResources) return [];
    if (!searchQuery) return rootResources;

    const lowerQuery = searchQuery.toLowerCase();

    return rootResources.filter((resource) => {
      const name = resource.inode_path.path.split('/').pop()?.toLowerCase() || '';
      // For files, check if name matches search
      if (resource.inode_type === 'file') {
        return name.includes(lowerQuery);
      }
      // Always keep folders in filtered results as they might contain matching files
      return true;
    });
  }, [rootResources, searchQuery]);

  // Show empty state if no data
  if (knowledgeBaseData.length === 0) {
    return <KnowledgeBaseEmptyState />;
  }

  if (isKnowledgeBaseListLoading) return <KnowledgeBaseListViewLoading />;
  if (isKnowledgeBaseListFailed) return <KnowledgeBaseListViewErrorState />;

  return (
    <div className="KnowledgeBaseListView-container">
      {filteredRootResources.map((resource) => (
        <KnowledgeBaseListNode key={`root-${resource.resource_id}`} resource={resource} />
      ))}
    </div>
  );
}
