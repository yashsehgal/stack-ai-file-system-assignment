import { KnowledgeBase } from '@/modules/knowledge-base';
import { ApplicationContextProvider } from '@/modules/providers/application-context-provider';

/**
 * The root page component will be returning modules and views
 * according to the route and state requirements
 *
 * For this demo: We are rendering KnowledgeBase as a module view
 */
export default function App(): JSX.Element {
  return (
    <div className="App-container">
      <ApplicationContextProvider>
        <KnowledgeBase />
      </ApplicationContextProvider>
    </div>
  );
}
