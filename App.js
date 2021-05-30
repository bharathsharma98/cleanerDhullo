import React from 'react';
import {Provider} from 'react-redux'
import { Navigator } from './Navigation/Navigation'
import store from './Redux/Store'
export default App=()=>{
  return (
    <Provider store={store}>
       <Navigator />
    </Provider>
    
  )
}