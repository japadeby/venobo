import React from 'react'

import config from '../../config'

export default class Footer extends React.Component {

  componentWillMount() {
    $('#content-wrapper').on('scroll', this.scrolledToBottom)
  }

  scrolledToBottom = () => {
    var $s = $(this.refs.scroll)
    if($(window).height() < $('#content-wrapper').scrollTop() + $(window).height()) {
      $s.show()
    } else {
      $s.hide()
    }
  }

  scrollToTop = () => {
    $('#content-wrapper').animate({scrollTop: 0}, 600)
  }

  componentWillUnmount() {
    $('#content-wrapper').off('scroll', this.scrolledToBottom)
  }

  render() {
    return (
      <footer className="block page-footer">
        <a href="#" className="back-to-top" ref="scroll" onClick={this.scrollToTop}>Til toppen</a>
        <div className="lower">
          <div className="scaffold">
            <span className="copyright">
              <span>&copy; 2017 {config.APP.NAME}</span>
              {/* <span>All rights reserved.<span className="mtg-logo"></span></span> */}
            </span>
          </div>
        </div>
      </footer>
    )
  }

}
