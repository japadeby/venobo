import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { IntlProvider } from './components/react-multilingual'
import config from '../config'
import Routes from './routes'

export default function createApp(store, appState, translations) {
  const dest = document.querySelector('#content-wrapper')

  const DestProvider = ({ children }) => (
    <Provider store={store}>
      <IntlProvider translations={translations}>
        {children ? (
          <div>
            {children}
            <Routes state={appState} />
          </div>
        ) : (
          <Routes state={appState} />
        )}
      </IntlProvider>
    </Provider>
  )

  if (config.IS.DEV) {
    const { DevTools } = require('./components')
    ReactDOM.render(
      <DestProvider>
        <DevTools />
      </DestProvider>,
      dest
    )
  } else {
    ReactDOM.render(<DestProvider />, dest)
  }

}
