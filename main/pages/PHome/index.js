import React from 'react'
import { ScrollView } from 'react-native'
import { observer, useQuery, useSession } from 'startupjs'
import { Content, H2, Span, Row, Link, Button } from '@startupjs/ui'
import { AuthForm, LogoutButton } from '@startupjs/auth'
import * as localForms from '@startupjs/auth-local'
import { Title } from 'components'
import { GAME_STATUS } from 'helpers/constants'

import './index.styl'

export default observer(function PHome () {
  const [games = []] = useQuery('games', { status: { $ne: GAME_STATUS.WAITING_PLAYERS } })
  const [users] = useQuery('users', {})
  const [loggedIn] = useSession('loggedIn')

  const getName = (id) => {
    const user = users.find(e => e.id === id)
    if (user) return user.firstName
    return 'Неизвестный юзер'
  }

  const getScoreTable = () => {
    let scoreTable = []
    if (games.length) {
      const players = {}

      games.forEach(g => {
        if (!g.history.length) return
        const lastGame = g.history[g.history.length - 1]
        players[g.firstUser] = (players[g.firstUser] || 0) + (lastGame.allScoreFirstUser || 0)
        players[g.secondUser] = (players[g.secondUser] || 0) + (lastGame.allScoreSecondUser || 0)
      })

      for (const key in players) {
        scoreTable.push({
          name: getName(key),
          score: players[key]
        })
      }
      scoreTable.sort((a, b) => b.score - a.score)
    }
    return scoreTable
  }

  return pug`
    Content.root
      Title Игра "Камень - ножница - бумага"
      // AuthForm(localForms=localForms)
      if (!loggedIn)
        AuthForm(localForms=localForms)
      else
        LogoutButton
        Link(to="/games")
          Button.games Go to Game
      if (getScoreTable().length > 0)
        H2.leaders(bold) Лидеры
        ScrollView.scroll
          each item, index in getScoreTable()
            Row.row(
              level=1
              align="between"
              shape="rounded"
              key=index
            )
              Span(styleName={isFirst: index === 0})= item.name
              Span(styleName={isFirst: index === 0})= item.score
  `
})
