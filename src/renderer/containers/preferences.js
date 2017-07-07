import React from 'react'

export default class PreferencesPage extends React.Component {
  render () {
    return (
      <div className='settings scaffold'>
        <div className='container'>
          <div className='section-wrapper'>
            <nav className='main-navi desktop-visible-td'>
              <div className='account-info-name'>
                <div className='photo' style={{display: 'inline-block'}}>
                  <img src='' />
                </div>
                <div className='name paragraph'>Sentinel</div>
              </div>
              <ul className='nav-links'>
                <li className='overview active'>
                  <a id='overview-nav-link'>
                    <span className='title'>Kontooversigt</span>
                  </a>
                </li>
                <li className='change-password'>
                  <a id='change-password-nav-link'>
                    <span className='title'>Skift password</span>
                  </a>
                </li>
                <li className='parental-lock'>
                  <a id='parental-lock-nav-link'>
                    <span className='title'>Forældrekontrol</span>
                  </a>
                </li>
                <li className='payment'>
                  <a id='payment-nav-link'>
                    <span className='title'>Ændr betalingsmåde</span>
                  </a>
                </li>
                <li className='package'>
                  <a id='package-nav-link'>
                    <span className='title'>Håndter pakken</span>
                  </a>
                </li>
                <li className='payment-history'>
                  <a id='payment-history-nav-link'>
                    <span className='title'>Købshistorik</span>
                  </a>
                </li>
                <li className='user-profile'>
                  <a id='user-profile-nav-link'>
                    <span className='title'>Ændr personoplysninger</span>
                  </a>
                </li>
              </ul>
              <ul className='service-links'>
                <li><a>Viaplay til Viasat-kunder</a></li>
              </ul>
            </nav>
            <article ref='overview' className='page-info'>
              <div ref='title' className='page-title'>
                <h2>Kontooversigt</h2>
              </div>
              <div className='page-info-container'>
                <div className='row'>
                  <div className='col col-50'>
                    <div ref='user' className='overview-widget'>
                      <div className='paragraph'>Informationer til login</div>
                      <div className='widget-data'>
                        <div className='user-email long-text'>marcussa2000@gmail.com</div>
                        <div className='user-password'>******</div>
                      </div>
                      <a href='/change-password'>Skift password</a>
                    </div>
                    <div className='overview-widget'>
                      <div className='paragraph'>Forældrekontrol</div>
                      <div className='widget-data'>Blokér køb og uegnet indhold med en kode.</div>
                      <a className='parental-link' href='/parental'>Opret kode</a>
                    </div>
                    <div className='overview-widget'>
                      <div className='paragraph'>Facebook</div>
                      <div className='facebook-content-block'>
                        <div className='widget-data'>
                          Sammenkobl med Facebook, så du lettere kan logge dig ind.
                        </div>
                        <a className='btn btn-facebook' href='#'>
                          Kobl til Facebook
                        </a>
                        <p className='fb-error' style={{display: 'none'}} />
                      </div>
                    </div>
                  </div>
                  <div className='col col-50' />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
