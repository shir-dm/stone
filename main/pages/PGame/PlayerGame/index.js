import React, { useMemo, useEffect } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Div, Radio, Span, Row } from '@startupjs/ui'
import { Title } from 'components'
import { ANSWER, GAME_STATUS } from 'helpers/constants'

import './index.styl'

export default observer(function PGame ({ gameId, backToGames }) {
  const answer = useMemo(() => {
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
  }, [])
  const [user] = useSession('user')
  const [game = {}, $game] = useDoc('games', gameId)
  const currentRound = (game.history && game.history[game.history.length - 1]) || {}
  const isFirstUser = game.firstUser === user.id
  const [rival] = useDoc('users', isFirstUser ? game.secondUser : game.firstUser)

  const setAnser = (value) => $game.setAnser(isFirstUser, value)

  const getRivalText = () => {
    if (rival) return rival.firstName
    return 'еще не зашел в игру'
  }

  const getWinName = () => {
    if (game[currentRound.winner] || game[currentRound.winner] === user.id) return user.firstName
    if (game[currentRound.winner]) return rival.firstName
    return 'Ничья'
  }

  useEffect(() => {
    if (game.status === GAME_STATUS.COMPLETED) backToGames()
  }, [game.status])

  return pug`
    Title= game.name + ' - раунд ' + game.history.length
    Row.rival
      Span(bold) Ваш соперник#{' '}
      Span= getRivalText()
    if (game.status === GAME_STATUS.WAITING_NEW_ROUND)
      Div.winner
        Span.won(
          bold
          variant='h5'
          styleName={
            lost: (currentRound.winner === 'firstUser' && !isFirstUser) || (currentRound.winner === 'secondUser' && isFirstUser)
          }
        )= 'Победил в раунде ' + game.history.length +' - ' + getWinName()
        Span Ждем следующий раунд
    Radio.radio(
      value=currentRound[isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer']
      onChange=setAnser
      disabled=!!currentRound[isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer']
      options=answer
    )
  `
})
