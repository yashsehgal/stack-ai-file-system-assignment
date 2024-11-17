import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { GoogleDriveFileTree } from './google-drive-file-tree';

export function GoogleDriveUpload(): JSX.Element {
  const { googleDriveSelectedFiles, setGoogleDriveSelectedFiles } = useContext(ApplicationContext);

  const handleDeselectAll = (): void => {
    setGoogleDriveSelectedFiles(INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles);
  };

  const SHOW_PRIMARY_ACTIONS: boolean = googleDriveSelectedFiles.length > 0;

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
          {SHOW_PRIMARY_ACTIONS && (
            <motion.div
              key="deselect-all-action"
              onClick={handleDeselectAll}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}>
              <Button variant="ghost" size="sm" className="shrink-0">
                Deselect all
              </Button>
            </motion.div>
          )}
          {SHOW_PRIMARY_ACTIONS && (
            <motion.div key="upload-all-action" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Button size="sm" className="shrink-0">
                Upload {googleDriveSelectedFiles.length} {googleDriveSelectedFiles.length === 1 ? 'file' : 'files'}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
