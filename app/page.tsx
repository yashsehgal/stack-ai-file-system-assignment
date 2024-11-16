import { KnowledgeBase } from '@/modules/knowledge-base';
import { ApplicationContextProvider } from '@/modules/providers/application-context-provider';

export default function App(): JSX.Element {
  return (
    <div className="App-container">
      <ApplicationContextProvider>
        <KnowledgeBase />
      </ApplicationContextProvider>
    </div>
  );
}
