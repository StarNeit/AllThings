import React from 'react'
import SanitizedHtml from './SanitizedHtml'
import { css } from 'glamor'

/**
 * This component is used to display rich html content to users in a standardized
 * way. It also allows you to convert some rich media links like youtube into
 * embeds.
 */

interface IProps {
  allowYoutube?: boolean
  html: string
  localAnchors?: boolean
}

class RichMediaHtmlContent extends React.Component<IProps> {
  static defaultProps = {
    allowYoutube: false,
  }

  injectYoutubeVideos = (content: string) => {
    const youtubeRegex = /https:\/\/(youtu\.be\/|www.youtube\.com\/watch\?v=)([\w-]+)/gi
    const youtubeWrapper = `
      <div class="youtubeWrapper">
        <iframe src="https://youtube.com/embed/$2" frameborder="0" allowfullscreen></iframe>
      </div>
    `
    return content.replace(youtubeRegex, youtubeWrapper)
  }

  render() {
    const { html, allowYoutube, ...props } = this.props
    return (
      <SanitizedHtml
        localAnchors
        html={allowYoutube ? this.injectYoutubeVideos(html) : html}
        {...props}
        config={{
          ADD_ATTR: ['target'],
          ADD_TAGS: ['iframe'],
          FORBID_TAGS: ['style'],
          FORBID_ATTR: ['style'],
        }}
        {...css({
          '> ul': {
            paddingLeft: '40px',
            marginTop: '10px',
            marginBottom: '10px',
            listStyleType: 'disc',
          },
          ' a': { textDecoration: 'underline' },
          '> p': {
            margin: 0,
            marginBottom: '10px',
          },
        })}
      />
    )
  }
}

export default RichMediaHtmlContent
