import { getConnectionUrls, getRootResources } from '@/services/google-drive-setup';
import { useQuery } from '@tanstack/react-query';
import { GoogleDriveFileNode } from './google-drive-file-node';
import { GoogleDriveFileTreeLoading } from './google-drive-file-tree-loading';

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
    return <GoogleDriveFileTreeLoading />;
  }

  if (isError || urlsError) {
    return <div className="text-red-500 p-4">Error loading file structure. Please try again later.</div>;
  }

  if (!rootResources) {
    return <div className="p-4">No files found</div>;
  }

  return (
    <div className=" max-h-[400px] overflow-y-scroll">
      {rootResources.map((resource) => (
        <GoogleDriveFileNode key={`root-${resource.resource_id}`} resource={resource} connectionUrls={urls} />
      ))}
    </div>
  );
}
