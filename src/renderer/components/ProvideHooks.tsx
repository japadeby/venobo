import * as React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

export interface ProvideHookOptions {
  mapStateToProps?<T>(state?: T): T;
  mapDispatchToProps?<A, AA>(dispatch?: Dispatch<A, AA>): any;
  loadingComponent?: React.SFC<any>;
  errorComponent?: React.SFC<any>;
  waitUntil(dispatch: Dispatch<any, any>): Promise<any> | any;
  catchError?(error: Error | null, info?: object): void;
}

export interface ProvierComponentState {
  loading: boolean;
  error: Error | null;
  info: object | null;
  data: any;
}

export function ProvideHooks<WP extends { dispatch: Dispatch<any, any> }>(options: ProvideHookOptions): ClassDecorator {
  return (WrappedComponent: React.ComponentType<WP>) => {
    class ProviderComponent extends React.Component<WP, ProvierComponentState> {

      state = {
        loading: true,
        error: null,
        info: null,
        data: null,
      };

      private catchError(error: Error, info: any = null) {
        if (options.catchError) {
          options.catchError(error);
        }

        this.setState({ error, info });
      }

      private createWrappedComponent() {
        return React.createElement(WrappedComponent, {
          ...this.state,
          ...(this.props as object),
        });
      }

      async componentDidMount() {
        try {
          const data = await options.waitUntil(this.props.dispatch);

          this.setState({ data, loading: false });
        } catch (error) {
          this.catchError(error);
        }
      }

      componentDidCatch(error, info) {
        this.catchError(error, info);
      }

      render() {
        return !this.state.error
          ? this.state.loading
            ? options.loadingComponent && React.createElement(options.loadingComponent) || null
            : this.createWrappedComponent()
          : options.errorComponent && React.createElement(options.errorComponent, this.state) || null;
      }

    }

    return connect(
      options.mapStateToProps,
      (dispatch: Dispatch<any, any>) => {
        return bindActionCreators(options.mapDispatchToProps || {}, dispatch);
      },
    )(ProviderComponent);
  };
}