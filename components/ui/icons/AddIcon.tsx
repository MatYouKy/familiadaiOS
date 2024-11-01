import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react'
import Svg, { Path } from 'react-native-svg';

export const AddIcon: FC<CustomSVGIntrface> = ({
  color = 'whiteDefault',
  fill,
  width = 24,
  height = 24,
}) => {
  return (
    <Svg height={width} width={height} viewBox="0 0 512 512">
      <Path
        stroke={fill}
        fill={colorMap[color]}
        d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0c141.391,0,256,114.609,256,256  C512,397.391,397.391,512,256,512z M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.047,0,192-85.969,192-192  S362.047,64,256,64z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z"
      />
    </Svg>
  );
};
