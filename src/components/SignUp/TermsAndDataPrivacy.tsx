import React from 'react'
import { FormCheckbox, Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { defineMessages, useIntl } from 'react-intl'

import Link from 'components/Link'
import { THEME } from './'

const BACKGROUND_COLOR = ColorPalette.white
const MESSAGES = defineMessages({
  dataProtection: {
    id: 'signup.data-protection',
    description: 'Data protection checkbox in the signup form',
    defaultMessage: 'Data protection conditions',
  },
  termsOfUse: {
    id: 'signup.terms-of-use',
    description: 'Terms of use checkbox in the signup form',
    defaultMessage: 'Terms of use',
  },
  termsAndDataPrivacyError: {
    id: 'signup.terms-and-data-privacy-error',
    description: 'Terms of use and data privacy error in the signup form',
    defaultMessage:
      'Please accept the terms of use and the data protection conditions.',
  },
})

const styles = {
  checkboxLink: () =>
    css({
      ':hover': {
        color: THEME.primary,
      },
    }),
}

interface IProps {
  dataProtection: boolean
  dataProtectionURL: string
  onDataProtection: () => void
  onTermsOfUse: () => void
  termsOfUse: boolean
}

const TermsAndDataPrivacy = ({
  dataProtection,
  dataProtectionURL,
  onDataProtection,
  onTermsOfUse,
  termsOfUse,
}: IProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <FormCheckbox
        backgroundColor={BACKGROUND_COLOR}
        checked={termsOfUse}
        key="termsOfUse"
        label={
          <Link to="/terms-of-use" data-e2e="signup-goto-terms-of-use">
            <Text size="l" {...styles.checkboxLink}>
              {formatMessage(MESSAGES.termsOfUse)}
            </Text>
          </Link>
        }
        name="termsOfUse"
        onChange={onTermsOfUse}
        data-e2e="signup-accept-terms-of-use"
      />
      <FormCheckbox
        backgroundColor={BACKGROUND_COLOR}
        checked={dataProtection}
        key="dataProtection"
        label={
          <a
            data-e2e-data-protection-url={dataProtectionURL}
            href={dataProtectionURL}
            rel="noopener"
            target="_blank"
          >
            <Text size="l" {...styles.checkboxLink()}>
              {formatMessage(MESSAGES.dataProtection)}
            </Text>
          </a>
        }
        name="dataProtection"
        onChange={onDataProtection}
        data-e2e="signup-accept-data-protection"
      />
    </>
  )
}

export default TermsAndDataPrivacy
