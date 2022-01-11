import React from 'react'
import { Text, Button } from '@allthings/elements'
import ReservationIcon from 'components/Icons/ReservationIcon'
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
            Ein wichtiges Geschäftsessen und noch keine Plätze reserviert?
          </Text>
        </Row>
        <Row {...css({ marginBottom: 0 })}>
          <ReservationIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Mit unserem Service bekommst du Plätze in den besten Restaurants und
            Veranstaltungen.
          </Text>
        </Row>
        <Row direction="column">
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
          >
            {`Los geht's!`}
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardHoliday
