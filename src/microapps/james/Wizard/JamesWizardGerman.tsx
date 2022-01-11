import React from 'react'
import { Text, Button } from '@allthings/elements'
import ConciergeIcon from 'components/Icons/ConciergeIcon'
import { css } from 'glamor'
import Row from './Row'

import { ScrollWizardPage } from 'components/ScrollWizard'

interface IProps {
  color: string
  onAdvance: () => void
}

class JamesWizardGerman extends React.Component<IProps> {
  render() {
    const { color, onAdvance, ...restProps } = this.props

    return (
      <ScrollWizardPage {...restProps}>
        <Row {...css({ maxWidth: 160 })}>
          <svg width="78px" height="73px" viewBox="-1 -1 78 73">
            <text
              transform="translate(0, 12)"
              id="??"
              stroke="none"
              fill="none"
              fontFamily="OpenSans, Open Sans"
              fontSize="24"
              fontWeight="normal"
            >
              <tspan x="26.0532227" y="30" fill="#FFFFFF">
                ?
              </tspan>
              <tspan x="36.3540039" y="30" fontSize="34" fill="#FFFFFF">
                ?
              </tspan>
            </text>
            <path
              d="M37.6175686,3.34111126e-15 C58.3598959,3.34111126e-15 75.2351372,13.2865252 75.2351372,29.6200735 C75.2351372,45.2765056 61.591245,54.8990796 45.5435903,58.6645982 L37.6175686,69.791875 L29.6915469,58.6645982 C13.5009454,54.861462 0,45.0583237 0,29.6200735 C0,13.2865252 16.8752413,0 37.6175686,0 L37.6175686,3.34111126e-15 Z"
              id="Shape"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </Row>
        <Row>
          <ConciergeIcon />
        </Row>
        <Row {...css({ maxWidth: 230 })}>
          <Text size="xl" color="#fff" align="center">
            Unfortunately I can only understand German so far.
          </Text>
        </Row>
        <Row>
          <Button
            onClick={onAdvance}
            {...css({ borderWidth: 1, borderStyle: 'solid' })}
            backgroundColor={color}
            data-e2e="james-german"
          >
            Continue in German
          </Button>
        </Row>
      </ScrollWizardPage>
    )
  }
}

export default JamesWizardGerman
