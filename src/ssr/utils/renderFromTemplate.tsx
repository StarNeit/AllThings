import React from 'react'
import { renderToString } from 'react-dom/server'
import { renderStaticOptimized } from 'glamor/server'
import helmet from 'react-helmet'
import JsonContainer from '../jsonContainer'

export default function renderFromTemplate(
  template: string,
  rawHtml: () => string,
  state: IndexSignature,
) {
  const renderedHtml = template || ''
  const { html, css, ids } = renderStaticOptimized(rawHtml)
  const helmetHead = helmet.rewind()

  const stateContainer = renderToString(
    <JsonContainer id="__SERVER_STATE__" json={JSON.stringify(state)} />,
  )

  const glamourScript = `<script>window._glam = ${JSON.stringify(ids)}</script>`

  return renderedHtml
    .replace('$TITLE$', helmetHead.title.toString())
    .replace('$META$', helmetHead.meta.toString())
    .replace('$LINK$', helmetHead.link.toString())
    .replace('$CSS$', `<style>${css}</style>`)
    .replace('$APP$', html)
    .replace('$STATE$', stateContainer)
    .replace('$GLAMOUR$', glamourScript)
}
