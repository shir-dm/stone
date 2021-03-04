import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Button, Row, Span, Div } from '@startupjs/ui'
import { Title } from 'components'
import { GAME_STATUS, ANSWER } from 'helpers/constants'

import './index.styl'

export default observer(function PGame ({ gameId, backToGames }) {
  const [game = {}, $game] = useDoc('games', gameId)

  const newRound = () => {
    $game.set('history', [...game.history, {}])
    $game.set('status', GAME_STATUS.WAITING_ANSWER_PLAYERS)
  }

  const finishGame = () => {
    $game.set('status', GAME_STATUS.COMPLETED)
    backToGames()
  }

  const currentRound = (game.history && game.history[game.history.length - 1]) || {}

  const getAnser = (isFirstUser) => {
    if (!game.firstUser || !game.secondUser) return ''
    if (currentRound[isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer']) return ANSWER[(isFirstUser ? currentRound.firstUserAnswer : currentRound.secondUserAnswer).toUpperCase()].LABEL
    return 'еще не дал ответ'
  }

  return pug`
    Title= game.name + ' - раунд ' + game.history.length
    Div.answers
      Row
        Span(bold)= (game.firstUser || 'Первый игрок еще не вошел в игру') + ': '
        Span= getAnser(true)
      Row
        Span(bold)= (game.secondUser || 'Второй игрок еще не вошел в игру') + ': '
        Span= getAnser()
    Button.new(
      disabled=game.status !== GAME_STATUS.WAITING_NEW_ROUND
      onPress=newRound
    ) Новый раунд
    Button.end(
      onPress=finishGame
      disabled=game.status !== GAME_STATUS.WAITING_NEW_ROUND
    ) Закончить игру
  `
})
