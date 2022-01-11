import React from 'react'
import { Text, Button } from '@allthings/elements'
import WashingIcon from 'components/Icons/WashingIcon'
import { css } from 'glamor'
import Row from './Row'

import { ScrollWizardPage } from 'components/ScrollWizard'

interface IProps {
  color: string
  onAdvance: () => void
}

class JamesWizardWash extends React.Component<IProps> {
  render() {
    const { color, onAdvance, ...restProps } = this.props

    return (
      <ScrollWizardPage {...restProps}>
        <Row {...css({ maxWidth: 160 })}>
          <Text size="xl" color="#fff" align="center">
            Keine Zeit zum Wäsche waschen?
          </Text>
        </Row>
        <Row>
          <WashingIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Unser Wäscheservice reinigt und bügelt dir deine Wäsche.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
            data-e2e="james-wash-next"
          >
            Weiter
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardWash
