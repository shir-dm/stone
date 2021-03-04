import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import App from 'startupjs/app'
import { initAuthApp } from '@startupjs/auth'
import * as localForms from '@startupjs/auth-local'
import { observer, model } from 'startupjs'
import { BASE_URL } from '@env'
import orm from '../model'

// Frontend micro-services
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

export default observer(() => {
  const auth = initAuthApp({
    localForms
  })

  return pug`
    App(
      apps={main, auth}
    )
  `
})
