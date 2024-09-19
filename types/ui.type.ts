import { ColorAliases } from '@__colors/colorBase';
import { SvgProps } from 'react-native-svg';

export type ActionIconType =
  | 'ADD'
  | 'EDIT'
  | 'DELETE'
  | 'PLAY'
  | 'REFRESH'
  | 'SWAP'
  | 'INFO'
  | 'AWARD'
  | 'UNDO'
  | 'REDO'
  | 'BACK';

export type SizeAliases = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

export interface CustomSVGIntrface extends Omit<SvgProps, 'fill'>  {
  color: ColorAliases;
  fill?: ColorAliases;
}

export interface IModalAction {
  isOpen: boolean;
  onClose: () => void;
}
