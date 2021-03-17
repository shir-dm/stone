import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, Pagination, Span, Row, Table, Thead, Tbody, Tr, Th, Td } from '@startupjs/ui'
import { ANSWER } from 'helpers/constants'

import './index.styl'

const LIMIT = 10

export default observer(function PPastGames ({ history, firstUserName, secondUserName }) {
  const [page, setPage] = useState(0)
  const historyPagination = history.slice(page * LIMIT, page * LIMIT + LIMIT)
  const pages = Math.ceil(history.length / LIMIT)

  return pug`
    if (pages > 1)
      Row(align="center")
        Pagination(
          page=page
          pages=pages
          onChangePage=setPage
        )
    each item, index in historyPagination
      Div(
        key=index
      )
        Span.round(bold) Раунд #{index + 1}
        Table.table
          Thead
            Tr
              Th
                Span Игрок
              Th
                Span Ответ
              Th
                Span Баллы за раунд
              Th
                Span Всего баллов
          Tbody
            Tr
              Td
                Span= firstUserName
              Td
                Span= ANSWER[item.firstUserAnswer.toUpperCase()].LABEL
              Td
                Span= item.scoreFirstUser
              Td
                Span= item.allScoreFirstUser
            Tr
              Td
                Span= secondUserName
              Td
                Span= ANSWER[item.secondUserAnswer.toUpperCase()].LABEL
              Td
                Span= item.scoreSecondUser
              Td
                Span= item.allScoreSecondUser
  `
})
