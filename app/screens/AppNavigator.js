import React from 'react';

import {
  TabNavigator,
  StackNavigator,
  StackRouter
} from 'react-navigation';

import Start from './Start'
import Main from './Main'
const MainNavigator = StackNavigator({
  first: {
    screen: Start,
  },
  main: {
    screen: Main,
  },
},{
  headerMode: 'none',
});

export default MainNavigator;
