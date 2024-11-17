import { IconBrandGoogleDrive } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT } from './interfaces/main';
import { GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT_CONTENT } from './constants/main';

export function GoogleDriveFileTreeLoading(): JSX.Element {
  const [loadingSupportText, setLoadingSupportText] = useState<GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT>(
    GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT.SETUP,
  );

  useEffect(() => {
    const supportTextToggleInterval = setInterval(() => {
      if (loadingSupportText === GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT.SETUP) {
        setLoadingSupportText(GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT.FETCHING);
      } else {
        setLoadingSupportText(GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT.SETUP);
      }
    }, 2000);

    return () => clearInterval(supportTextToggleInterval);
  }, [loadingSupportText]);

  return (
    <div className="py-12 flex flex-col items-center justify-center gap-2">
      <IconBrandGoogleDrive size={36} />
      <motion.p
        key={loadingSupportText}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-neutral-500 text-sm font-medium">
        {GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT_CONTENT[loadingSupportText]}
      </motion.p>
    </div>
  );
}
