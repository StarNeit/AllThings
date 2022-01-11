import React from 'react'
import { Text, Button } from '@allthings/elements'
import ConciergeIcon from 'components/Icons/ConciergeIcon'
import { css } from 'glamor'
import Row from './Row'

import { ScrollWizardPage } from 'components/ScrollWizard'

interface IProps {
  greetName: string
  color: string
  onAdvance: () => void
}

class CommercialWizardStart extends React.Component<IProps> {
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
            Ich möchte dir dein Arbeitsleben noch etwas angenehmer machen.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
            data-e2e="commercial-james-start-next"
          >
            Weiter
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default CommercialWizardStart
