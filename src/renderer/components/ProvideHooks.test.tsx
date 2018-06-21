import * as React from 'react';
import { mount } from 'enzyme';
import createMockStore from 'redux-mock-store';

import { ProvideHooks } from './ProvideHooks';
import { Utils } from '../../utils';

describe('ProvideHooks', () => {
  const mockStore = createMockStore();
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  it('should test', () => {
    const mockLoadingFn = Utils.promise.createFake();
    const loadingText = 'Loading...';
    const homeText = 'Welcome to Home!';

    mockLoadingFn.fakePromise.then(() => console.log('FINALLY!!'));

    @ProvideHooks({
      catchError: console.dir,
      waitUntil: () => {
        setTimeout(mockLoadingFn.fakeResolve, 100);

        return mockLoadingFn.fakePromise;
      },
      loadingComponent: () => <div>{loadingText}</div>,
    })
    class Home extends React.Component<any, any> {
      render() {
        return (
          <div>{homeText}</div>
        );
      }
    }

    const wrapper = mount(<Home store={store} />);
    expect(wrapper.text()).toEqual(loadingText);

    return expect(mockLoadingFn.fakePromise.then(() => {
      wrapper.update();
      return wrapper.text();
    })).resolves.toEqual(homeText);
  });
});