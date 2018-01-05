import React from 'react'
import ReactDOM from 'react-dom/server'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import path from 'path'
import fs from 'fs'
import Loadable from 'react-loadable'
import { trigger } from 'redial'
import { getBundles } from 'react-loadable/webpack'
import { renderRoutes } from 'react-router-config'

import routes from '../renderer/routes'

import { Html, ReduxAsyncConnect, asyncMatchRoutes } from '../helpers'
import { getChunks, waitChunks } from './utils/getChunks'
import { WINDOW } from '../config'

const distPath = path.join(__dirname, '..', 'static', 'dist')
const chunksPath = path.join(distPath, 'loadable-chunks.json')

export default async (state, done) => {
  await Loadable.preloadAll()
  await waitChunks(chunksPath)

  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh()
  }

  const save = (html) => {
    const content = `<!DOCTYPE html>${ReactDOM.renderToString(html)}`
    fs.writeFile(WINDOW.INDEX, content, done)
  }

  const assets = webpackIsomorphicTools.assets()
  const store = createStore({ data: { app: state }, history: state.saved.history }) //, api

  try {
    /*const { components, match, params } = await asyncMatchRoutes(routes, history.location.pathname)
    await trigger('fetch', components, {
      store,
      match,
      params,
      history
    })*/

    const modules = []
    const component = (
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={routes} store={store} helpers={{ api }}>
              {renderRoutes(routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </Loadable.Capture>
    )
    const content = ReactDOM.renderToString(component)

    const bundles = getBundles(getChunks(), modules)
    save(<Html assets={assets} bundles={bundles} content={content} store={store} />)
  } catch (mountError) {
    console.error('MOUNT ERROR: ', mountError)
    save(<Html store={store} />)
  }

  /*try {
    await Loadable.preloadAll()
    await waitChunks(chunksPath)
  } catch (error) {
    return console.log('Server preload error:', error)
  }*/
}
