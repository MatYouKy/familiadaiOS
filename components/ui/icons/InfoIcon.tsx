import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export const InfoIcon: FC<CustomSVGIntrface> = ({ width = 24, height = 24, color }) => {
  return (
    <Svg
      height={height}
      width={width}
      fill={colorMap[color]}
      viewBox="0 0 64 64"
      stroke-width="2.56"
    >
      <Path d="M38.5351982,47.6064987H34.455101V28.4473c0-0.5527-0.4473-1-1-1h-4.5204945c-0.5523071,0-1,0.4473-1,1s0.4476929,1,1,1 h3.5204945v18.1591988h-5.1216011c-0.5522003,0-1,0.4472008-1,1c0,0.5527,0.4477997,1,1,1h11.2016983c0.5527,0,1-0.4473,1-1 C39.5351982,48.0536995,39.0878983,47.6064987,38.5351982,47.6064987z" />
      <Circle cx="32" cy="18" r="3" />
      <Path d="M32,0c-17.6730995,0-32,14.3268995-32,32s14.3268995,32,32,32s32-14.3269005,32-32S49.6730995,0,32,0z M32,62 c-16.542099,0-30-13.457901-30-30c0-16.5419998,13.4578991-30,30-30s30,13.4580002,30,30C62,48.542099,48.542099,62,32,62z" />
    </Svg>
  );
};
