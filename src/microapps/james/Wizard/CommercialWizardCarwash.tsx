import React from 'react'
import { Text, Button } from '@allthings/elements'
import CarWashIcon from 'components/Icons/CarWashIcon'
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
        <Row {...css({ maxWidth: 160, marginBottom: 0 })}>
          <Text size="xl" color="#fff" align="center">
            Keine Zeit zum Autowaschen aber ein glänzender Auftritt ist
            unverzichtbar?
          </Text>
        </Row>
        <Row {...css({ marginBottom: 0 })}>
          <CarWashIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Unser Autowäsche-Service reinigt dein Auto von innen und außen.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
          >
            Weiter
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardHoliday
