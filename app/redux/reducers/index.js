import { combineReducers } from 'redux';
import * as startReducer from './start'

const appReducer = combineReducers(Object.assign(
  startReducer,
));

export default appReducer
