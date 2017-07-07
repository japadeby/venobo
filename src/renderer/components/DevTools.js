import DockMonitor from 'redux-devtools-dock-monitor'
import LogMonitor from 'redux-devtools-log-monitor'
import { createDevTools } from 'redux-devtools'
import React from 'react'

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-H"
    changePositionKey="ctrl-Q">
    <LogMonitor />
  </DockMonitor>
)
