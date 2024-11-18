'use client';
import { useContext } from 'react';
import { ApplicationContext } from '../contexts/application-context';
import { KNOWLEDGE_BASE_CONTENT_VIEW } from './interfaces/main';
import { Button } from '@/components/ui/button';
import { IconLayout2, IconLayout2Filled, IconLayoutList, IconLayoutListFilled } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { KnowledgeBaseGridView } from './knowledge-base-grid-view';
import { KnowledgeBaseListView } from './knowledge-base-list-view';

export function KnowledgeBaseContent(): JSX.Element {
  const { knowledgeBaseContentView, setKnowledgeBaseContentView, searchQuery, setSearchQuery } = useContext(ApplicationContext);

  // Preset conditions for checks and conditional rendering
  const HAS_LIST_VIEW: boolean = knowledgeBaseContentView === (KNOWLEDGE_BASE_CONTENT_VIEW.LIST as const);
  const HAS_GRID_VIEW: boolean = knowledgeBaseContentView === (KNOWLEDGE_BASE_CONTENT_VIEW.GRID as const);

  // Handler method to update the searchQuery inside context, used for filtering files
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value as string);
  };

  const SHOW_CONTENT_VIEW_OPTIONS: boolean = false as const;

  return (
    <div className="KnowledgeBaseContent-container">
      <header className="KnowledgeBaseContent-header flex items-center justify-between p-2 border-b">
        <div className="KnowledgeBaseContent-contentView-options-container flex items-center justify-end gap-1.5">
          {SHOW_CONTENT_VIEW_OPTIONS && (
            <>
              <Button
                size="sm"
                leftIcon={HAS_LIST_VIEW ? IconLayoutListFilled : IconLayoutList}
                variant={HAS_LIST_VIEW ? 'default' : 'ghost'}
                onClick={() => setKnowledgeBaseContentView(KNOWLEDGE_BASE_CONTENT_VIEW.LIST)}>
                List
              </Button>
              <Button
                size="sm"
                leftIcon={HAS_GRID_VIEW ? IconLayout2Filled : IconLayout2}
                variant={HAS_GRID_VIEW ? 'default' : 'ghost'}
                onClick={() => setKnowledgeBaseContentView(KNOWLEDGE_BASE_CONTENT_VIEW.GRID)}>
                Grid
              </Button>
            </>
          )}
        </div>
        <div className="KnowledgeBaseContent-searchOptions-container">
          <Input
            className="w-[240px]"
            placeholder="Search for files and folders"
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </header>
      <div className="KnowledgeBaseContent-dataList-container py-4">
        {HAS_LIST_VIEW && <KnowledgeBaseListView />}
        {HAS_GRID_VIEW && <KnowledgeBaseGridView />}
      </div>
    </div>
  );
}
