import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const SwapIcon: FC<CustomSVGIntrface> = ({
  color = 'whiteDefault',
  fill,
  width = 24,
  height = 24,
}) => {
  return (
    <Svg height={width} width={height} viewBox="0 0 92 92" fill={fill}>
      <Path
        fill={colorMap[color]}
        d="M92,55.5c0,1.1-0.4,2.1-1.2,2.8L72.2,76.9c-0.8,0.8-1.8,1.1-2.8,1.1c-1,0-2.1-0.5-2.8-1.2 c-1.6-1.6-1.6-4.2,0-5.8l11.7-12H39.2c-2.2,0-4-1.8-4-4s1.8-4,4-4h39.1L66.6,39.5c-1.6-1.6-1.6-3.9,0-5.4c1.6-1.6,4.1-1.6,5.7,0 l18.6,18.6C91.6,53.4,92,54.4,92,55.5z M13.7,41h39.1c2.2,0,4-1.8,4-4s-1.8-4-4-4H13.7l11.7-12c1.6-1.6,1.6-4.2,0-5.8 s-4.1-1.6-5.7-0.1L1.2,33.7C0.4,34.4,0,35.4,0,36.5s0.4,2.1,1.2,2.8l18.6,18.6c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2.1-0.4,2.8-1.2 c1.6-1.6,1.6-3.9,0-5.4L13.7,41z"
      />
    </Svg>
  );
};
