import React, { useState } from 'react'
import { observer, useSession, useModel } from 'startupjs'
import { Content, Button, TextInput, Link, Row} from '@startupjs/ui'
import { Title } from 'components'
import GamesList from './GamesList'

import './index.styl'

export default observer(function PGames () {
  const [isProfessor] = useSession('isProfessor')
  const [userName] = useSession('userName')
  const [gameName, setGameName] = useState('')
  const $games = useModel('games')

  const onCreateGame = () => {
    $games.addNew(gameName, userName)
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
      Row(align="right")
        Link.pastGame(
          to="/past-games"
        ) Пройденные игры
  `
})
