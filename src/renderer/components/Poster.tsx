import * as React from 'react';
import { Link } from 'react-router-dom';

import { Metadata } from '../../common/api/metadata';

export interface PosterProps {
  items: Metadata[];
}

export class Poster extends React.Component<PosterProps, {}> {

  render() {
    return this.props.items.map((item, i) => (
      <div className="react-item movie" key={i}>
        <div className="front">
          <Link to={`/media/${item.type}/${item.tmdb}`}>
            {item.poster &&
              <div className="front-image" style={{ backgroundImage: `url(${item.poster})` }}>
                <div className="backdrop medium">
                  <div className="react-play-button fill">
                    <figure className="icon-content" />
                  </div>
                </div>
              </div>
            }
          </Link>
        </div>
      </div>
    ));
  }

}