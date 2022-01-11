import React, { useState } from 'react'
import { Gateway } from 'react-gateway'
import Overlay from 'components/Overlay'
import {
  Button,
  Inset,
  Relative,
  SimpleLayout,
  Spacer,
  SquareIconButton,
  Text,
  TextInput,
  View,
} from '@allthings/elements'
import { CustomTitleBar } from 'components/TitleBar'
import { ColorPalette } from '@allthings/colors'
import AuthActions from 'store/actions/authentication'
import { css, keyframes } from 'glamor'
import { connect } from 'react-redux'
import { defineMessages, useIntl } from 'react-intl'
import withRequest, { IWithRequest } from 'containers/withRequest'
import DeleteAccountSuccess from './DeleteAccountSuccess'
import { useTheme } from '@allthings/elements/Theme/Theme'

const bounceInDown = keyframes({
  '0%': {
    opacity: '0',
    transform: 'translate3d(0, -100%, 0)',
  },
  '60%': {
    opacity: '1',
  },
  '100%': {
    transform: 'translate3d(0, 0, 0)',
  },
})

const animations = {
  bounceInDown: { animation: `${bounceInDown} 0.42s` },
}

const messages = defineMessages({
  dialogTitle: {
    defaultMessage: 'Are you sure?',
    description: 'Title of account delete overlay.',
    id: 'account-delete-overlay.title',
  },
  heading: {
    defaultMessage: 'Do you really want to delete your account?',
    description: 'Heading of the account delete overlay.',
    id: 'account-delete-overlay.heading',
  },
  description: {
    defaultMessage:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    description: 'Account deletion description.',
    id: 'account-delete-overlay.description',
  },
  emailValueInvalid: {
    defaultMessage: "The value doesn't match the account email address.",
    description: "Account deletion error message when email doesn't match.",
    id: 'account-delete-overlay.email-value-invalid',
  },
  inputPlaceholder: {
    defaultMessage: 'type your mailaddress here',
    description: 'Account deletion overlay email input placeholder.',
    id: 'account-delete-overlay.input-placeholder',
  },
  buttonNo: {
    defaultMessage: 'No, rather not',
    description: 'Button label cancel deletion.',
    id: 'account-delete-overlay.button-no',
  },
  buttonYes: {
    defaultMessage: 'Yes, delete',
    description: 'Button label confirm deletion.',
    id: 'account-delete-overlay.button-yes',
  },
  errorMessage: {
    defaultMessage:
      "You have upcoing confirmed bookings and can't delete your account.",
    description:
      'Error message account deletion regarding opoen upcoming bookings.',
    id: 'account-delete-overlay.error-message',
  },
})

const MARGIN = 10

const STYLES = {
  dialogInput: css({
    border: `1px solid ${ColorPalette.lightGreyIntense}`,
    borderRadius: '1px',
  }),
  dialogButtonsContainer: css({
    padding: `${MARGIN * 4}px 0 ${MARGIN * 2}px`,
  }),
}

interface IProps {
  email: string
  onClickDeleteAccount: () => void
  onClose: () => void
}

const DeleteAccountOverlay = ({
  email,
  onClickDeleteAccount,
  onClose,
}: IProps & IWithRequest) => {
  const [emailValue, setEmailValue] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const { formatMessage } = useIntl()
  const { theme } = useTheme()

  const handleClose = () => {
    setErrorMessage(undefined)
    onClose()
  }

  const handleSubmit = async () => {
    const emailValid = emailValue === email
    setErrorMessage(
      !emailValid ? formatMessage(messages.emailValueInvalid) : undefined,
    )
    const result = emailValid ? await onClickDeleteAccount() : false
    result ? handleSuccess() : emailValid && handleError()
  }

  const handleSuccess = () => {
    setErrorMessage(undefined)
    setSuccess(true)
  }

  const handleError = () => {
    setErrorMessage(formatMessage(messages.errorMessage))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value)
  }

  return (
    <Gateway into="root">
      <Overlay
        theme={theme}
        direction="row"
        alignH="center"
        alignV="stretch"
        onBackgroundClick={handleClose}
      >
        <Relative
          flex="flex"
          alignV="stretch"
          direction="column"
          style={{
            maxWidth: 430,
            maxHeight: 736,
            width: '100%',
          }}
          {...css(animations.bounceInDown, {
            // IE hack to make the whole thing visible!
            '@media all and (min-width: 880px)': {
              flex: 'auto',
              // height: 736,
              height: '100vh',
            },
          })}
        >
          {success ? (
            <SimpleLayout backgroundColor="white">
              <DeleteAccountSuccess />
            </SimpleLayout>
          ) : (
            <div>
              <CustomTitleBar color={theme.primary} alignH="space-between">
                <Inset horizontal={true}>
                  <Text strong>{formatMessage(messages.dialogTitle)}</Text>
                </Inset>
                <SquareIconButton
                  icon="remove-light-filled"
                  iconSize="xs"
                  onClick={handleClose}
                />
              </CustomTitleBar>
              <SimpleLayout>
                <View
                  fill
                  alignH="center"
                  alignV="center"
                  direction="column"
                  style={{ padding: 40 }}
                >
                  <Spacer height="20" />
                  <Text align="center" strong={true} size="xl">
                    {formatMessage(messages.heading)}
                  </Text>
                  <Spacer />
                  <Text align="center">
                    {formatMessage(messages.description)}
                  </Text>
                  <Spacer height="40" />
                  <View
                    fill
                    direction="column"
                    {...css({
                      // Fix for firefox APP-2330
                      height: 'unset!important',
                      minHeight: 'unset!important',
                    })}
                  >
                    {errorMessage && (
                      <Text
                        size="m"
                        color={ColorPalette.red}
                        data-e2e="delete-account-error-message"
                      >
                        {errorMessage}
                      </Text>
                    )}
                    <View {...STYLES.dialogInput}>
                      <TextInput
                        data-e2e="delete-account-overlay-input"
                        name="email"
                        type="email"
                        placeholder={formatMessage(messages.inputPlaceholder)}
                        onChange={handleChange}
                        value={emailValue}
                        required
                      />
                    </View>
                  </View>
                  <View
                    alignV="center"
                    alignH="center"
                    direction="row"
                    fill
                    {...STYLES.dialogButtonsContainer}
                    {...css({
                      // Fix for firefox APP-2330
                      height: 'unset!important',
                      minHeight: 'unset!important',
                    })}
                  >
                    <View {...css({ marginRight: 10 })}>
                      <Button
                        type="submit"
                        onClick={handleClose}
                        data-e2e="delete-account-overlay-cancel"
                        backgroundColor={ColorPalette.white}
                      >
                        <Text block strong>
                          {formatMessage(messages.buttonNo)}
                        </Text>
                      </Button>
                    </View>
                    <View>
                      <Button
                        type="submit"
                        data-e2e="delete-account-overlay-confirm"
                        onClick={handleSubmit}
                        backgroundColor={ColorPalette.red}
                      >
                        <Text block color={ColorPalette.white} strong>
                          {formatMessage(messages.buttonYes)}
                        </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </SimpleLayout>
            </div>
          )}
        </Relative>
      </Overlay>
    </Gateway>
  )
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  onClickDeleteAccount: () => dispatch(AuthActions.deleteAccount()),
})

export default connect(
  null,
  mapDispatchToProps,
)(withRequest(DeleteAccountOverlay))
