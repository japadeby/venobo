import React from 'react'
import ReactDOM from 'react'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-connect'

import { IntlProvider } from './components/react-multilingual'
import config from '../config'
import Routes from './routes'

export default function createApp(store, translations) {
  const dest = document.querySelector('#content-wrapper')
  //const store = createStore(state)

  const DestProvider = ({ children }) => (
    <Provider store={store}>
      <IntlProvider translations={translations}>
        {children}
        <Routes />
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
