import { Button } from '@/components/ui/button';
import { GOOGLE_DRIVE_LINK, STACK_AI_CONTACT_EMAIL_ADDRESS_LINK } from '@/constants/main';
import { IconBrandGoogleDrive } from '@tabler/icons-react';

export function GoogleDriveFileTreeEmptyState(): JSX.Element {
  const handleGoToGoogleDrive = () => {
    if (window && typeof window !== 'undefined') {
      window.open(GOOGLE_DRIVE_LINK);
    }
  };

  const handleContactUS = () => {
    if (window && typeof window !== 'undefined') {
      window.open(STACK_AI_CONTACT_EMAIL_ADDRESS_LINK);
    }
  };

  return (
    <div className="GoogleDriveFileTreeEmptyState-container py-6 flex items-center justify-center">
      <div className="EmptyState-content-wrapper flex flex-col items-start gap-1 mt-1 w-fit">
        <h2 className="font-semibold text-base">No files and folders found</h2>
        <p className="text-neutral-500 mt-2">We&apos;re not able to find any resources in your Google Drive</p>
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={handleGoToGoogleDrive} leftIcon={IconBrandGoogleDrive}>
            Please check your Google Drive
          </Button>
          <Button variant="ghost" onClick={handleContactUS}>
            Still having issues? Contact us
          </Button>
        </div>
      </div>
    </div>
  );
}
