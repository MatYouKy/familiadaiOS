import { colorMap } from '@__colors/colorBase';
import { CustomSVGIntrface } from '@__types/ui.type';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

export const BackIcon: FC<CustomSVGIntrface> = ({
  color = 'white',
  fill,
  width = 24,
  height = 24,
}) => {
  return (
    <Svg height={height} width={width} viewBox="0 0 28 28">
      <Path
        stroke={fill}
        fill={colorMap[color]}
        d="M12.346,15C11.692,15 9.326,15.02 9.326,15.02L9.326,20.39L1.669,12L9.326,3.6L9.326,9.01C9.326,9.01 11.826,8.98 12.346,9C19.408,9.22 24.312,17.26 24.344,21.02C22.186,18.25 16.516,15 12.346,15ZM11.329,7.01L11.329,1.11C11.363,0.81 11.282,0.51 11.054,0.28C10.658,-0.11 10.016,-0.11 9.62,0.28L-0.369,11.24C-0.58,11.45 -0.67,11.72 -0.656,12C-0.67,12.27 -0.58,12.55 -0.369,12.76L9.565,23.65C9.749,23.88 10.016,24.03 10.327,24.03C10.611,24.03 10.864,23.91 11.046,23.72C11.048,23.72 11.052,23.72 11.054,23.71C11.282,23.49 11.363,23.18 11.329,22.89C11.329,22.89 11.346,17.34 11.346,17C18.946,17 24.915,21.75 26.1,28.01C26.898,26.17 27.346,24.15 27.346,22.02C27.346,13.73 20.622,7.01 12.329,7.01Z"
      />
    </Svg>
  );
};