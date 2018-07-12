import * as React from 'react';
import { Header } from './Header';

export class View extends React.Component<null, null> {

  render() {
    return (
      <React.Fragment>
        <Header />
        {this.props.children}
        {/*<Search />
        <Tooltip />*/}
      </React.Fragment>
    );
  }

}