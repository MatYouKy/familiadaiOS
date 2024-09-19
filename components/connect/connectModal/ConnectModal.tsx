import React, { FC } from 'react';
import { Modal } from 'react-native';

import { TestIp, TestIpProps } from '../test-ip/TestIp';
import { IConnect } from '@__types/game.type';

export const ConnectModal: FC<TestIpProps & { status: IConnect['status'] }> = ({
  status,
}) => {
  return (
    <Modal visible={status !== 'success'} animationType="fade">
      <TestIp
      />
    </Modal>
  );
};
