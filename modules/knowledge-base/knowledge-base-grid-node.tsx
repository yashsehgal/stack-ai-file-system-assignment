import { useCallback } from 'react';
import { KnowledgeBaseGridNodeProps } from './interfaces/main';
import { IconFile, IconFolder } from '@tabler/icons-react';

export function KnowledgeBaseGridNode({ resource, onNavigate }: KnowledgeBaseGridNodeProps): JSX.Element {
  const isFolder = resource.inode_type === 'directory';
  const name = resource.inode_path.path.split('/').pop() || 'Unnamed';

  const handleDoubleClick = useCallback(() => {
    if (isFolder) {
      onNavigate(resource.inode_path.path);
    }
  }, [isFolder, resource.inode_path.path, onNavigate]);

  return (
    <div
      className="relative p-12 border rounded-lg hover:bg-gray-50 cursor-pointer truncate w-[180px] select-none shrink-0"
      onDoubleClick={handleDoubleClick}>
      <div className="flex flex-col items-center gap-2">
        {isFolder ? <IconFolder size={40} className="fill-blue-400" /> : <IconFile size={40} />}
        <span className="text-sm text-center line-clamp-2">{name}</span>
      </div>
    </div>
  );
}
