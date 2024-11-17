import { TABLER_ICON } from '@/constants/tabler';
import { fetchFolderContents } from '@/services/google-drive-setup';
import { Resource } from '@/services/interfaces';
import { IconChevronDown, IconChevronRight, IconFile, IconFolder, IconLoader2 } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export interface GoogleDriveFileNodeProps {
  resource: Resource;
  level?: number;
  connectionUrls: { connectionResourcesUrl: string; childrenResourcesUrl: string } | undefined;
}

export function GoogleDriveFileNode({ resource, level = 0, connectionUrls }: GoogleDriveFileNodeProps): JSX.Element {
  const [isNodeOpen, setIsNodeOpen] = useState<boolean>(false);

  const {
    data: children,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['folder', resource.resource_id],
    queryFn: () => (connectionUrls ? fetchFolderContents(resource.resource_id, connectionUrls.childrenResourcesUrl) : Promise.resolve([])),
    enabled: isNodeOpen && resource.inode_type === 'directory' && !!connectionUrls,
  });

  const NODE_INDENTATION: number = level * 20;
  const IS_FOLDER = resource.inode_type === 'directory';

  console.log('Resource:', {
    type: resource.inode_type,
    path: resource.inode_path,
    id: resource.resource_id,
  });

  const NODE_NAME: string = resource.inode_path?.path.split('/').pop() ?? 'Unnamed';

  return (
    <div>
      <div
        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
        style={{ paddingLeft: `${NODE_INDENTATION}px` }}
        onClick={() => IS_FOLDER && setIsNodeOpen(!isNodeOpen)}>
        <div className="flex items-center gap-2">
          {IS_FOLDER ? (
            <>
              {isNodeOpen ? <IconChevronDown size={TABLER_ICON.SIZE} /> : <IconChevronRight size={TABLER_ICON.SIZE} />}
              <IconFolder size={TABLER_ICON.SIZE} />
            </>
          ) : (
            <div className="ml-5">
              <IconFile size={TABLER_ICON.SIZE} />
            </div>
          )}
          <span className="ml-2">{NODE_NAME}</span>
        </div>
      </div>

      {isNodeOpen && IS_FOLDER && (
        <div key={`children-${resource.resource_id}`}>
          {isLoading && (
            <div
              key={`loading-${resource.resource_id}`}
              className="flex items-center gap-2 pl-8"
              style={{ paddingLeft: `${NODE_INDENTATION + 40}px` }}>
              <IconLoader2 size={16} className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {isError && (
            <div key={`error-${resource.resource_id}`} className="text-red-500 pl-8" style={{ paddingLeft: `${NODE_INDENTATION + 40}px` }}>
              Error loading folder contents
            </div>
          )}

          {children?.map((child: Resource) => (
            <GoogleDriveFileNode key={`node-${child.resource_id}`} resource={child} level={level + 1} connectionUrls={connectionUrls} />
          ))}
        </div>
      )}
    </div>
  );
}
