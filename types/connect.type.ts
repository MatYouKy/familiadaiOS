export type DevicesType = 'GAME-BOARD' | 'ADMIN-BOARD' | 'ADMIN-TABLET' | 'PULPIT' | 'ADMIN-PULPIT';


export interface IDevices {
  desktopIsActive: boolean;
  pulpitIsActive: boolean;
}