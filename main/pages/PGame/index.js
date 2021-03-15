import React from 'react'
import { withRouter } from 'react-router-native'
import { observer, useSession } from 'startupjs'
import { Content } from '@startupjs/ui'
import PlayerGame from './PlayerGame'
import ProfessorGame from './ProfessorGame'

import './index.styl'

export default observer(withRouter(function PGame ({ match: { params: { gameId } }, history }) {
  const [isProfessor] = useSession('isProfessor')
  const backToGames = () => history.push('/games')

  return pug`
    Content.root
      if (isProfessor)
        ProfessorGame(gameId=gameId backToGames=backToGames)
      else
        PlayerGame(gameId=gameId backToGames=backToGames)
  `
}))
