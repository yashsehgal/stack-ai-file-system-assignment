'use client';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { GoogleDriveFileTree } from './google-drive-file-tree';
import { getConnection, getOrganizationId } from '@/services/google-drive-setup';
import { handleKnowledgeBaseCreation } from '@/services/manage-knowledge-base';

export function GoogleDriveUpload(): JSX.Element {
  const { googleDriveSelectedFiles, setGoogleDriveSelectedFiles } = useContext(ApplicationContext);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!googleDriveSelectedFiles.length) {
      setError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await handleKnowledgeBaseCreation(googleDriveSelectedFiles);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

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
              <Button size="sm" className="shrink-0" onClick={handleUpload}>
                Upload {googleDriveSelectedFiles.length} {googleDriveSelectedFiles.length === 1 ? 'file' : 'files'}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
