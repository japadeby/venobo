import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { IntlProvider } from './components/react-multilingual'
import config from '../config'
import getRoutes from './routes'

export default function createApp(store, appState, translations) {
  const dest = document.querySelector('#content-wrapper')

  const render = (routes) => (
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <IntlProvider translations={translations}>
            {routes}
          </IntlProvider>
        </Provider>
      </AppContainer>,
      dest
    )
  )

  render(getRoutes(appState))

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes')(appState)
      render(nextRoutes)
    })
  }

  if (config.IS.DEV) {
    const devToolsDest = document.createElement('div')
    window.document.body.insertBefore(devToolsDest, null)
    const { DevTools } = require('./components')

    ReactDOM.render(
      <Provider store={store} key="provider">
        <DevTools />
      </Provider>,
      devToolsDest
    )
  }

}
