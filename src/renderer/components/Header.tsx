import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/interfaces';

@connect((state: RootState) => ({ ...state }))
export class Header extends React.Component<null, null> {

  render() {
    return (

    );
  }

}