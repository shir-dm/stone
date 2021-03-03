import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-native'
import { observer, useSession } from 'startupjs'
import { Div, Layout, Portal } from '@startupjs/ui'

import './index.styl'

export default observer(function ({ children }) {
  const [userName] = useSession('userName')
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/' && !userName) history.push('/')
  }, [location, userName])

  return pug`
    Portal.Provider
      Layout
        Div.body= children
  `
})
