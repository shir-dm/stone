import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer, useSession, useQuery } from 'startupjs'
import { Content, Div, TextInput, Checkbox, Br, Button, H2, Span, Row } from '@startupjs/ui'
import { Title } from 'components'
import { GAME_STATUS } from 'helpers/constants'

import './index.styl'

export default observer(function PHome () {
  const [name, setName] = useState('')
  const [isProfessor, setIsProfessor] = useState(false)
  const [, $userName] = useSession('userName')
  const [, $isProfessor] = useSession('isProfessor')
  const [games = []] = useQuery('games', { status: { $ne: GAME_STATUS.WAITING_PLAYERS } })
  const history = useHistory()

  const onEnter = async () => {
    await $userName.set(name)
    await $isProfessor.set(isProfessor)
    history.push('/games')
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
          name: key,
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
      Div
        TextInput.name(
          label='Имя'
          placeholder='Введите свое имя'
          value=name
          onChangeText=setName
        )
        Br
        Checkbox(
          label='Войти как профессор'
          value=isProfessor
          onChange=setIsProfessor
        )
        Br
        Button(
          onPress=onEnter
          color='primary'
          variant='flat'
          disabled=name.length <=2
        ) Войти
      H2.leaders(bold) Лидеры
      ScrollView.scroll
        each item, index in getScoreTable()
          Row.row(
            level=3
            align="between"
            shape="rounded"
            key=index
          )
            Span(styleName={isFirst: index === 0}) #{item.name}
            Span(styleName={isFirst: index === 0}) #{item.score}
  `
})
