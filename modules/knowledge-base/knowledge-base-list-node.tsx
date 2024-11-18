'use client';
import { TABLER_ICON } from '@/constants/tabler';
import { cn } from '@/lib/utils';
import { Resource } from '@/services/interfaces';
import { IconChevronRight, IconFile, IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';
import { KnowledgeBaseListNodeProps } from './interfaces/main';
import { fetchKnowledgeBaseChildren } from '@/services/manage-knowledge-base';
import { getSpecificFile } from '@/services/google-drive-setup';
import { ApplicationContext } from '../contexts/application-context';

export function KnowledgeBaseListNode({ resource, level = 1 }: KnowledgeBaseListNodeProps): JSX.Element {
  const [isNodeOpen, setIsNodeOpen] = useState<boolean>(false);
  const { knowledgeBaseID } = useContext(ApplicationContext);

  const {
    data: children,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['knowledge-base-children', resource.inode_path.path, knowledgeBaseID],
    queryFn: async () => {
      if (!knowledgeBaseID) return [];

      // For folders, fetch their contents using the path
      if (resource.inode_type === 'directory') {
        const path = `${resource.inode_path.path}/`;
        return fetchKnowledgeBaseChildren(knowledgeBaseID, path);
      }
      return [];
    },
    enabled: isNodeOpen && resource.inode_type === 'directory' && !!knowledgeBaseID,
  });

  const IS_FOLDER = resource.inode_type === 'directory';
  const NODE_NAME = resource.inode_path.path.split('/').pop() ?? 'Unnamed';

  return (
    <div>
      <div
        className={cn('flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer select-none pr-6')}
        style={{ paddingLeft: `${level * 20}px` }}>
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
      </div>

      {isNodeOpen && IS_FOLDER && (
        <div>
          {isLoading && (
            <div className="pl-8" style={{ paddingLeft: `${level * 20 + 40}px` }}>
              Loading...
            </div>
          )}
          {isError && (
            <div className="text-red-500 pl-8" style={{ paddingLeft: `${level * 20 + 40}px` }}>
              Error loading contents
            </div>
          )}
          {children?.map((child: Resource) => (
            <KnowledgeBaseListNode key={`node-${child.resource_id}`} resource={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
