import React from 'react'

export default class Footer extends React.Component {

  componentWillMount() {
    document.addEventListener('scroll', this.scrolledToBottom)
  }

  scrolledToBottom = () => {
    var $s = $(this.refs.scroll)
    if(document.body.scrollHeight === document.body.scrollTop + window.innerHeight) {
      $s.fadeIn()
    } else {
      $s.fadeOut()
    }
  }

  scrollToTop = () => {
    $(this.refs.scroll).hide()
    $('html, body').animate({scrollTop: 0}, 600)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrolledToBottom)
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
