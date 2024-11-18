'use client';
import { TABLER_ICON } from '@/constants/tabler';
import { cn } from '@/lib/utils';
import { Resource } from '@/services/interfaces';
import { IconChevronRight, IconFile, IconFolder, IconFolderOpen, IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useMemo, useState } from 'react';
import { KnowledgeBaseListNodeProps } from './interfaces/main';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';
import { ApplicationContext } from '../contexts/application-context';
import { KnowledgeBaseListNodeLoading } from './knowledge-base-list-node-loading';
import { KnowledgeBaseListNodeErrorState } from './knowledge-base-list-node-error-state';

export function KnowledgeBaseListNode({ resource, level = 1 }: KnowledgeBaseListNodeProps): JSX.Element | null {
  const [isNodeOpen, setIsNodeOpen] = useState<boolean>(false);
  const { knowledgeBaseID, removeKnowledgeBaseResources, updateKnowledgeBaseWithChildren, knowledgeBaseData, searchQuery } =
    useContext(ApplicationContext);

  // Resource existence check
  const resourceExists = useMemo(
    () => knowledgeBaseData.some((item) => item.resource_id === resource.resource_id),
    [knowledgeBaseData, resource.resource_id],
  );

  const {
    data: children,
    isLoading: isKnowledgeBaseFileNodeLoading,
    isError: isKnowledgeBaseFileNodeFailed,
  } = useQuery({
    queryKey: ['knowledge-base-children', resource.inode_path.path, knowledgeBaseID],
    queryFn: async () => {
      if (!knowledgeBaseID) return [];

      if (resource.inode_type === 'directory') {
        const path = `${resource.inode_path.path}/`;
        const children = await fetchKnowledgeBaseChildren(knowledgeBaseID, path);
        updateKnowledgeBaseWithChildren(path, children);
        return children;
      }
      return [];
    },
    enabled: isNodeOpen && resource.inode_type === 'directory' && !!knowledgeBaseID,
  });

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (resource.inode_type === 'directory') {
        const confirmed = window.confirm('Are you sure you want to remove this folder and all its contents?');
        if (!confirmed) return;
      }
      removeKnowledgeBaseResources(resource.resource_id);
    },
    [resource, removeKnowledgeBaseResources],
  );

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    if (!searchQuery) return children;

    const lowerQuery = searchQuery.toLowerCase();

    return children.filter((child) => {
      const name = child.inode_path.path.split('/').pop()?.toLowerCase() || '';
      return name.includes(lowerQuery);
    });
  }, [children, searchQuery]);

  // Check if current resource matches search
  const matchesSearch = useMemo(() => {
    if (!searchQuery) return true;

    const name = resource.inode_path.path.split('/').pop()?.toLowerCase() || '';
    const lowerQuery = searchQuery.toLowerCase();

    // Always show folders if they have matching children
    if (resource.inode_type === 'directory' && filteredChildren.length > 0) {
      return true;
    }

    return name.includes(lowerQuery);
  }, [resource, searchQuery, filteredChildren]);

  // Preset condition for checking for folders
  const IS_FOLDER = resource.inode_type === 'directory';
  // Present value before rendering the node name (folder or file name)
  const NODE_NAME = resource.inode_path.path.split('/').pop() ?? 'Unnamed';

  // Now we can do the conditional render after all hooks
  if (!resourceExists || !matchesSearch) {
    return null;
  }

  return (
    <div>
      <div
        className={cn('flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer select-none pr-6')}
        style={{ paddingLeft: `${level * 10}px` }}>
        <div className="flex items-center gap-2 flex-1" onClick={() => IS_FOLDER && setIsNodeOpen(!isNodeOpen)}>
          {IS_FOLDER ? (
            <>
              <IconChevronRight size={TABLER_ICON.SIZE} className={cn('transition-all', isNodeOpen ? 'rotate-90' : '')} />
              {isNodeOpen ? (
                <IconFolderOpen size={TABLER_ICON.SIZE} className="fill-blue-400" />
              ) : (
                <IconFolder size={TABLER_ICON.SIZE} className="fill-blue-400" />
              )}
            </>
          ) : (
            <div className="ml-5">
              <IconFile size={TABLER_ICON.SIZE} />
            </div>
          )}
          <span className="ml-2 text-sm">{NODE_NAME}</span>
        </div>
        <button onClick={handleRemove} className="p-1 hover:bg-red-100 rounded-full">
          <IconTrash size={16} className="text-red-500" />
        </button>
      </div>

      {isNodeOpen && IS_FOLDER && (
        <div>
          {isKnowledgeBaseFileNodeLoading && <KnowledgeBaseListNodeLoading level={level} />}
          {isKnowledgeBaseFileNodeFailed && (
            <div className="pr-6" style={{ paddingLeft: `${level * 20 + 40}px` }}>
              <KnowledgeBaseListNodeErrorState />
            </div>
          )}
          {filteredChildren.map((child: Resource) => (
            <KnowledgeBaseListNode key={`node-${child.resource_id}`} resource={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
