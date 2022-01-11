/* global location */
import React from 'react'
import { SanitizedHtml } from './SanitizedHtml'

describe('Check SanitizedHtml', () => {
  it('should call scroll into element on local ankor', () => {
    const preventDefault = jest.fn()
    const getElementById = jest.fn()
    const scrollIntoView = jest.fn()
    const hostname = 'app.dev.allthings.me'
    location.hostname = hostname
    getElementById.mockReturnValue({
      scrollIntoView,
    })
    document.getElementById = getElementById
    SanitizedHtml.handleContentLinkClick({
      currentTarget: { href: '#test', hostname },
      preventDefault,
    } as any)
    expect(getElementById).toHaveBeenCalled()
    expect(preventDefault).toHaveBeenCalled()
    expect(scrollIntoView).toHaveBeenCalled()
    document.getElementById = null
  })

  it('should not call scroll into element on external ankor', () => {
    const preventDefault = jest.fn()
    const getElementById = jest.fn()
    const scrollIntoView = jest.fn()
    getElementById.mockReturnValue({
      scrollIntoView,
    })
    document.getElementById = getElementById
    SanitizedHtml.handleContentLinkClick({
      currentTarget: { href: 'http://example.com#test' },
      preventDefault,
    } as any)

    expect(getElementById).toHaveBeenCalledTimes(0)
    expect(preventDefault).toHaveBeenCalledTimes(0)
    expect(scrollIntoView).toHaveBeenCalledTimes(0)
    document.getElementById = null
  })

  it('should call handleContentLinkClick for links', async () => {
    const spy = jest.spyOn(SanitizedHtml, 'handleContentLinkClick')
    const wrapper: any = await new Promise(resolve => {
      const innerWrapper = global.mount(
        <SanitizedHtml
          accessToken="abcd1234"
          embeddedLayout={false}
          localAnchors
          onReady={() => resolve(innerWrapper)}
          html={`<a href="http://example.com">hallo welt</a>`}
        />,
      )
    })
    wrapper.update()
    wrapper.getDOMNode().children[0].click()
    expect(spy).toHaveBeenCalled()
  })

  it('should call handleContentLinkClickNative for links in native', async () => {
    const spy = jest.spyOn(SanitizedHtml, 'handleContentLinkClickNative')
    const wrapper: any = await new Promise(resolve => {
      const innerWrapper = global.mount(
        <SanitizedHtml
          accessToken="abcd1234"
          embeddedLayout={true}
          localAnchors
          onReady={() => resolve(innerWrapper)}
          html={`<a href="http://example.com">hallo welt</a>`}
        />,
      )
    })
    wrapper.update()
    wrapper.getDOMNode().children[0].click()
    expect(spy).toHaveBeenCalled()
  })
})
