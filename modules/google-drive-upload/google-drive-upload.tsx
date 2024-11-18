'use client';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { handleKnowledgeBaseCreation } from '@/services/manage-knowledge-base';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { GoogleDriveFileTree } from './google-drive-file-tree';
import { useToast } from '@/hooks/use-toast';

export function GoogleDriveUpload({ closeModal }: { closeModal: () => void }): JSX.Element {
  const { googleDriveSelectedFiles, setGoogleDriveSelectedFiles, setKnowledgeBaseID } = useContext(ApplicationContext);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!googleDriveSelectedFiles.length) {
      setError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const knowledgeBaseID = await handleKnowledgeBaseCreation(googleDriveSelectedFiles);
      if (typeof knowledgeBaseID !== 'undefined' && !!knowledgeBaseID) {
        setKnowledgeBaseID(knowledgeBaseID);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      // Restting the selection state and closing the google drive upload modal
      setIsUploading(false);
      setGoogleDriveSelectedFiles(INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles);
      closeModal();
      toast({
        title: 'Knowledge Base Upload Successful',
        description: 'Uploaded the selected Google Drive files in Knowledge Base',
      });
    }
  };

  // Handler+supporting method for deselecting all the selected files in google drive flow
  const handleDeselectAll = (): void => {
    setGoogleDriveSelectedFiles(INITIAL_APPLICATION_CONTEXT_DATA.googleDriveSelectedFiles);
  };

  // Preset condition for storing the state for showing primary actions
  // Should only show primary actions when google drive files are selected
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
              <Button size="sm" className="shrink-0" onClick={handleUpload} isLoading={isUploading}>
                Upload {googleDriveSelectedFiles.length} {googleDriveSelectedFiles.length === 1 ? 'file' : 'files'}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
