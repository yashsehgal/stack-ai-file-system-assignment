# Coding pattern

In this assignment code, I have made sure to follow all the possible NextJS and Typescript practices. As I have used multiple technologies that are not native to NextJS - Thus I have made sure to use the best practices of all the following technologies:

- NextJS
- Typescript
- TailwindCSS
- Shadcn components
- TanStack React Query
- Conext API from React

**What are modules?**

Modules in the project, are the folders containing different parts of the application. The flows related to Google Drive upload, Showing knowledge base resources. Everything is broken down into `modules`.

As a good frontend engineering practice, I have broken down the components and specific modules into multiple small parts/components according to different states of the product. All the UI flows have their state-related components, such as Error state, Empty state, Loading state.

**Components**

I am using [shadcn-ui](https://ui.shadcn.com) components that are also customised with newer styles making the components feel more compact, covering lesser space and look more enterprise-centric.

- The `ui` components are majorly from [shadcn-ui](https://ui.shadcn.com)
- The components for specific modules are present inside the `modules/*` folder itself. For example, Knowledge base module has it's components for all cases and views.

```
modules/
  knowledge-base/
    constants/
    interfaces/
    knowledge-base-content.tsx // For rendering the content for knowledge base (list and grid view handler)
    knowledge-base-empty-state.tsx // Empty state component to show whem there is nothing inside Knowledge Base.
    knowledge-base-grid-node.tsx // The recursive node component for grid view: Card component for files and folders.
    knowledge-base-grid-view-loading.tsx // Loading state component for grid view: Grid of skeleton cards.
    knowledge-base-grid-view.tsx // Grid view wrapper: Recursively rendering grid-node component inside a grid.
    knowledge-base-list-node-error-state.tsx // Error state component for list node component: When file content fetch is failed.
    knowledge-base-list-node-loading.tsx // Loading component to show then list-node is getting fetched.
    knowlegde-base-list-view-error-state.tsx // Error state for list view, when the root content is not loaded.
    knowledge-base-list-view-loading.tsx // Loading state to show when root content is loading.
    knowledge-base-list-view.tsx // List view wrapper for recursively rendering the knowledge base list.
    knowledge-base-navigation.tsx // Navigation component for showing search filter input and content view toggle.
    knowledge-base.tsx // Main module which handles to empty state and knowledge base content rendering.
    index.tsx // Barrel export: forwarding the main module file i.e. knowledge-base.tsx
```

**Naming classes**

I prefer giving unique classes to all the custom react components. The pattern I follow is `{ComponentName}-{optional:sub-category}-{type-of-component}`

- `ComponentName` is the name of the React component
- Optional: `sub-category` is for adding sub-type of the component.
- `type-of-component` shows the type of component (the type of content it is rendering)

For example, If I have an empty state component,

```tsx
export function KnowledgeBaseEmptyState(): JSX.Element {
  return (
    <div className="KnowledgeBaseEmptyState-container">
      <div className="KnowledgeBaseEmptyState-icon-wrapper">
        <IconFile />
      </div>
      <div className="KnowledgeBaseEmptyState-actions-container">
        <Button>Primary action</Button>
        <Button>Secondary action</Button>
      </div>
    </div>
  );
}
```

According to the above code example:

- The first/parent classname `KnowledgeBaseEmptyState-container` where `container` is the `type-of-component`.
- In the children container where an icon is getting rendered, the classname is `KnowledgeBaseEmptyState-icon-wrapper` where `icon` is used to identify the sub-type of the content inside and `wrapper` is used as `type-of-component` as it only wraps a single element.
- In the last one, where I am rendering 2 actions (Primary and Secondary) - The classname is `KnowledgeBaseEmptyState-actions-container` where `actions` justifies the `sub-type` and `container` justifies the `type-of-component` because it is rendering more than one element.
