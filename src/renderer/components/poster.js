import React from 'react'

export default class Poster extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    var items = []

    for (let i in this.props.items) {
      items.push(
        <div className='react-item movie' key={i}>
          <div className='front'>
            <div className='front-image' style={{backgroundImage: `url(${this.props.items[i].poster})`}} />
            <div className='backdrop medium'>
              <div className='react-play-button fill'>
                <figure className='icon-content' />
              </div>
            </div>
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
