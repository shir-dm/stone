const getConfig = require('startupjs/bundler/webpack.server.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/auth/server',
    '@startupjs/auth/isomorphic',
    '@startupjs/auth-local/server'
  ],
  alias: {}
})
