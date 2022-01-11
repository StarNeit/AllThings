import React from 'react'
import TwoStates from 'components/TwoStates'
import LoginButton from 'components/LoginButton'

interface IProps {
  activeText: string
  dataE2e?: string
  formName?: string
  inactiveText: string
  locale?: string
  pending: boolean
}

class TwoStatesLoginButton extends React.Component<IProps> {
  render() {
    const {
      locale,
      pending,
      inactiveText,
      activeText,
      formName,
      dataE2e,
    } = this.props
    return (
      <LoginButton
        data-e2e={dataE2e}
        data-e2e-active-locale={locale}
        type="submit"
        form={formName}
        style={{ overflow: 'hidden', outline: 'none' }}
      >
        <TwoStates active={pending ? 0 : 1}>
          <div style={{ padding: 1 }}>{inactiveText}</div>
          <div style={{ padding: 9 }} data-e2e="login-button-label">
            {activeText}
          </div>
        </TwoStates>
      </LoginButton>
    )
  }
}

export default TwoStatesLoginButton
