import React from 'react'
import { Text, Button } from '@allthings/elements'
import PlantIcon from 'components/Icons/PlantIcon'
import { css } from 'glamor'
import Row from './Row'

import { ScrollWizardPage } from 'components/ScrollWizard'

interface IProps {
  color: string
  onAdvance: () => void
}

class JamesWizardHoliday extends React.Component<IProps> {
  render() {
    const { color, onAdvance, ...restProps } = this.props

    return (
      <ScrollWizardPage {...restProps}>
        <Row {...css({ maxWidth: 160 })}>
          <Text size="xl" color="#fff" align="center">
            Du fährst bald in den Urlaub?
          </Text>
        </Row>
        <Row>
          <PlantIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Gerne kümmern wir uns um deine Pflanzen.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
            data-e2e="james-holidays-next"
          >
            {`Los geht's!`}
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardHoliday
