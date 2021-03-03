import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { observer, useSession, useBatchQuery, useBatch } from 'startupjs'
import { Div, Pagination, Span, Link, Collapse, Content, Row } from '@startupjs/ui'
import { Title } from 'components'
import { GAME_STATUS } from 'helpers/constants'
import HistoryGame from './HistoryGame'

import './index.styl'

const LIMIT = 10

export default observer(function PPastGames () {
  const [expand, setExpand] = useState()
  const [isProfessor] = useSession('isProfessor')
  const [page, setPage] = useState(0)
  const [userName] = useSession('userName')
  const queryForGamesList = isProfessor
    ? {
        professor: userName,
        status: GAME_STATUS.COMPLETED
      }
    : {
        $or: [
          { firstUser: userName, status: GAME_STATUS.COMPLETED },
          { secondUser: userName, status: GAME_STATUS.COMPLETED }
        ]
      }
  const [gamesList = []] = useBatchQuery('games', { ...queryForGamesList, $skip: page * LIMIT, $limit: LIMIT })
  const [gamesListCount] = useBatchQuery('games', { ...queryForGamesList, $count: true })
  useBatch()

  const getScore = (isFirstUser, history) => {
    return history[history.length - 1][isFirstUser ? 'allScoreFirstUser' : 'allScoreSecondUser']
  }

  const handleChange = (panel) => (shouldExpand) => {
    setExpand(shouldExpand ? panel : null)
  }

  const pages = Math.ceil(gamesListCount / LIMIT)

  return pug`
    Content.root
      Title Пройденные игры
      Row(
        align="right"
      )
        Link(to="/games") Назад
      if (gamesList.length === 0)
        Row(
          align="center"
        )
          Span.warning У вас нет пройденных игр
      else
        ScrollView.scroll
          each game, index in gamesList
            Div.container(
              key=index
              level=2
            )
              Span(
                bold
                variant="h6"
              ) #{game.name}
              Row
                Span(italic) Игроки:#{' '}
                Span #{game.firstUser} / #{game.secondUser}
              Row
                Span(italic) Cчет:#{' '}
                Span #{getScore(true, game.history)} / #{getScore(false, game.history)}
              Row
                Span(italic) Профессор: #{' '}
                Span #{game.professor}
              Collapse.collapse(
                open=expand === game.id
                title="История игры"
                onChange=handleChange(game.id)
                variant="pure"
              )
                if (expand === game.id)
                  HistoryGame(history=game.history firstUserName=game.firstUser secondUserName=game.secondUser)
        if (pages > 1)
          Row(align="center")
            Pagination(
              page=page
              pages=pages
              onChangePage=setPage
            )
  `
})
