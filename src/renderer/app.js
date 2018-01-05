/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { trigger } from 'redial'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import { AppContainer as HotEnabler } from 'react-hot-loader'
import Loadable from 'react-loadable'

import { ReduxAsyncConnect, asyncMatchRoutes } from '../helpers'
import routes from './routes'
//import config from '../config'

const dest = document.getElementById('content')

export default async ({ store, history, translations }) => {
  const hydrate = async (_routes) => {
    const { components, match, params } = await asyncMatchRoutes(_routes, history.location.pathname)
    const triggerLocals = {
      store,
      match,
      params,
      history
    }

    await trigger('fetch', components, triggerLocals)
    await trigger('defer', components, triggerLocals)

    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes} store={store}>
              <IntlProvider translations={translations}>
                {renderRoutes(_routes)}
              </IntlProvider>
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    )
  }

  await Loadable.preloadReady()
  await hydrate(routes)

  if (module.hot) {
    const nextRoutes = require('routes')
    hydrate(nextRoutes).catch(err => {
      console.error('Error on routes reload:', err)
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    window.React = React // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes
      || !dest.firstChild.attributes['data-react-checksum']) {
      console.error('Server-side React render was discarded.' +
        'Make sure that your initial render does not contain any client-side code.')
    }
  }

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const devToolsDest = document.createElement('div')
    window.document.body.insertBefore(devToolsDest, null)
    const DevTools = require('../helpers/DevTools')
    ReactDOM.hydrate(
      <Provider store={store}>
        <DevTools />
      </Provider>,
      devToolsDest
    )
  }

  if (online && !__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' })
        console.log('Service worker registered!')
      } catch (error) {
        console.log('Error registering service worker: ', error)
      }

      await navigator.serviceWorker.ready
      console.log('Service Worker Ready')
    })
  }
}
