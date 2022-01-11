import React from 'react'
import RichMediaHtmlContent from './RichMediaHtmlContent'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'

const store = global.mockStore({
  authentication: {
    accessToken: 'abcd1234',
  },
  app: {
    embeddedLayout: false,
  },
})

describe('Check RichMediaHtmlContent', () => {
  it('should turn youtube links into embeds', () => {
    const content = mount(
      <Provider store={store}>
        <RichMediaHtmlContent
          allowYoutube
          html="ok https://www.youtube.com/watch?v=TESTID"
        />
      </Provider>,
    )
    expect(content.html()).toEqual(
      expect.stringContaining(
        '<iframe src="https://youtube.com/embed/TESTID"></iframe>',
      ),
    )
  })

  it('should not turn youtube links into embeds', () => {
    const html = `ok https://www.youtube.com/watch?v=TESTID`
    const content = mount(
      <Provider store={store}>
        <RichMediaHtmlContent html={html} />
      </Provider>,
    )
    expect(content.html()).toEqual(expect.stringContaining(html))
  })

  it('should apply css for injected html', () => {
    const content = mount(
      <Provider store={store}>
        <RichMediaHtmlContent
          allowYoutube
          html={`<ul><li>hi</li></ul><p>Test</p>`}
        />
      </Provider>,
    )
    expect(content).toMatchSnapshot()
  })

  it('should strip styles', () => {
    const content = mount(
      <Provider store={store}>
        <RichMediaHtmlContent
          allowYoutube
          html={`<style>html, body { background-color: "red"; } </style>hi</li></ul><p style="font-color: red">Test</p>`}
        />
      </Provider>,
    )
    expect(content.html()).toBe(
      `<div data-css-4p3ux5="" data-css-b00tz="">hi<p>Test</p></div>`,
    )
  })
})
