import React from 'react'
import { NavLink } from 'react-router-dom'

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props)

    const {tooltip} = props.state

    tooltip.toggle = this.toggle.bind(this)
    tooltip.enabled = false

    this.state = {
      data: {},
      enabled: false
    }
  }

  toggle(data: Object = {}) {
    console.log('toggle')
    const {tooltip} = this.props.state
    const {enabled} = this.state

    tooltip.data = data
    tooltip.enabled = !enabled

    this.setState({
      enabled: !enabled,
      data: data
    })
  }

  render() {
    const {tooltip} = this.props.state
    const {data, enabled} = this.state

    console.log(enabled)

    return (
      <div id="tooltip">
        {enabled ? (
          <section className="tooltip" ref="tooltip" style={{top: `${data.style.top}px`, left: `${data.style.left}px`}}>
            <header>
              <h1>
                <NavLink to={data.pageLink} className="page-link">
                  {data.title}
                </NavLink>
              </h1>
              <p className="time"></p>
              <p className="genres"></p>
              <p className="year divider">{String(data.year)}</p>
              <p className="duration divier">{data.runtime}</p>
              <span className="flags">
                <span className="flag">quality</span>
              </span>
            </header>
            <div className="body">
              <div className="interaction-block">
                <div className="imdb-container">
                  <a href="#" className="imdb-link">
                    {data.rating}
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
              <NavLink to={data.pageLink} className="page-link">
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
