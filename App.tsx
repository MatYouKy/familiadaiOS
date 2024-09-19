import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from './store/store';
import { AppContent } from './app/AppContent';
import { Provider as PaperProvider, Portal } from 'react-native-paper';

const App: FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Portal.Host>
          <StatusBar hidden style="light" />
          <AppContent />
        </Portal.Host>
      </PaperProvider>
    </Provider>
  );
};

export default App;
