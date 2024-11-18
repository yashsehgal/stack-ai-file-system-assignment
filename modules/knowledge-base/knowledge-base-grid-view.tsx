'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ApplicationContext } from '../contexts/application-context';
import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';
import { useContext, useMemo, useState } from 'react';
import { KnowledgeBaseGridNode } from './knowledge-base-grid-node';
import { IconChevronRight } from '@tabler/icons-react';
import { TABLER_ICON } from '@/constants/tabler';
import { motion } from 'framer-motion';
import { KnowldgeBaseGridViewLoading } from './knowledge-base-grid-view-loading';

export function KnowledgeBaseGridView(): JSX.Element {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const { knowledgeBaseID, knowledgeBaseData, searchQuery } = useContext(ApplicationContext);

  const {
    data: resources,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['knowledge-base', knowledgeBaseID, currentPath],
    queryFn: async () => {
      if (!knowledgeBaseID) return [];
      return fetchKnowledgeBaseChildren(knowledgeBaseID, currentPath);
    },
    enabled: !!knowledgeBaseID,
  });

  const filteredResources = useMemo(() => {
    if (!resources || !searchQuery) return resources || [];
    const lowerQuery = searchQuery.toLowerCase();
    return resources.filter((resource) => {
      const name = resource.inode_path.path.split('/').pop()?.toLowerCase() || '';
      return name.includes(lowerQuery);
    });
  }, [resources, searchQuery]);

  const breadcrumbItems = useMemo(() => {
    const paths = currentPath.split('/').filter(Boolean);
    return ['Home', ...paths];
  }, [currentPath]);

  if (knowledgeBaseData.length === 0) {
    return <div>No files found</div>;
  }

  if (isLoading) return <KnowldgeBaseGridViewLoading />;
  if (isError) return <div>Error loading resources</div>;

  return (
    <div className="space-y-4 p-4">
      <Breadcrumb className="flex items-center gap-1">
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index} className="text-sm font-medium cursor-pointer">
            {index === breadcrumbItems.length - 1 ? (
              <motion.p
                key={`breadcrumb-item-${Math.random()}`}
                initial={{ opacity: 0, x: index === 0 ? 0 : -12 }}
                animate={{ opacity: 1, x: 0 }}>
                {item}
              </motion.p>
            ) : (
              <BreadcrumbLink
                className="text-blue-500 hover:text-blue-600"
                onClick={() => setCurrentPath('/' + breadcrumbItems.slice(1, index + 1).join('/'))}>
                {item}
              </BreadcrumbLink>
            )}
            {index < breadcrumbItems.length - 1 && <IconChevronRight size={TABLER_ICON.SIZE} />}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <div className="flex flex-wrap gap-4">
        {filteredResources.map((resource) => (
          <KnowledgeBaseGridNode key={resource.resource_id} resource={resource} onNavigate={setCurrentPath} />
        ))}
      </div>
    </div>
  );
}
