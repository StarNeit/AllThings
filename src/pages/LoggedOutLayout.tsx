import { alpha, ColorPalette } from '@allthings/colors'
import { Spacer, Text, View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import { useTheme } from '@allthings/elements/Theme'
import Link from 'components/Link'
import Logo from 'components/Logo'
import { push } from 'connected-react-router'
import PoweredBy from 'containers/PoweredBy'
import { css } from 'glamor'
import loadImage from 'utils/loadImage'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { getStaticImage } from 'utils/getStaticImage'

interface IProps {
  backgroundImage?: string
  children: React.ReactNode
  appTheme?: string
  pathname?: string
}

const LoggedOutLayout = ({
  backgroundImage,
  children,
  dispatch,
  appTheme,
  pathname,
}: IProps & DispatchProp) => {
  const { theme } = useTheme()
  const logoBackgroundColor = alpha(theme.primary, 0.7)
  const color = theme.contrast
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      const BGI = backgroundImage
        ? backgroundImage
        : getStaticImage('city-background.png')

      try {
        const img = await loadImage(BGI)
        setBackgroundImageUrl(`url(${img.src})`)
      } catch (e) {
        setBackgroundImageUrl(`url(${BGI})`)
      }
    }

    fetchBackgroundImage()
  }, [])

  return (
    <View
      {...css({
        display: 'flex',
        flexDirection: 'row',
      })}
    >
      <View
        direction="column"
        {...css({
          backgroundColor: ColorPalette.white,
          minHeight: '100vh',
          width: '100%',
          maxWidth: '35vw',
          minWidth: 450,
          [createMQ('mobile')]: {
            minWidth: '100%',
            maxWidth: '100%',
          },
        })}
      >
        <View
          direction="row"
          alignV="center"
          {...css({
            height: 80,
            paddingLeft: '5vw',
            paddingRight: '5vw',
            [createMQ('desktop', 'tablet')]: {
              marginTop: appTheme === 'pale' ? '20px' : '',
            },
          })}
        >
          <View
            direction="row"
            alignH="center"
            alignV="center"
            {...css({
              backgroundColor: logoBackgroundColor,
              height: '100%',
              padding: appTheme === 'dark' ? 25 : '',
              maxWidth: 205,
              width: 'auto',
              borderRadius: 2,
              marginTop: -2,
              [createMQ('mobile')]: {
                padding: appTheme === 'dark' ? 10 : '',
              },
            })}
          >
            <Logo onClick={() => dispatch(push('/'))} color={color} />
          </View>
          <Spacer width={20} />
          <View direction="row" alignH="center" alignV="center">
            <PoweredBy />
          </View>
        </View>
        <View
          direction="column"
          flex="grow"
          alignH="center"
          {...css({
            paddingTop: 20,
            paddingLeft: '5vw',
            paddingRight: '5vw',
          })}
        >
          {children}
        </View>
        <View
          direction="row"
          {...css({
            height: 60,
            paddingLeft: '5vw',
            paddingRight: '5vw',
          })}
        >
          {pathname !== '/legal' && (
            <Link to="/legal" data-e2e="login-legal">
              <Text color={ColorPalette.lightGreyIntense} size="m">
                <FormattedMessage
                  id="register.legal-disclosure"
                  description="Link to the legal disclosure"
                  defaultMessage="Legal disclosure"
                />
              </Text>
            </Link>
          )}
        </View>
      </View>

      <View
        flex="grow"
        {...css({
          backgroundImage: `${backgroundImageUrl}`,
          backgroundSize: 'cover',
          backgroundPositionX: 'center',
          backgroundPositionY: 'center',
          backgroundRepeat: 'no-repeat',
        })}
      />
    </View>
  )
}

export default connect(({ app, router }: IReduxState) => ({
  backgroundImage:
    app.config.backgroundImageURLs && app.config.backgroundImageURLs.original,
  appTheme: app.config.theme,
  pathname: router.location && router.location.pathname,
}))(LoggedOutLayout)
