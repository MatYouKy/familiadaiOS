import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { IFault } from '../../../../types/game.type';
import { colorBase } from '../../../../colors/colorBase';
import { Missed } from '../../../ui/Missed/BigMissed';
import { useAppDispatch } from '../../../../store/hooks';
import { updateGameStatus } from '../../../../store/slices/gameState';

interface IFaultCounter {
  fault: IFault[];
}

export const FaultCounter: FC<IFaultCounter> = ({ fault }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (fault.length === 3) {
      dispatch(updateGameStatus('EXTRA-GAME'));
    }
  }, [fault]);
  
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
    backgroundColor: colorBase.background.main
  },
  faultContainer: {
    color: colorBase.mainGold,
  },
});
