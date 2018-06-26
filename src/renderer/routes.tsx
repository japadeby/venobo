import { RouteConfig } from 'react-router-config';

import { View } from './components';
import { Home } from './containers';

export const routes = [{
  component: View,
  routes: [
    {
      path: '/',
      exact: true,
      component: Home
    }
  ],
}] as RouteConfig[];