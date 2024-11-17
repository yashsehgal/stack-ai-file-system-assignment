import { TABLER_ICON } from '@/constants/tabler';
import { cn } from '@/lib/utils';
import { fetchFolderContents } from '@/services/google-drive-setup';
import { Resource } from '@/services/interfaces';
import { IconChevronRight, IconFile, IconFolder, IconFolderFilled, IconLoader2 } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';
import { GoogleDriveFileNodeProps } from './interfaces/main';
import { GoogleDriveFileNodeLoading } from './google-drive-file-node-loading';
import { Checkbox } from '@/components/ui/checkbox';
import { ApplicationContext } from '../contexts/application-context';
import { CheckedState } from '@radix-ui/react-checkbox';

export function GoogleDriveFileNode({ resource, level = 1, connectionUrls }: GoogleDriveFileNodeProps): JSX.Element {
  const { googleDriveSelectedFiles, setGoogleDriveSelectedFiles } = useContext(ApplicationContext);
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

  const IS_FOLDER = resource.inode_type === 'directory';
  const NODE_NAME: string = resource.inode_path?.path.split('/').pop() ?? 'Unnamed';

  // Simple checked state for files only
  const isFileSelected = !IS_FOLDER && googleDriveSelectedFiles.some((file) => file.resource_id === resource.resource_id);

  // Simple handler for file selection only
  const handleFileSelection = useCallback(
    (checked: boolean) => {
      setGoogleDriveSelectedFiles((prev) => {
        if (checked) {
          return [...prev, resource];
        } else {
          return prev.filter((file) => file.resource_id !== resource.resource_id);
        }
      });
    },
    [resource, setGoogleDriveSelectedFiles],
  );

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer select-none pr-6',
          isFileSelected && 'bg-blue-100 hover:bg-blue-100',
        )}
        style={{ paddingLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-2 flex-1" onClick={() => IS_FOLDER && setIsNodeOpen(!isNodeOpen)}>
          {IS_FOLDER ? (
            <>
              <IconChevronRight size={TABLER_ICON.SIZE} className={cn('transition-all', isNodeOpen ? 'rotate-90' : '')} />
              <IconFolderFilled size={TABLER_ICON.SIZE} className="text-blue-400" />
            </>
          ) : (
            <div className="ml-5">
              <IconFile size={TABLER_ICON.SIZE} />
            </div>
          )}
          <span className="ml-2 text-sm">{NODE_NAME}</span>
        </div>
        {!IS_FOLDER && (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={isFileSelected} onCheckedChange={handleFileSelection} />
          </div>
        )}
      </div>

      {isNodeOpen && IS_FOLDER && (
        <div>
          {isLoading && <GoogleDriveFileNodeLoading level={level} />}
          {isError && (
            <div className="text-red-500 pl-8" style={{ paddingLeft: `${level * 20 + 40}px` }}>
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
