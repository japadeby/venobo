import * as React from 'react';

export class View extends React.Component<null, null> {

  render() {
    return (
      <React.Fragment>
        <Header />
        {this.props.children}
        <Search />
        <Tooltip />
      </React.Fragment>
    );
  }

}