import React from 'react'
import { FormattedMessage } from 'react-intl'
import FullPageInformation, {
  ImageColumn,
  TextColumn,
} from 'components/FullPageInformation'
import IosClockOutlineIcon from '@allthings/react-ionicons/lib/IosClockOutlineIcon'

interface IProps {
  userAgent?: string
  onLogoClick: OnClick
}

class AppMaintenancePage extends React.Component<IProps> {
  render() {
    return (
      <FullPageInformation onLogoClick={this.props.onLogoClick}>
        <ImageColumn>
          <IosClockOutlineIcon style={{ width: 128, height: 128 }} />
        </ImageColumn>
        <TextColumn>
          <h1
            className="mainContent-title"
            style={{ textAlign: 'initial', fontSize: 36 }}
          >
            <FormattedMessage
              id="maintenance.title"
              description="Greet the user, when things go wrong"
              defaultMessage="We are back in a minute!"
            />
          </h1>
          <div className="mainContent-body">
            <p className="paragraph">
              <FormattedMessage
                id="maintenance.message"
                description="Explain to the user, that the app will be back available soon"
                defaultMessage="Things go wild sometimes. We are working on getting Allthings available for you – so come back as soon as possible."
              />
            </p>
          </div>
        </TextColumn>
      </FullPageInformation>
    )
  }
}

export default AppMaintenancePage
