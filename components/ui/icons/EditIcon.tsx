import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const EditIcon: FC<CustomSVGIntrface> = ({
  width = 24,
  height = 24,
  color,
}) => {
  return (
    <Svg
      height={height}
      width={width}
      fill="none"
      stroke={colorMap[color]}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="4"
      viewBox="0 0 24 24"
    >
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  );
};
