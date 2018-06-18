import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const render = () => {
    const { App } = require('./app');
    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
        document.getElementById('App') as HTMLElement
    );
};

render();
if (module.hot) { module.hot.accept(render); }
