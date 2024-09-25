import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { IFault } from '@__types/game.type';
import { colorBase } from '@__colors/colorBase';
import { Missed } from '@__ui/Missed/BigMissed';

interface IFaultCounter {
  fault: IFault[];
}
const FaultCounter: FC<IFaultCounter> = ({ fault }) => {
  const faultList = fault.map((faultItem, index) => (
    <Missed
      key={`${faultItem.fault}-${index}`}
      missedType={faultItem.fault}
      height={100}
      width={100}
    />
  ));

  const justifyContentStyle =
    fault.length > 0 && fault[0].fault === 'BATTLE' ? 'center' : 'flex-start';

  return (
    <View
      style={{
        ...styles.imageContainer,
        justifyContent: justifyContentStyle,
      }}
    >
      {faultList}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    minHeight: 140,
    borderBottomWidth: 8,
    borderBottomColor: colorBase.mainGold,
    paddingVertical: 16,
    backgroundColor: colorBase.backgroundMain,
  },
  faultContainer: {
    color: colorBase.mainGold,
  },
});

export default FaultCounter;
