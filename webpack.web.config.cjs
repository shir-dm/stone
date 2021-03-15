const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/auth',
    '@startupjs/auth-local'
  ],
  alias: {},
  mode: 'react-native'
})
