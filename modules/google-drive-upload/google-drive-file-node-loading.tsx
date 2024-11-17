import { Skeleton } from '@/components/ui/skeleton';

export function GoogleDriveFileNodeLoading({ level }: { level: number }): JSX.Element {
  const NODE_INDENTATION: number = level * 20;
  return (
    <div className="py-2 grid gap-2 pr-6" style={{ paddingLeft: `${NODE_INDENTATION + 40}px` }}>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
    </div>
  );
}
