import { ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'
import { css } from 'glamor'
import React, { ReactElement } from 'react'
import LoginButton from 'components/LoginButton'
import WithAppIntro from '../AppIntroContainer'
import { Redirect } from 'react-router'

interface IProps {
  button?: string | ReactElement
  buttonDisable?: boolean
  cancel?: string | ReactElement
  content: ReactElement
  'data-e2e'?: string
  header: string
  isCheckedIn?: boolean
  onButtonClick?: () => void
  onCancelTextClick?: () => void
  subHeader?: string
}

const RegistrationScreensTemplate = ({
  button,
  buttonDisable,
  cancel,
  content,
  'data-e2e': dataE2e,
  header,
  isCheckedIn,
  onButtonClick,
  onCancelTextClick,
  subHeader,
}: IProps) => (
  <WithAppIntro data-e2e={dataE2e}>
    {isCheckedIn && <Redirect to="/" />}
    <View
      direction="column"
      alignH="space-between"
      alignV="center"
      {...css({ margin: '0 auto', minHeight: '350px', width: '80%' })}
    >
      <View {...css({ maxWidth: '100%' })}>
        <Text
          align="center"
          color={ColorPalette.text.secondary}
          size="giant"
          strong
          {...css({ marginTop: '12px' })}
        >
          {header}
        </Text>
        {subHeader && (
          <View>
            <Text
              align="center"
              color={ColorPalette.greyIntense}
              size="l"
              {...css({ marginTop: '12px' })}
            >
              {subHeader}
            </Text>
          </View>
        )}
        {content}
      </View>
      {button && (
        <View
          alignV="center"
          alignH="center"
          direction="row"
          {...css({ marginBottom: '10px', minWidth: '80%' })}
        >
          <LoginButton
            data-e2e={`check-in-button${buttonDisable ? '-disabled' : ''}`}
            onClick={onButtonClick}
            disabled={buttonDisable}
          >
            {button}
          </LoginButton>
        </View>
      )}
      {cancel && (
        <Text
          align="center"
          color={ColorPalette.blue}
          onClick={onCancelTextClick}
          size="m"
          strong
          {...css({ cursor: 'pointer', marginTop: '12px' })}
        >
          {cancel}
        </Text>
      )}
    </View>
  </WithAppIntro>
)

export default RegistrationScreensTemplate
