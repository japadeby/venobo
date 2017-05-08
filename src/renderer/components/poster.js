import React from 'react'

export default class Poster extends React.Component {
  constructor (props) {
    super(props)
  }

  showTooltip = (e) => {
    this.props.tooltip = true
  }

  hideTooltip = (e) => {
    this.props.tooltip = null
  }

  componentWillMount () {
    let items = []
    //let tooltipData = {}

    for (let i in this.props.items) {
      //tooltipData[i] = this.props.items[i]

      items.push(
        <div className="react-item movie" key={i}>
          <div className="front" onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
          {this.props.items[i].poster ? (
            <div>
              <div className="front-image" style={{backgroundImage: `url(${this.props.items[i].poster})`}} />
              <div className="backdrop medium">
                <div className="react-play-button fill">
                  <figure className="icon-content" />
                </div>
              </div>
            </div>
          ) : false}
          </div>
        </div>
      )
    }

    this.setState({items: items})
  }

  render () {
    return (
      <div>
        {this.state.items}
      </div>
    )
  }
}
