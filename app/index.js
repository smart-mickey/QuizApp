import React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import appReducer from './redux/reducers/index'
import AppWithNavigationState from './screens/AppWithNavigationState'

let store = createStore(appReducer, {}, applyMiddleware(thunkMiddleware))

export default class App extends React.Component {
  render() {
      return <Provider store={store}><AppWithNavigationState/></Provider>;
  }
}