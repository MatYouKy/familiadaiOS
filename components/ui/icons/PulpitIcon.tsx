import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

export const PulpitIcon: FC<CustomSVGIntrface> = ({
  width = 12,
  height = 24,
  strokeWidth = 0.5,
  color = 'mainGold',
  fill = 'none'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 24" fill={fill}>
      <Polyline
        fill={fill}
        stroke={colorMap[color]}
        stroke-width={strokeWidth}
        stroke-miterlimit="10"
        points="0.8,21.4 0.8,23.7 11.4,23.7 11.4,21.4 	"
      />
      <Path
        fill={fill}
        stroke={colorMap[color]}
        stroke-width={strokeWidth}
        d="M0.8,3.7c1.2,2,2.4,5.2,2.4,8.8c0,3.7-1.1,6.6-2.4,8.8"
      />
      <Path
        fill={fill}
        stroke={colorMap[color]}
        stroke-width={strokeWidth}
        d="M11.4,21.4c-1.2-2-2.4-5.2-2.4-8.8c0-3.7,1.2-7,2.4-8.8V0.2H0.8v3.5"
      />
      <Path
        fill={fill}
        stroke={colorMap[color]}
        stroke-width={strokeWidth}
        d="M5,5.1C5,4.7,5,4.2,4.9,4c0-0.1-0.1-0.3-0.2-0.3l-2.4,0C2.2,3.7,2.1,3.9,2.1,4c1.1,2,2.2,5.1,2.2,8.6
		c0,3.5-1.1,6.3-2.2,8.6c0,0.1,0.1,0.2,0.2,0.2h2.5c0,0,0.2-0.1,0.2-0.2c0.1-1,0.5-4.5,0.5-4.6c0-0.2,0.1-2.6,0.1-3.9
		C5.5,9.7,5.2,6.7,5,5.1z"
      />
      <Path
        fill={fill}
        stroke={colorMap[color]}
        stroke-width={strokeWidth}
        d="M7.1,5.1c0-0.4,0.1-0.8,0.1-1.1c0-0.1,0.1-0.3,0.2-0.3l2.4,0c0.1,0,0.2,0.1,0.2,0.3C9,6,7.9,9.1,7.9,12.6
		c0,3.5,1.1,6.3,2.2,8.6c0,0.1-0.1,0.2-0.2,0.2H7.5c0,0-0.2-0.1-0.2-0.2c-0.1-1-0.5-4.5-0.5-4.6c0-0.2-0.1-2.6-0.1-3.9
		C6.7,9.7,7,6.7,7.1,5.1z"
      />
    </Svg>
  );
};
