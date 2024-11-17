'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TABLER_ICON } from '@/constants/tabler';
import { IconBrain, IconUpload } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { ChangeEvent, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContext } from '../contexts/application-context';
import { GoogleDriveUpload } from '../google-drive-upload';
import { KNOWLEDGE_BASE_RENAME_STATE_DELAY } from './constants/main';

export function KnowledgeBaseNavigation(): JSX.Element {
  const { knowledgeBaseTitle, setKnowledgeBaseTitle } = useContext(ApplicationContext);
  const [knowledgeBaseTitleInput, setKnowledgeBaseTitleInput] = useState<string>(
    knowledgeBaseTitle || INITIAL_APPLICATION_CONTEXT_DATA.knowledgeBaseTitle,
  );
  const [showRenameMessage, setShowRenameMessage] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleKnowledgeBaseTitleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setKnowledgeBaseTitleInput(e.target.value as string);
  };

  const handleUpdateKnowledgeBaseTitle = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return;

    if (!knowledgeBaseTitleInput.length) {
      setKnowledgeBaseTitleInput(knowledgeBaseTitle as string);
      return;
    }

    setKnowledgeBaseTitle(knowledgeBaseTitleInput);
    setShowRenameMessage(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    e.currentTarget.blur();

    // Set new timeout and store reference
    timeoutRef.current = setTimeout(() => {
      setShowRenameMessage(false);
    }, KNOWLEDGE_BASE_RENAME_STATE_DELAY);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="KnowledgeBaseNavigation-container border-b p-2 flex items-center justify-between">
      <div className="flex items-center justify-start gap-1.5">
        <IconBrain size={TABLER_ICON.SIZE} />
        <p className="font-medium text-sm cursor-pointer">Knowledge Base</p>/
        <Input
          value={knowledgeBaseTitleInput}
          className="w-fit"
          onChange={handleKnowledgeBaseTitleInputChange}
          onKeyDown={handleUpdateKnowledgeBaseTitle}
        />
        {showRenameMessage ? (
          <motion.span
            key="renamed-animated-text"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-neutral-500 text-sm ml-1.5">
            Renamed
          </motion.span>
        ) : null}
      </div>
      <div className="NavigationOptions-container flex items-center justify-end gap-1.5">
        <Button variant="secondary" size="sm">
          Share
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" leftIcon={IconUpload}>
              Upload files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <GoogleDriveUpload />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
