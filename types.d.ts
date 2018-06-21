//declare module 'vlc-command';
//declare module 'update-electron-app';
declare module '*.json';

import { Component } from 'react';
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  MergeProps,
  Options
} from 'react-redux';

declare module 'react-redux' {
  // Add removed inferrable type to support connect as decorator
  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/16652

  export interface InferableComponentDecorator<TOwnProps> {
    <T extends Component<TOwnProps>>(component: T): T;
  }

  // overload connect interface to return built-in ClassDecorator
  // https://github.com/reactjs/react-redux/pull/541#issuecomment-269197189
  export interface Connect {
    <TStateProps, TDispatchProps, TOwnProps, TMergedProps, State>(
      mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
      mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
      mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
      options?: Options<any>
    ): InferableComponentDecorator<TOwnProps>;
  }
}

// Omit type https://github.com/Microsoft/TypeScript/issues/12215
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };

type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;