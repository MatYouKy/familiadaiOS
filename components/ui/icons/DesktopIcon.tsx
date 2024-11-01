import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const DesktopIcon: FC<CustomSVGIntrface> = ({
  width = 24,
  height = 24,
  color = 'mainGold',
  fill = 'none',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={colorMap[fill]}>
      <Path
        d="M2.84436 13V7.50664C2.84436 5.48403 4.48401 3.84439 6.50661 3.84439H17.4933C19.516 3.84439 21.1556 5.48403 21.1556 7.50663V13C21.1556 15.0226 19.5159 16.6623 17.4933 16.6623H6.50661C4.484 16.6623 2.84436 15.0226 2.84436 13Z"
        stroke={colorMap[color]}
        stroke-width="1.7"
      />
      <Path
        d="M6.03967 20.3245H17.9603"
        stroke={colorMap[color]}
        stroke-width="1.7"
        stroke-linecap="round"
      />
    </Svg>
  );
};
