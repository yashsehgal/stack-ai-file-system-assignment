import { Resource } from '@/services/interfaces';

export interface GoogleDriveFileNodeProps {
  resource: Resource;
  level?: number;
  connectionUrls: { connectionResourcesUrl: string; childrenResourcesUrl: string } | undefined;
}

export enum GOOGLE_DRIVE_FILE_TREE_LOADING_SUPPORT_TEXT {
  SETUP = 'SETUP',
  FETCHING = 'FETCHING',
}
