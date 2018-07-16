import * as React from 'react';
import { Switch, Route } from 'react-router';

import { View } from './components';
import { Home } from './containers';

export const createRoutes = () => (
  <Switch>
    <View>
      <Route exact path="/" component={Home} />
    </View>
  </Switch>
);
