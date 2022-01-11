import React from 'react'
import { View, SimpleLayout } from '@allthings/elements'
import { connect } from 'react-redux'
import Microapp from 'components/Microapp'
import { FormattedMessage } from 'react-intl'
import Link from 'components/Link'
import SingleIcon from 'components/SingleIcon'
import AppIntroContainer from 'pages/AppIntroContainer'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  isCheckedIn: boolean
}

const content = (isCheckedIn: boolean) => (
  <SimpleLayout
    padded
    backgroundColor={
      isCheckedIn ? ColorPalette.whiteIntense : ColorPalette.white
    }
  >
    <View flex="flex" direction="column" alignH="center" alignV="center">
      <SingleIcon />
      <h1 className="mainContent-title">
        <FormattedMessage
          id="not-found.title"
          description="The error title when the route is not found"
          defaultMessage="404"
        />
      </h1>
      <div className="mainContent-body">
        <p>
          <FormattedMessage
            id="page-not-found.message"
            description="The error message when the route is not found"
            defaultMessage="Sorry, the page you were looking for was not found."
          />
        </p>
        <p>
          <Link to="/" data-e2e="not-found-link">
            <FormattedMessage
              id="not-found.redirect-link"
              description="Label of the redirect link"
              defaultMessage="Return to home"
            />
          </Link>
        </p>
      </div>
    </View>
  </SimpleLayout>
)

const NotFound = ({ isCheckedIn }: IProps) =>
  isCheckedIn ? (
    <Microapp>{content(isCheckedIn)}</Microapp>
  ) : (
    <AppIntroContainer>{content(isCheckedIn)}</AppIntroContainer>
  )

export default connect((state: any) => ({
  isCheckedIn: state.authentication.isCheckedIn,
}))(NotFound)
