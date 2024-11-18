# Knowledge base setup via Google Drive

**Quick actions**

- [See the usable vercel deployment](https://stack-ai-file-system-assignment.vercel.app/)
- [See the demo video and code walkthrough](https://drive.google.com/file/d/1hg5IV8poRG4M3ENngaXHX1nbhrLE_8Xd/view?usp=drive_link)

This project contains code for my Stack AI Frontend Engineer Assignment. The task was to create a live-synced knowledge base system with Stack AI using Google Drive for file and document uploads.

**The project user experience and flow can be tested by the following steps:**

- Click on upload > A google drive file system will open
- Select files that you want to upload and click on upload. You can also deselect files.
- Once the upload is done, the knowledge base which is sycned with Stack AI workflow builder will get rendered in the same format, the Google Drive files are uploaded.
- You can explore and test the following features then:
  - Filter folders and files using the search input in the header section.
  - Toggle to List and Grid view for better experience.

**Technologies and coding concepts used**

- NextJS
- TailwindCSS
- Typescript
- Vercel for deployment
- TanStack React Query for data fetching methods
- Axios for writing APIs
- Context API to store the complete applications context as a single source of truth.

**How to setup the project locally**

To setup this project, follow the mentioned steps:

- Clone the repository in your local machine.
- Run the command mentioned below to install all the dependencies and run the project.
  ```
  yarn && yarn dev
  ```
- Contact for `.env` keys for running Google Drive and Knowledge base modules.

**Coding pattern**

- `app` - All the routed pages are present inside.
- `modules` - All the modules such as **Google Drive** and **Knowledge Base** are present as modules.
- `components` - Storing all the shared components and shadcn components.
- `constants` - Shared constants across the project.
- `services` - All the services related to available modules i.e. **Google Drive Setup** and **Knowledge Base Management**
- `providers` - All the shared providers are available. This folder convention is also available for **ApplicationContext** inside nested folders.
- `interfaces` - All the nested folders have their own interfaces, types and enums present relatively inside modules and other components.
- `contexts` - For storing the contexts related to application.
