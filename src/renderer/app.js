import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { AppContainer as HotEnabler } from 'react-hot-loader'

import { IntlProvider } from './components/react-multilingual'
import config from '../config'

export default function createApp(state, store, history, translations) {
  const dest = document.querySelector('#content-wrapper')

  const render = () => {
    const Routes = require('./routes')

    ReactDOM.render(
      <HotEnabler>
        <Provider store={store} key="provider">
          <Router history={history}>
            <IntlProvider translations={translations}>
              <Routes appState={state} />
            </IntlProvider>
          </Router>
        </Provider>
      </HotEnabler>,
      dest
    )
  }

  render()

  if (module.hot) {
    module.hot.accept('./routes', render)
  }

  if (config.IS.DEV) {
    const devToolsDest = document.querySelector('#devtools')
    const { DevTools } = require('./components')

    ReactDOM.render(
      <Provider store={store} key="provider">
        <DevTools />
      </Provider>,
      devToolsDest
    )
  }

}
