import { Skeleton } from '@/components/ui/skeleton';

export function KnowldgeBaseGridViewLoading(): JSX.Element {
  return (
    <div className="KnowldgeBaseGridViewLoading-container p-6 flex flex-wrap gap-4">
      {Array(12)
        .fill('')
        .map((_, index) => {
          return <Skeleton key={index} className="w-[180px] h-[180px]" />;
        })}
    </div>
  );
}
