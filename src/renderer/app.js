import React from 'react'
import ReactDOM from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ReduxAsyncConnect } from 'redux-async-connect'

import { IntlProvider } from './components/react-multilingual'
import createStore from './redux/create'
import config from '../config'
import Routes from './routes'

export default function createApp(state, translation) {
  const dest = document.querySelector('#content-wrapper')
  const store = createStore(browserHistory, state)
  const history = syncHistoryWithStore(browserHistory, store)

  const component = (
    <Router history={history} render={(props) =>
      <ReduxAsyncConnect {...props} filter={item => !item.deferred} />
    }>
      <Routes />
    </Router>
  )

  const DestProvider = ({ children }) => (
    <Provider store={store}>
      <IntlProvider translations={translations}>
        {component && children}
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
