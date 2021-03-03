import React from 'react'
import { H1 } from '@startupjs/ui'

import './index.styl'

export default function Title ({ children }) {
  return pug`
    H1.title(bold) #{children}
  `
}
