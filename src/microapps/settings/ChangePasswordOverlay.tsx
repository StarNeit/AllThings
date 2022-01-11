import React from 'react'
import find from 'lodash-es/find'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Form } from 'containers/Form'

import DoublePasswordInput, {
  ValidationRules,
} from 'components/Form/DoublePasswordInput'
import FormGroup from 'components/Form/FormGroup'
import FormGroupItem from 'components/Form/FormGroupItem'
import InputError from 'components/Form/InputError'
import PasswordInput from 'components/Form/PasswordInput'

import authentication from 'store/actions/authentication'
import { ColorPalette } from '@allthings/colors'
import { FloatingButton, SquareIconButton, Text } from '@allthings/elements'
import { css } from 'glamor'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { Gateway } from 'react-gateway'
import { CustomTitleBar } from 'components/TitleBar'
import { IApiRequest } from 'store/api'

const intl = defineMessages({
  passwordLabel: {
    id: 'change-password.current-password-label',
    description: '',
    defaultMessage: 'Your current password',
  },
  newPasswordLabel: {
    id: 'change-password.current-new-password-label',
    description: '',
    defaultMessage: 'New password',
  },
  newPasswordRepeatLabel: {
    id: 'change-password.current-new-password-repeat-label',
    description: '',
    defaultMessage: 'Repeat new password',
  },
})

interface IProps {
  readonly appConfig: MicroAppProps
  readonly passwordChanged: boolean
  readonly onRequestClose: () => void
  readonly theme: any
  readonly userId: string
}

interface IState {
  readonly errorCurrentPasswordWrong: Date
}

class ChangePasswordOverlay extends React.Component<
  IProps & DispatchProp & InjectedIntlProps
> {
  state: IState = {
    errorCurrentPasswordWrong: null,
  }

  handleError = () => {
    this.setState({
      errorCurrentPasswordWrong: new Date(),
    })
  }

  handleSuccess = () => {
    this.props.dispatch(authentication.changePassword())
    this.props.onRequestClose()
  }

  buildRequest = ({
    currentPassword,
    password,
  }: {
    currentPassword: string
    password: string
  }): IApiRequest => {
    const { passwordChanged, userId } = this.props

    const entity = {
      plainPassword: password,
      ...(passwordChanged && { currentPassword }),
    }

    return {
      method: 'PUT',
      path: `/api/v1/users/${userId}/password`,
      entity,
    }
  }

  renderSaveButton = () => {
    const { appConfig } = this.props
    return (
      <FormGroup key="save-button">
        <FloatingButton
          data-e2e="change-password-overlay.submit"
          type="submit"
          {...css(appConfig ? { backgroundColor: appConfig.color } : {})}
        >
          <Text strong color="white">
            <FormattedMessage
              id="change-password.save"
              description="The label of the save button"
              defaultMessage="Save"
            />
          </Text>
        </FloatingButton>
      </FormGroup>
    )
  }

  renderOverlayTitleBar = () => (
    <CustomTitleBar alignH="end">
      <SquareIconButton
        icon="remove-light-filled"
        iconSize="xs"
        data-e2e="cancel-overlay"
        onClick={this.props.onRequestClose}
      />
    </CustomTitleBar>
  )

  renderPasswordForm = () => {
    const { formatMessage } = this.props.intl

    return (
      <FormGroup key="password">
        <h2 className="formGroup-title">
          <FormattedMessage
            id="change-password.current-password"
            description="The tip for the current password"
            defaultMessage="Enter your current password:"
          />
        </h2>
        <FormGroupItem>
          <PasswordInput
            autoFocus={true}
            name="currentPassword"
            placeholder={formatMessage(intl.passwordLabel)}
            style={{ borderTop: `1px solid ${ColorPalette.lightGreyIntense}` }}
          />
        </FormGroupItem>
        {this.renderPasswordFormError()}
      </FormGroup>
    )
  }

  renderPasswordFormError = () => {
    if (this.state.errorCurrentPasswordWrong) {
      return (
        <InputError
          position="bottom"
          // TODO: why date is passed as timestamp?
          timestamp={
            (this.state.errorCurrentPasswordWrong as unknown) as number
          }
        >
          <FormattedMessage
            id="change-password.current-password-wrong"
            description="The error message when user has entered a wrong password"
            defaultMessage="The password you entered is wrong"
          />
        </InputError>
      )
    } else {
      return null
    }
  }

  renderChangeForm = () => {
    const { formatMessage } = this.props.intl

    return (
      <FormGroup key="change">
        <h2 className="formGroup-title">
          <FormattedMessage
            id="change-password.new-password"
            description="The tip for the new password"
            defaultMessage="Enter the new password:"
          />
        </h2>
        <FormGroupItem>
          <DoublePasswordInput
            placeholder={formatMessage(intl.newPasswordLabel)}
            repeatPlaceholder={formatMessage(intl.newPasswordRepeatLabel)}
            style={{ border: `1px solid ${ColorPalette.lightGreyIntense}` }}
          />
        </FormGroupItem>
      </FormGroup>
    )
  }

  render() {
    const { passwordChanged } = this.props

    return (
      <Gateway into="root">
        <Overlay
          theme={{ primary: this.props.appConfig.color }}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayWindow>
            <Form
              request={this.buildRequest}
              onError={this.handleError}
              onSuccess={this.handleSuccess}
              name="changePassword"
              autoComplete="off"
              validateConstraints={ValidationRules}
            >
              {this.renderOverlayTitleBar()}
              {passwordChanged && this.renderPasswordForm()}
              {this.renderChangeForm()}
              {this.renderSaveButton()}
            </Form>
          </OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

export default connect((state: IReduxState) => ({
  passwordChanged: state.authentication.user.passwordChanged,
  userId: state.authentication.user.id,
  appConfig: find(state.app.microApps, { type: 'settings' }) as MicroAppProps,
}))(injectIntl(ChangePasswordOverlay))
