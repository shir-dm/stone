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
              Th Игрок
              Th Ответ
              Th Баллы за раунд
              Th Всего баллов
          Tbody
            Tr
              Td= firstUserName
              Td= ANSWER[item.firstUserAnswer.toUpperCase()].LABEL
              Td= item.scoreFirstUser
              Td= item.allScoreFirstUser
            Tr
              Td= secondUserName
              Td= ANSWER[item.secondUserAnswer.toUpperCase()].LABEL
              Td= item.scoreSecondUser
              Td= item.allScoreSecondUser
  `
})
