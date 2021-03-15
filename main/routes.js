export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/games',
    exact: true,
    component: components.PGames
  },
  {
    path: '/games/:gameId',
    exact: true,
    component: components.PGame
  },
  {
    path: '/past-games',
    exact: true,
    component: components.PPastGames
  }
]
