'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TABLER_ICON } from '@/constants/tabler';
import { IconBrain, IconUpload } from '@tabler/icons-react';
import { ChangeEvent, KeyboardEvent, useContext, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { GoogleDriveUpload } from '../google-drive-upload';

export function KnowledgeBaseNavigation(): JSX.Element {
  const [googleDriveModal, setGoogleDriveModal] = useState<boolean>(false);
  const { knowledgeBaseTitle, setKnowledgeBaseTitle, resetSelectedFiles } = useContext(ApplicationContext);
  const [knowledgeBaseTitleInput, setKnowledgeBaseTitleInput] = useState<string>(
    knowledgeBaseTitle || INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle,
  );

  // Simple method for handling the changes in knowledge-base title input
  const handleKnowledgeBaseTitleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setKnowledgeBaseTitleInput(e.target.value as string);
  };

  // Method to handle the knowledge-base title update: When user enters and changes the content inside
  const handleUpdateKnowledgeBaseTitle = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return;

    if (!knowledgeBaseTitleInput.length) {
      setKnowledgeBaseTitleInput(knowledgeBaseTitle as string);
      return;
    }

    // Updating the value of knowledge-base title
    setKnowledgeBaseTitle(knowledgeBaseTitleInput);
    // Making the input blur after the knowledge-base title is renamed
    e.currentTarget.blur();
  };

  return (
    <nav className="KnowledgeBaseNavigation-container border-b p-2 flex items-center justify-between">
      <div className="flex items-center justify-start gap-1.5">
        <IconBrain size={TABLER_ICON.SIZE} />
        <p className="font-medium text-sm cursor-pointer">Knowledge Base</p>/
        <Input
          value={knowledgeBaseTitleInput}
          className="hover:cursor-pointer focus:hover:cursor-text"
          onChange={handleKnowledgeBaseTitleInputChange}
          onKeyDown={handleUpdateKnowledgeBaseTitle}
        />
      </div>
      <div className="NavigationOptions-container flex items-center justify-end gap-1.5">
        <Dialog
          open={googleDriveModal}
          onOpenChange={(checked) => {
            resetSelectedFiles();
            setGoogleDriveModal(checked);
          }}>
          <DialogTrigger asChild>
            <Button size="sm" leftIcon={IconUpload}>
              Upload files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <GoogleDriveUpload closeModal={() => setGoogleDriveModal(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
