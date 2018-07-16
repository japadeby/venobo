import * as React from 'react';
import { Header } from './Header';

export class View extends React.Component<{}, {}> {

  render() {
    return [
      <Header />,
      this.props.children,
      {/*<Search />
      <Tooltip />*/}
    ];
  }

}