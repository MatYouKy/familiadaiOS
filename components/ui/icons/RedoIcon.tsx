import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const RedoIcon: FC<CustomSVGIntrface> = ({
  color = 'white',
  fill = 'none',
  width = 24,
  height = 24,
}) => {
  return (
    <Svg height={width} width={height} viewBox="0 0 24 24">
      <Path
        stroke={colorMap[color]}
        fill={colorMap[fill]}
        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
        stroke-width="1.5"
      />
      <Path
        stroke={colorMap[color]}
        fill={colorMap[fill]}
        d="M17.5 9.50026H9.96155C8.59369 9.50026 7.90976 9.50026 7.4141 9.82073C7.17646 9.97438 6.97412 10.1767 6.82048 10.4144C6.5 10.91 6.5 11.5939 6.5 12.9618C6.5 14.3297 6.5 15.0136 6.82047 15.5092C6.97412 15.7469 7.17645 15.9492 7.4141 16.1029C7.90976 16.4233 8.59369 16.4233 9.96154 16.4233H14.5M17.5 9.50026L15.25 7.42334M17.5 9.50026L15.25 11.5772"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
