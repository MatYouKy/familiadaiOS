export type ConnectType = 'success' | 'pending' | 'error' | null;

export interface IConnect {
  status: ConnectType
  message: string;
  ipAddress: string | null;
}