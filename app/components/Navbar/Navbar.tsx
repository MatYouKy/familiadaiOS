import { colorBase } from '@__colors/colorBase';
import { DesktopIcon } from '@__components/ui/icons/DesktopIcon';
import { PulpitIcon } from '@__components/ui/icons/PulpitIcon';
import { useAppSelector } from '@__store/hooks';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

export const Navbar = () => {
  const { desktopIsActive, pulpitIsActive } = useAppSelector(
    (state) => state.connectedDevices
  );
  return (
    <View style={styles.navbar}>
      <View style={styles.iconWrapper}>
        <View style={styles.icon}>
          <PulpitIcon
            color={pulpitIsActive ? 'mainGold' : 'redDefault'}
            height={30}
            width={30}
          />
        </View>
        <View style={styles.icon}>
          <DesktopIcon
            color={desktopIsActive ? 'mainGold' : 'redDefault'}
            height={40}
            width={40}
          />
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 40,
    width: '100%',
    backgroundColor: colorBase.none,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 4,
    paddingRight: 20,
  },
  iconWrapper: {
    flexDirection: 'row',
    padding: 2,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
