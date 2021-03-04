import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer, useSession, useBatchQuery, useBatch } from 'startupjs'
import { Row, Pagination, Button, Span, Div } from '@startupjs/ui'
import moment from 'moment'
import { GAME_STATUS } from 'helpers/constants'

import './index.styl'

const LIMIT = 10

export default observer(function GamesList () {
  const history = useHistory()
  const [isProfessor] = useSession('isProfessor')
  const [userName] = useSession('user.firstName')
  const [page, setPage] = useState(0)
  const queryForGamesList = isProfessor
    ? {
        professor: userName,
        status: { $ne: GAME_STATUS.COMPLETED }
      }
    : {
        $or: [
          { firstUser: userName, status: { $ne: GAME_STATUS.COMPLETED } },
          { secondUser: userName, status: { $ne: GAME_STATUS.COMPLETED } },
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
    if (!isProfessor && game.firstUser !== userName && game.secondUser !== userName && game.firstUser) {
      $gamesList.set(`${game.id}.secondUser`, userName)
      $gamesList.set(`${game.id}.status`, GAME_STATUS.WAITING_ANSWER_PLAYERS)
    }
    if (!isProfessor && game.firstUser !== userName && game.secondUser !== userName && !game.firstUser) {
      $gamesList.set(`${game.id}.firstUser`, userName)
    }
    history.push(`/games/${game.id}`)
  }

  const pages = Math.ceil(gamesListCount / LIMIT)

  return pug`
    ScrollView.scroll
      each game, index in gamesList
        Row.row(
          key=index
          level=3
          align="between"
          vAlign="center"
          shape="rounded"
        )
          Div
            Span(
              bold
              variant="h6"
            )= game.name
            Row
              Span(italic) Дата создания:#{' '}
              Span= moment(game.createdAt).format('MM-DD-YYYY:HH-MM')
            Row
              Span(italic) Количество участников:#{' '}
              Span= getCountPlayers(game)
            Row
              Span(italic) Профессор:#{' '}
              Span= game.professor
          Button(
            onPress=() => joinGame(game)
            color='primary'
            variant='flat'
          ) Присоединиться
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
