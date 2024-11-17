import { useContext } from 'react';
import { ApplicationContext } from '../contexts/application-context';
import { useQuery } from '@tanstack/react-query';
import { getConnectionUrls, getRootResources } from '@/services/google-drive-setup';
import { IconLoader2 } from '@tabler/icons-react';
import { GoogleDriveFileNode } from './google-drive-file-node';

export function GoogleDriveFileTree(): JSX.Element {
  const {
    data: urls,
    isLoading: urlsLoading,
    isError: urlsError,
  } = useQuery({
    queryKey: ['fetch-connection-urls'],
    queryFn: getConnectionUrls,
  });

  const {
    data: rootResources,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch-root-resources'],
    queryFn: getRootResources,
    enabled: !!urls, // Only fetch root resources after we have the URLs
  });

  if (isLoading || urlsLoading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <IconLoader2 size={16} className="animate-spin" />
        <span>Loading file structure...</span>
      </div>
    );
  }

  if (isError || urlsError) {
    return <div className="text-red-500 p-4">Error loading file structure. Please try again later.</div>;
  }

  if (!rootResources) {
    return <div className="p-4">No files found</div>;
  }

  return (
    <div className="border rounded-lg">
      {rootResources.map((resource) => (
        <GoogleDriveFileNode key={`root-${resource.resource_id}`} resource={resource} connectionUrls={urls} />
      ))}
    </div>
  );
}
