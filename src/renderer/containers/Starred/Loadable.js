import React from 'react'
import Loadable from 'react-loadable'

const Starred = Loadable({
  loader: () => Promise.resolve(require('./Starred')),
  loading: () => <div>Loading</div>
})

export default Starred