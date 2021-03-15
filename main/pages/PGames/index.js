import React, { useState } from 'react'
import { observer, useSession, useModel } from 'startupjs'
import { Content, Button, TextInput, Link, Row, Checkbox } from '@startupjs/ui'
import { Title } from 'components'
import GamesList from './GamesList'

import './index.styl'

export default observer(function PGames () {
  const [isProfessor, $isProfessor] = useSession('isProfessor')
  const [userId] = useSession('user.id')
  const [gameName, setGameName] = useState('')
  const $games = useModel('games')

  const onCreateGame = () => {
    $games.addNew(gameName, userId)
    setGameName('')
  }

  return pug`
    Content.root
      Title Игры
      if isProfessor
        TextInput(
          label='Имя игры'
          placeholder='Введите имя игры'
          value=gameName
          onChangeText=setGameName
        )
        Button.create(
          color='primary'
          variant='flat'
          disabled=gameName.length <=2
          onPress=onCreateGame
        ) Создать игру
      GamesList
      Row(align="between" vAlign="center")
        Checkbox(
          label='Стать профессором'
          value=isProfessor
          onChange=(value) => $isProfessor.set(value)
        )
        Link.pastGame(
          to="/past-games"
        ) Пройденные игры
  `
})
