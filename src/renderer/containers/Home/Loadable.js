import React from 'react'
import Loadable from 'react-loadable'

const Home = Loadable({
  loader: () => Promise.resolve(require('./Home')),
  loading: () => <div>Loading</div>
})

export default Home