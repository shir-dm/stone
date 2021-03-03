import React, { useState, useEffect } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Div, Radio, Span, Row } from '@startupjs/ui'
import { Title } from 'components'
import { ANSWER, GAME_STATUS } from 'helpers/constants'
import getResultGame from 'helpers/getResultGame'

import './index.styl'

export default observer(function PGame ({ gameId, backToGames }) {
  const [answer] = useState(() => {
    const _answer = []
    for (const key in ANSWER) {
      _answer.push({
        order: ANSWER[key].ORDER,
        value: ANSWER[key].ID,
        label: ANSWER[key].LABEL
      })
    }
    _answer.sort((a, b) => a.order - b.order)
    return _answer
  })
  const [userName] = useSession('userName')
  const [game = {}, $game] = useDoc('games', gameId)
  const currentRound = (game.history && game.history[game.history.length - 1]) || {}
  const isFirstUser = game.firstUser === userName

  const setAnser = (value) => {
    if ((isFirstUser && !currentRound.secondUserAnswer) || (!isFirstUser && !currentRound.firstUserAnswer)) {
      return $game.set(`history.${game.history.length - 1}.${isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer'}`, value)
    }

    const result = getResultGame(
      isFirstUser ? value : currentRound.firstUserAnswer,
      isFirstUser ? currentRound.secondUserAnswer : value,
      game.history[game.history.length - 2]
    )

    $game.set(`history.${game.history.length - 1}`, result)
    $game.set('status', GAME_STATUS.WAITING_NEW_ROUND)
  }

  const getRivalText = () => {
    if (isFirstUser && game.secondUser) return game.secondUser
    if (!isFirstUser) return game.firstUser
    return 'еще не зашел в игру'
  }

  useEffect(() => {
    if (game.status === GAME_STATUS.COMPLETED) backToGames()
  }, [game.status])

  return pug`
    Title #{game.name} - раунд #{game.history.length}
    Row.rival
      Span(bold) Ваш соперник#{' '}
      Span #{getRivalText()}
    if (game.status === GAME_STATUS.WAITING_NEW_ROUND)
      Div.winner
        Span.text(
          bold
          variant='h5'
          styleName={
            won: currentRound.winner === userName,
            lost: currentRound.winner !== null && currentRound.winner !== userName
          }
        ) Победил в раунде #{game.history.length} - #{game[currentRound.winner] || 'Ничья'}
        Span Ждем следующий раунд
    Radio.radio(
      value=currentRound[isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer']
      onChange=setAnser
      disabled=currentRound[isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer']
      options=answer
    )
  `
})
