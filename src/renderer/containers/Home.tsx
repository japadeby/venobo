import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { HomeStore } from '../stores/home.store';

import { Loader, ContentSection, Carousel } from '../components';

@inject(({ home }) => home)
@observer
export class Home extends React.Component<HomeStore, {}> {

  async componentDidMount() {
    // Dunno why all methods on stores are undefined ?
    await this.props.fetch();
  }

  render() {
    const { isReady, movies } = this.props;

    return isReady ? (
      <ContentSection>
        <Carousel key="movies.popular" route="/discover/movies/all/popularity.desc" items={movies.popular} />
        <Carousel key="movies.topRated" route="/discover/movies/all/popularity.desc" items={movies.topRated} />
      </ContentSection>
    ) : (
      <Loader spinner="dark" container="dark" />
    );
  }
}
