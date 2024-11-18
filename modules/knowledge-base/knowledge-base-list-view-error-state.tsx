import { Button } from '@/components/ui/button';

export function KnowledgeBaseListViewErrorState(): JSX.Element {
  const handleTryAgainReload = () => {
    if (window && typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  return (
    <div className="KnowledgeBaseListViewErrorState-container py-24 flex items-center justify-center">
      <div className="ErrorState-content-wrapper flex flex-col items-start gap-1 mt-1 w-[320px]">
        <h2 className="font-semibold text-base">Not able to load Knowledge Base</h2>
        <p className="text-neutral-500 mt-2">
          Unfortunately! We&apos;re not able to load the knowledge base. Please try again by reloading!
        </p>
        <Button className="mt-4" onClick={handleTryAgainReload}>
          Try reloading
        </Button>
      </div>
    </div>
  );
}
