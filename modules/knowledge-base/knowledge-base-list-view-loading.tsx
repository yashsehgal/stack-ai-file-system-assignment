import { Skeleton } from '@/components/ui/skeleton';

export function KnowledgeBaseListViewLoading(): JSX.Element {
  return (
    <div className="KnowledgeBaseListViewLoading-container grid gap-2 px-2">
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
    </div>
  );
}
