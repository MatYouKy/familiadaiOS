import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

export const GameHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.score}>
        <Text style={styles.textScore}>208</Text>
      </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 100,
  },
  textRed: {
    color: 'red',
    fontSize: 36,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  textBlue: {
    color: '#1188ff',
    fontSize: 36,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  score: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textScore: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#D9B36C',
  },
});