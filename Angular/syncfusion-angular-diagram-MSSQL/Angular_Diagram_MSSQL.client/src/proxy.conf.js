const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api",
    ],
    target: 'http://localhost:5239',
    secure: false,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;
