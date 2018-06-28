import { RouteConfig } from 'react-router-config';

import { View } from './components';
import { Home } from './containers';

export const routes: RouteConfig[] = [{
  component: View,
  routes: [
    {
      path: '/',
      exact: true,
      component: Home
    }
  ],
}];
