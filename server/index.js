import init from 'startupjs/init'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { getUiHead, initUi } from '@startupjs/ui/server'
import { initAuth } from '@startupjs/auth/server'
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
import orm from '../model'
import api from './api'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes(),
    ...getAuthRoutes()
  ]
}, (ee, options) => {
  initApp(ee)
  initUi(ee, options)
  initAuth(ee, {
    strategies: [new LocalStrategy({})]
  })

  ee.on('routes', expressApp => {
    expressApp.use('/api', api)
  })
})

function getHead (appName) {
  return `
    ${getUiHead()}
    <title>Stone</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
