import React from 'react'
import { FormattedMessage } from 'react-intl'
import FullPageInformation, {
  ImageColumn,
  TextColumn,
} from 'components/FullPageInformation'
import Heart from '@allthings/react-ionicons/lib/IosHeartOutlineIcon'

interface IProps {
  onLogoClick: OnClick
}

class SetupPage extends React.Component<IProps> {
  render() {
    return (
      <FullPageInformation onLogoClick={this.props.onLogoClick}>
        <ImageColumn>
          <Heart style={{ width: 128, height: 128 }} />
        </ImageColumn>
        <TextColumn>
          <h1
            className="mainContent-title"
            style={{ textAlign: 'initial', fontSize: 36 }}
          >
            <FormattedMessage
              id="project-setup.title"
              description="Greet the user, when the app is not ready to use"
              defaultMessage="Nice to see you!"
            />
          </h1>
          <div className="mainContent-body">
            <p className="paragraph">
              <FormattedMessage
                id="project-setup.message"
                description="Explain to the user, why the app is still in setup"
                defaultMessage="The app is being set up and will be ready for you to use in a minute."
              />
            </p>
            <p className="paragraph">
              <FormattedMessage
                id="project-setup.message-hint"
                description="Explain to the administrator, that the app must be configured"
                defaultMessage="Tip: If you are the one that is setting things up, you can finish the configuration at https://admin.allthings.me/"
              />
            </p>
          </div>
        </TextColumn>
      </FullPageInformation>
    )
  }
}

export default SetupPage
