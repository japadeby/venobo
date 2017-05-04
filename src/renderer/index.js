/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import { MemoryRouter as Router } from 'react-router-dom'
import { IntlProvider } from './react-multilingual'

import App from './utils/app'
import Routes from './routes'
import getTranslations from './translations'

const history = createBrowserHistory()

getTranslations((translations, locale) => {
  App.init(
    <IntlProvider translations={translations} locale={locale}>
      <Router history={history}>
        <Routes />
      </Router>
    </IntlProvider>,
  '#content-wrapper'
  )
})
