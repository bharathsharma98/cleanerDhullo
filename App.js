import React from 'react';
 
import { Provider } from 'react-redux'
import { Navigator } from './Navigation/Navigation'
import {store,pesistedStore} from './Redux/Store';
import { PersistGate } from "redux-persist/integration/react";
export default App=()=>{
  return (
    <Provider store={store}>
      <PersistGate persistor={pesistedStore} loading={null}>
        
          <Navigator />
        
      </PersistGate>
    </Provider>
  );
}