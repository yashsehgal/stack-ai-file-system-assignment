import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function GoogleDriveUpload(): JSX.Element {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload using Google Drive</DialogTitle>
      </DialogHeader>
      <div className="GoogleDriveUpload-container"></div>
      <DialogFooter className="sm:justify-between gap-2">
        <Button size="sm" variant="secondary" className="shrink-0">
          Cancel
        </Button>
        <div className="flex sm:items-center sm:justify-end gap-2 flex-col sm:flex-row w-full items-stretch">
          <Button variant="ghost" size="sm" className="shrink-0">
            Deselect all
          </Button>
          <Button size="sm" className="shrink-0">
            Upload files
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
