import { Home, Media, Starred } from './containers'
import { View } from './components'

export default [{
  component: View,
  routes: [
    {
      path: '/',
      exact: true,
      component: Home
    },
    {
      path: '/media/:type/:tmdb',
      component: Media
    },
    {
      path: '/starred',
      component: Starred
    },
    /*{
      path: '/discover/:type/:genre/:sortBy',
      component: Discover
    },*/
    /*{
      component: NotFound
    }*/
  ]
}]