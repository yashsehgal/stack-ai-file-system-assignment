'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconBrandGoogleDrive, IconBrandNotion, IconDatabase, IconFile, IconFileSpreadsheet, IconPresentation } from '@tabler/icons-react';
import { KNOWLEDGE_BASE_EMPTY_STATE_DOCUMENTATION_URL } from './constants/main';

export function KnowledgeBaseEmptyState({ className, children: _, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <section className={cn('KnowledgeBaseEmptyState-container flex items-center justify-center select-none', className)} {...props}>
      <div className="KnowledgeBaseEmptyState-content-wrapper w-[420px] flex flex-col items-start gap-4">
        <div className="EmptyState-iconSet-wrapper flex items-center gap-1 text-blue-500 -ml-2">
          <IconFile size={40} strokeWidth={1.5} />
          <IconFileSpreadsheet size={40} strokeWidth={1.5} />
          <IconPresentation size={40} strokeWidth={1.5} />
          <IconBrandNotion size={40} strokeWidth={1.5} />
          <IconDatabase size={40} strokeWidth={1.5} />
        </div>
        <div className="EmptyState-content-wrapper flex flex-col items-start gap-2 mt-1">
          <h2 className="font-semibold text-base">Knowledge Base</h2>
          <p className="text-neutral-500">
            Welcome to your Knowledge Base! Here, you can upload files in different formats—documents, images, spreadsheets, and more. Once
            your files are uploaded.
          </p>
          <p className="text-neutral-500 mt-2">
            Get started by adding your files and let us assist you in discovering the answers you&apos;re looking for!
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button leftIcon={IconBrandGoogleDrive}>Upload using Google Drive</Button>
          <Button variant="ghost" onClick={() => window.open(KNOWLEDGE_BASE_EMPTY_STATE_DOCUMENTATION_URL)}>
            Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}
