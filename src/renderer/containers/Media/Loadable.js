import React from 'react'
import Loadable from 'react-loadable'

const Media = Loadable({
  loader: () => Promise.resolve(require('./Media')),
  loading: () => <div>Loading</div>
})

export default Media