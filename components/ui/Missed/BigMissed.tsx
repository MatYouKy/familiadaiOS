import React, { FC } from 'react'
import Svg, { Path } from 'react-native-svg';

interface IMissed {
  height?: number;
  width?: number;
  missedType: 'BATTLE' | 'GAME';
}

export const Missed: FC<IMissed> = ({ height = '30', width = '30', missedType }) => {
  if (missedType === 'BATTLE') {
    return (
      <Svg height={height} width={width} viewBox="0 0 300 300">
        <Path
          fill="#d3a211"
          d="M94.2 0v44.2h30.7V25.3L99.4 0zM205.8 0v44.2h-30.7V25.3L200.6 0zM124.9 108.2V64H94.2v18.9l25.5 25.3zM175.1 108.2V64h30.7v18.9l-25.5 25.3zM125 192.4v44.2H94.3v-18.9l25.5-25.3zM175.2 192.4v44.2h30.6v-18.9l-25.4-25.3zM94.2 300v-44.2h30.6v18.9L99.4 300zM205.7 300v-44.2H175v18.9l25.5 25.3zM134.8 128.9h30.4v12.7l-14.8 8.5-15.6-8.5zM134.8 171.2h30.4v-12.7l-14.8-8.4-15.6 8.4z"
        />
      </Svg>
    );
  }
 return (
   <Svg height={height} width={width} viewBox="0 0 150 150">
     <Path
       fill="#d3a211"
       d="m32.6 0 18.3 17.4v17.4H40.8l-18-18V0zM118.1 0 99.8 17.4v17.4h10.1l18-18V0zM32.6 150l18.3-17.4v-17.4H40.8l-18 18V150zM118.1 150l-18.3-17.4v-17.4h10.1l18 18V150zM60.6 22.4v12.4h11.6v-5.4l-6.7-7zM90.1 22.4v12.4H78.5v-5.4l6.7-7zM60.6 127.6v-12.4h11.6v5.4l-6.7 7zM90.1 127.6v-12.4H78.5v5.4l6.7 7zM60.6 53.6h29.5v12l-14.7 9.3-14.8-9.3zM60.6 96.2h29.5V84.3l-14.7-9.4-14.8 9.4z"
     />
   </Svg>
 );
}
