import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer, useSession, useBatchQuery, useBatch } from 'startupjs'
import { Row, Pagination } from '@startupjs/ui'
import { GAME_STATUS } from 'helpers/constants'
import Game from '../Game'

import './index.styl'

const LIMIT = 10

export default observer(function GamesList () {
  const history = useHistory()
  const [isProfessor] = useSession('isProfessor')
  const [userId] = useSession('user.id')
  const [page, setPage] = useState(0)
  const queryForGamesList = isProfessor
    ? {
        professor: userId,
        status: { $ne: GAME_STATUS.COMPLETED }
      }
    : {
        $or: [
          { firstUser: userId, status: { $ne: GAME_STATUS.COMPLETED } },
          { secondUser: userId, status: { $ne: GAME_STATUS.COMPLETED } },
          { status: GAME_STATUS.WAITING_PLAYERS }
        ]
      }
  const [gamesList, $gamesList] = useBatchQuery('games', { ...queryForGamesList, $skip: page * LIMIT, $limit: LIMIT })
  const [gamesListCount] = useBatchQuery('games', { ...queryForGamesList, $count: true })
  useBatch()

  const getCountPlayers = (game) => {
    let count = 0
    game.firstUser && count++
    game.secondUser && count++
    return count
  }

  const joinGame = (game) => {
    if (!isProfessor && game.firstUser !== userId && game.secondUser !== userId && game.firstUser) {
      $gamesList.set(`${game.id}.secondUser`, userId)
      $gamesList.set(`${game.id}.status`, GAME_STATUS.WAITING_ANSWER_PLAYERS)
    }
    if (!isProfessor && game.firstUser !== userId && game.secondUser !== userId && !game.firstUser) {
      $gamesList.set(`${game.id}.firstUser`, userId)
    }
    history.push(`/games/${game.id}`)
  }

  const pages = Math.ceil(gamesListCount / LIMIT)

  return pug`
    ScrollView.scroll
      each game, index in gamesList
        Game(game=game joinGame=joinGame getCountPlayers=getCountPlayers key=game.id)
    if (pages > 1)
      Row(
        align="center"
      )
        Pagination(
          page=page
          pages=pages
          onChangePage=setPage
        )
  `
})
