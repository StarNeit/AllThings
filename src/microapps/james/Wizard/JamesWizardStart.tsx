import React from 'react'
import { Text, Button } from '@allthings/elements'
import ConciergeIcon from 'components/Icons/ConciergeIcon'
import { css } from 'glamor'
import Row from './Row'

import { ScrollWizardPage } from 'components/ScrollWizard'

interface IProps {
  color: string
  greetName: string
  onAdvance: () => void
}

class JamesWizardStart extends React.Component<IProps> {
  render() {
    const { greetName, color, onAdvance, ...restProps } = this.props

    return (
      <ScrollWizardPage {...restProps}>
        <Row {...css({ maxWidth: 160 })}>
          <Text size="xl" color="#fff" align="center">
            Hallo {greetName}!<br />
            Ich bin dein digitaler Concierge.
          </Text>
        </Row>
        <Row>
          <ConciergeIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Ich möchte dir dein Leben Zuhause noch etwas angenehmer machen.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
            data-e2e="james-start-next"
          >
            <Text color="contrast">Weiter</Text>
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardStart
