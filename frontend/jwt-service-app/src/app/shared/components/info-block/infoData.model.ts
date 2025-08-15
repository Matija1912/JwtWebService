export type InfoType = 'danger' | 'success' | 'info';

export class InfoData {
  infoType: InfoType | null = null;
  message: string | null = null;
}
