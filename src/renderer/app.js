import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import { IntlProvider } from './components/react-multilingual'
import config from '../config'

export default function createApp(store, appState, translations) {
  const dest = document.querySelector('#content-wrapper')

  const render = () => {
    const Routes = require('./routes')

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <IntlProvider translations={translations}>
            <Routes appState={appState} />
          </IntlProvider>
        </Provider>
      </AppContainer>,
      dest
    )

    if (config.IS.DEV) {
      const devToolsDest = document.querySelector('#devtools')
      //window.document.body.insertBefore(devToolsDest, null)
      const { DevTools } = require('./components')

      ReactDOM.render(
        <Provider store={store} key="provider">
          <DevTools />
        </Provider>,
        devToolsDest
      )
    }
  }

  render()

  if (module.hot) {
    module.hot.accept('./routes', render)
  }

}
