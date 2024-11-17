import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoogleDriveFileTree } from './google-drive-file-tree';

export function GoogleDriveUpload(): JSX.Element {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload using Google Drive</DialogTitle>
      </DialogHeader>
      <div className="GoogleDriveUpload-container">
        <GoogleDriveFileTree />
      </div>
      <DialogFooter className="sm:justify-between gap-2">
        <DialogClose asChild>
          <Button size="sm" variant="secondary" className="shrink-0">
            Cancel
          </Button>
        </DialogClose>
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
