import React from 'react'
import { NavLink } from 'react-router-dom'

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {media} = this.props

    return (
      <div id="tooltip">
        {media ? (
          <section className="tooltip" style={{top: `${media.style.top}px`, left: `${media.style.left}`}}>
            <header>
              <h1>
                <NavLink to={media.pageLink} class="page-link">
                  {media.title}
                </NavLink>
              </h1>
              <p className="time"></p>
              <p className="genres"></p>
              <p className="year divider">{media.year}</p>
              <p className="duration divier">{media.runtime}</p>
              <span className="flags">
                <span className="flag">quality</span>
              </span>
            </header>
            <div className="body">
              <div className="interaction-block">
                <div className="imdb-container">
                  <a href="#" className="imdb-link">
                    6.5
                  </a>
                </div>
                <button className="icon starred">Stjernemærk</button>
              </div>
              <p className="group synosis">
                <span>test</span>
              </p>
              <span className="group people">
                <div className="people-list actors">
                  <h2>Actors:</h2>
                  <p>

                  </p>
                </div>
                <div className="people-list directors">
                  <h2>Director: </h2>
                  <p>
                    qwe
                  </p>
                </div>
              </span>
            </div>
            <div className="gutter">
              <div className="arrow" style={{top: '138px'}}></div>
            </div>
            <footer className="two-button">
              <NavLink to={media.pageLink} class="page-link">
                Mere info
              </NavLink>
            </footer>
          </section>
        ) : (
          <div></div>
        )}
      </div>
    )
  }

}
