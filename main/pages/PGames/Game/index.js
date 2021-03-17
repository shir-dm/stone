import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Row, Button, Span, Div } from '@startupjs/ui'
import moment from 'moment'

import './index.styl'

export default observer(function Game ({ game, joinGame, getCountPlayers }) {
  const [professor] = useDoc('users', game.professor)

  return pug`
    Row.row(
      level=1
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
          Span= professor.firstName
      Button(
        onPress=() => joinGame(game)
        color='primary'
        variant='flat'
      ) Войти
  `
})
