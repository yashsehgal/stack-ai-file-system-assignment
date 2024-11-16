import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TABLER_ICON } from '@/constants/tabler';
import { IconBrain, IconBrandGoogleDrive, IconUpload } from '@tabler/icons-react';

export function KnowledgeBaseNavigation(): JSX.Element {
  return (
    <nav className="KnowledgeBaseNavigation-container border-b p-2 flex items-center justify-between">
      <div className="flex items-center justify-start gap-1.5">
        <IconBrain size={TABLER_ICON.SIZE} />
        <p className="font-medium text-sm cursor-pointer">Knowledge Base</p>/
        <Input value="Frontend Assignment" readOnly />
      </div>
      <div className="NavigationOptions-container flex items-center justify-end gap-1.5">
        <Button variant="secondary" size="sm">
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" leftIcon={IconUpload}>
              Upload files
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]">
            <DropdownMenuItem>
              <IconBrandGoogleDrive />
              <span>Google Drive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
