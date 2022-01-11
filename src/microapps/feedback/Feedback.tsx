import React, { Component } from 'react'
import { ColorPalette } from '@allthings/colors'
import { defineMessages, injectIntl } from 'react-intl'
import FeedbackForm from './FeedbackForm'
import FeedbackSuccess from './FeedbackSuccess'
import { SimpleLayout, ThemeProvider, Inset, Card } from '@allthings/elements'
import Microapp from 'components/Microapp'
import BigTitleBar from 'components/TitleBar/BigTitleBar'

const { cardLabel, title } = defineMessages({
  cardLabel: {
    id: 'feedback.card-label-questions',
    description: 'Form section label',
    defaultMessage: 'Questions and Comments',
  },
  title: {
    id: 'feedback.title-bar',
    description: 'Title bar of feedback microapp',
    defaultMessage: 'App Feedback',
  },
})

class Feedback extends Component<InjectedIntlProps> {
  state = { showSuccess: false }

  handleSuccess = () => this.setState({ showSuccess: true })

  render() {
    const { formatMessage } = this.props.intl

    return (
      <ThemeProvider theme={{ primary: ColorPalette.lightBlueIntense }}>
        <Microapp>
          <SimpleLayout padded={'horizontal'}>
            <BigTitleBar
              title={formatMessage(title)}
              subTitle={formatMessage(cardLabel)}
            />
            <Inset vertical={true} />
            {!this.state.showSuccess && (
              <FeedbackForm showSuccess={this.handleSuccess} />
            )}
            {this.state.showSuccess && (
              <Card>
                <FeedbackSuccess />
              </Card>
            )}
          </SimpleLayout>
        </Microapp>
      </ThemeProvider>
    )
  }
}
export default injectIntl(Feedback)
