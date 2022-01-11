import React from 'react'
import { css } from 'glamor'

import { View, ListItem, Image, Spacer, Text } from '@allthings/elements'
import Translated from 'containers/Translated'
import get from 'lodash-es/get'
import { alpha, ColorPalette } from '@allthings/colors'
import { IAsset } from '.'
import { getStaticImage } from 'utils/getStaticImage'

const styles = {
  container: css({
    cursor: 'pointer',
    width: '100%', // Needed for I.E...
  }),
  image: css({
    background: ColorPalette.lightGrey,
    minHeight: 100,
    minWidth: 100,
  }),
  listItem: (active: boolean) =>
    css({
      backgroundColor: active ? alpha(ColorPalette.black, 0.02) : 'transparent',
      ':hover': {
        backgroundColor: alpha(ColorPalette.black, 0.02),
      },
    }),
}

interface IProps {
  active: boolean
  asset: IAsset
  onClick: OnClick
  showSkeleton?: boolean
}

export default class AssetListItem extends React.Component<IProps> {
  handleBookingClick = () => this.props.onClick(this.props.asset.id)

  render() {
    const { active, children, asset, showSkeleton, ...props } = this.props
    const image = get(
      asset,
      '_embedded.files[0]._embedded.files.small.url',
      getStaticImage('default/image.svg'),
    )
    const getEnglishNameOfAsset = get(asset, 'translations[0].name')

    return showSkeleton ? (
      <View
        {...props}
        direction="row"
        key={asset.id}
        onClick={this.handleBookingClick}
        {...css({
          height: '100px',
          width: '100%', // Needed for I.E...
        })}
      >
        <View {...styles.image}>
          <View style={{ width: 100, height: 99 }} />
        </View>
        <ListItem flex="grow" {...styles.listItem(false)}>
          <View alignV="stretch" direction="column" flex="flex">
            <View
              {...css({
                height: 20,
                width: 100,
                backgroundColor: ColorPalette.lightGrey,
              })}
            />
            <Spacer />
            <View
              direction="column"
              {...css({
                height: 20,
                width: 60,
                backgroundColor: ColorPalette.lightGrey,
              })}
            />
          </View>
        </ListItem>
      </View>
    ) : (
      <View
        {...props}
        direction="row"
        key={asset.id}
        onClick={this.handleBookingClick}
        {...styles.container}
      >
        <View {...styles.image}>
          {image && (
            <Image
              position="center"
              src={image}
              size="cover"
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>
        <ListItem
          flex="grow"
          {...styles.listItem(active)}
          data-e2e={`assetlistitem-${
            getEnglishNameOfAsset && getEnglishNameOfAsset.replace
              ? getEnglishNameOfAsset.replace(/\s/g, '-').toLowerCase()
              : ''
          }`}
        >
          <Translated
            values={asset.translations}
            defaultLocale={asset.defaultLocale}
          >
            {translation => (
              <View alignV="stretch" direction="column" flex="flex">
                <Text size="l">{translation.name}</Text>
                <Spacer />
                <View direction="column">{children}</View>
              </View>
            )}
          </Translated>
        </ListItem>
      </View>
    )
  }
}
