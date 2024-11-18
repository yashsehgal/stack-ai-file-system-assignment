import { getConnectionUrls, getRootResources } from '@/services/google-drive-setup';
import { useQuery } from '@tanstack/react-query';
import { GoogleDriveFileNode } from './google-drive-file-node';
import { GoogleDriveFileTreeLoading } from './google-drive-file-tree-loading';
import { GoogleDriveFileTreeErrorState } from './google-drive-file-tree-error-state';
import { GoogleDriveFileTreeEmptyState } from './google-drive-empty-state';

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
    isLoading: isGoogleDriveResourceLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch-root-resources'],
    queryFn: getRootResources,
    enabled: !!urls, // Only fetch root resources after we have the URLs
  });

  if (isGoogleDriveResourceLoading || urlsLoading) {
    return <GoogleDriveFileTreeLoading />;
  }

  if (isError || urlsError) {
    return <GoogleDriveFileTreeErrorState />;
  }

  if (!rootResources) {
    return <GoogleDriveFileTreeEmptyState />;
  }

  return (
    <div className=" max-h-[400px] overflow-y-scroll">
      {rootResources.map((resource) => (
        <GoogleDriveFileNode key={`root-${resource.resource_id}`} resource={resource} connectionUrls={urls} />
      ))}
    </div>
  );
}
