import React from 'react'
import { connect } from 'react-redux'
import { CustomTitleBar, TitleBarBackButton } from 'components/TitleBar'
import UserProfileImage from 'components/UserProfileImage'
import UserProfileOverlay from 'components/UserProfileOverlay'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import ImageGalleryOverlay from 'components/ImageGalleryOverlay'
import urlParamsToProps, { IMatchParams } from 'utils/urlParamsToProps'
import {
  confirm as confirmWithUser,
  ListSpinner,
  Text,
  Inset,
  Card,
  View,
  CardContent,
  CardButton,
  CardFooter,
  Icon,
  Image,
  SimpleLayout,
  Spacer,
  Responsive,
} from '@allthings/elements'
import { sendWarning } from '@allthings/elements/NotificationBubbleManager'
import ContactOverlay from './ContactOverlay'
import DataProvider, { IData } from 'containers/DataProvider'
import NetworkError from 'components/NetworkError'
import NotFoundPage from 'components/NetworkError/NotFoundPage'
import withRequest, { IWithRequest } from 'containers/withRequest'
import onlyImages from 'utils/onlyImages'
import sendNativeEvent from 'utils/sendNativeEvent'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { IThing } from '.'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { push } from 'connected-react-router'
import ThingOverlayToggle from 'microapps/marketplace/ThingOverlay/ThingOverlayToggle'

const styles = {
  icon: css({
    paddingRight: 7,
    paddingTop: 4,
  }),
  title: css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
}

const messages = defineMessages({
  backButton: {
    id: 'marketplace-show-thing.titlebar.back',
    description: 'Back button in the app title bar',
    defaultMessage: 'Back',
  },
  buyStatus: {
    id: 'marketplace-show-thing.buy-status',
    description: 'The status for things to buy.',
    defaultMessage: 'Buy',
  },
  contactButton: {
    id: 'marketplace-show-thing.titlebar.contact',
    description: 'Contact button in the app title bar',
    defaultMessage: 'Contact',
  },
  deleteConfirm: {
    id: 'marketplace-show-thing.titlebar.delete',
    description: 'Confirmation message if you try to delete a thing',
    defaultMessage: 'Do you really want to delete this?',
  },
  yesDelete: {
    id: 'marketplace-show-thing.titlebar.delete-yes',
    description: 'Yes button for "Do you really want to delete this?',
    defaultMessage: 'Yes',
  },
  cancelDelete: {
    id: 'marketplace-show-thing.titlebar.delete-cancel',
    description: 'Cancel button for "Do you really want to delete this?',
    defaultMessage: 'Cancel',
  },
  servicesStatus: {
    id: 'marketplace-show-thing.services-status',
    description: 'The status for things as a service.',
    defaultMessage: 'Services',
  },
})

interface IProps {
  currentAccessToken?: string // Cannot be named accessToken or it conflicts with withRequest() and is set to undefined
  backTo: string
  embeddedLayout?: boolean
  thingId?: string
  viewerId?: string
  onDeleteThing: (thingId: string) => Promise<void>
}
interface IState {
  contactOwner: boolean
  showProfile: boolean
  showImageGallery: boolean
}

class ShowThing extends React.PureComponent<
  IProps & InjectedIntlProps & IMatchParams & IWithRequest & DispatchProp,
  IState
> {
  state = {
    contactOwner: false,
    showProfile: false,
    showImageGallery: false,
  }

  static defaultProps = {
    backTo: '',
  }

  contactOwner = () => this.setState({ contactOwner: true })
  handleCloseOverlay = () => this.setState({ contactOwner: false })
  handleDelete = async () => {
    const { formatMessage } = this.props.intl
    const customization = {
      acceptButtonLabel: formatMessage(messages.yesDelete),
      cancelButtonLabel: formatMessage(messages.cancelDelete),
      'data-e2e': 'confirm-delete-thing-dialog',
      message: formatMessage(messages.deleteConfirm),
    }
    const remove = await confirmWithUser(customization)

    if (remove) {
      const { thingId, onDeleteThing, createRequest } = this.props
      onDeleteThing(thingId)
      const removeThing = await createRequest({
        method: 'DELETE',
        path: `api/v1/things/${thingId}`,
      })
      const statusCode = removeThing.status.code
      if (statusCode !== 204 && statusCode !== 201) {
        sendWarning('Could not delete')
      }
    }
  }
  renderContactOverlay = (thingId: string, username: string) => {
    return (
      <ContactOverlay
        thingId={thingId}
        contactUsername={username}
        onRequestClose={this.handleCloseOverlay}
      />
    )
  }

  toggleGallery = (images: ReadonlyArray<IFile>) => {
    if (!this.props.embeddedLayout) {
      this.setState(({ showImageGallery }) => ({
        showImageGallery: !showImageGallery,
      }))
    } else {
      sendNativeEvent(this.props.currentAccessToken, {
        name: 'open-image-gallery',
        data: images.map(image => image.files.medium),
      })
    }
  }

  // @TODO is it really a phone number
  createHandlePhoneButton = (contact: string) => () =>
    contact && window.open(`tel:${contact}`)

  renderContact = (contact: string) => {
    const { formatMessage } = this.props.intl

    return (
      <CardFooter>
        <CardButton onClick={this.contactOwner}>
          <Icon name="email" size="s" color="#7e8c8d" {...styles.icon} />
          <Text size="m" color={ColorPalette.text.secondary} strong>
            {formatMessage(messages.contactButton)}
          </Text>
        </CardButton>
        {contact && (
          <CardButton
            data-e2e="marketplace-show-contact"
            onClick={this.createHandlePhoneButton(contact)}
          >
            <Icon name="phone" size="s" color="#7e8c8d" {...styles.icon} />
            <Text size="m" color={ColorPalette.text.secondary} strong>
              {contact}
            </Text>
          </CardButton>
        )}
      </CardFooter>
    )
  }

  renderActions = ({
    thing,
    refetch,
  }: {
    thing: IThing
    refetch: () => void
  }) => {
    return (
      <CardFooter>
        <ThingOverlayToggle
          type={thing.status}
          thingId={thing.id}
          onChange={refetch}
          pushToThing={false}
        >
          {({ open }) => (
            <CardButton
              onClick={open}
              data-e2e={`marketplace-thing-${thing.name}-edit`}
            >
              <Icon name="edit" size="s" color="#7e8c8d" {...styles.icon} />
              <FormattedMessage
                id="marketplace-show-thing.edit"
                defaultMessage="Edit"
                description="Label of edit button"
              >
                {message => (
                  <Text size="m" color={ColorPalette.text.secondary} strong>
                    {message}
                  </Text>
                )}
              </FormattedMessage>
            </CardButton>
          )}
        </ThingOverlayToggle>
        <CardButton
          onClick={this.handleDelete}
          data-e2e={`marketplace-thing-${thing.name}-delete`}
        >
          <Icon name="trash" size="s" color="#7e8c8d" {...styles.icon} />
          <FormattedMessage
            id="marketplace-show-thing.delete"
            defaultMessage="Delete"
            description="Label of delete button"
          >
            {message => (
              <Text size="m" color={ColorPalette.text.secondary} strong>
                {message}
              </Text>
            )}
          </FormattedMessage>
        </CardButton>
      </CardFooter>
    )
  }

  renderLoading = () => {
    return (
      <SimpleLayout>
        <Inset vertical>
          <ListSpinner />
        </Inset>
      </SimpleLayout>
    )
  }

  renderStatus = (status: string, price: string) => {
    const { formatMessage } = this.props.intl
    const statusStyle = {
      textTransform: 'none',
      top: '13px',
    }

    switch (status) {
      case 'to-give':
        return (
          <Text
            size="giant"
            color="primary"
            strong
            {...css(statusStyle)}
            autoBreak
          >
            {price}
          </Text>
        )

      case 'services':
        return (
          <Text size="giant" color="primary" strong {...css(statusStyle)}>
            {price || formatMessage(messages.servicesStatus)}
          </Text>
        )

      case 'for-sale':
      default:
        return (
          <Text
            data-e2e="marketplace-show-price"
            size="giant"
            color="primary"
            strong
            {...css(statusStyle)}
          >
            {price}
          </Text>
        )
    }
  }

  renderThing = (thing: IThing, refetch: () => void) => {
    const { viewerId, backTo, dispatch } = this.props
    const { description, name, id, status } = thing
    const { coverImage, user } = thing._embedded
    const image = coverImage ? coverImage.files.big.url : null
    const contact = thing.properties && thing.properties.contact
    const price = thing.properties && thing.properties.price
    const thingUserId = user.id
    return (
      <>
        <Responsive mobile onlyRenderOnMatch>
          <GenericBackTitleBar onBack={() => dispatch(push(backTo))} />
        </Responsive>
        <SimpleLayout>
          {this.state.showImageGallery && (
            <ImageGalleryOverlay
              onClose={() => this.toggleGallery([])}
              images={thing._embedded.files.filter(onlyImages)}
            />
          )}
          {image && (
            <Image
              src={image}
              onClick={() =>
                this.toggleGallery(thing._embedded.files.filter(onlyImages))
              }
              position="center"
              size="cover"
              {...css({
                height: 230,
                ':hover': {
                  cursor: 'pointer',
                },
              })}
            />
          )}
          {this.state.contactOwner &&
            this.renderContactOverlay(id, user.username)}
          <Card>
            <CardContent>
              <View alignH="space-between" direction="row" fill>
                <View flex="flex" direction="column">
                  <Text
                    autoBreak
                    className="buyingDetail-title"
                    data-e2e="marketplace-show-name"
                    size="giant"
                    strong
                    style={{ width: '100%' }}
                  >
                    {name}
                  </Text>
                  <Spacer />
                  <View direction="row" alignV="center">
                    <UserProfileOverlay userId={user.id}>
                      {({ toggle }: { readonly toggle: () => void }) => (
                        <>
                          <UserProfileImage
                            onClick={toggle}
                            profileImage={user._embedded.profileImage}
                            size="s"
                            style={{ cursor: 'pointer' }}
                          />
                          <View
                            onClick={toggle}
                            style={{ cursor: 'pointer', paddingLeft: 8 }}
                          >
                            <Text strong size="s">
                              {user.username}
                            </Text>
                          </View>
                        </>
                      )}
                    </UserProfileOverlay>
                  </View>
                </View>
                <View>{this.renderStatus(status, price)}</View>
              </View>
              <Inset vertical horizontal={false}>
                <View direction="row" alignH="space-between">
                  <View flex="flex">
                    <Text
                      size="l"
                      data-e2e="marketplace-show-description"
                      autoBreak
                    >
                      {description}
                    </Text>
                  </View>
                </View>
              </Inset>
            </CardContent>
            <span style={{ clear: 'both' }} />
            {viewerId === thingUserId
              ? this.renderActions({ thing, refetch })
              : this.renderContact(contact)}
          </Card>
        </SimpleLayout>
      </>
    )
  }

  renderError = (status: number, refetch: () => void) => (
    <>
      <CustomTitleBar>
        <Responsive mobile>
          <TitleBarBackButton
            to={this.props.backTo}
            data-e2e="marketplace-show-back"
          />
        </Responsive>
      </CustomTitleBar>
      {status === 404 ? (
        <NotFoundPage />
      ) : (
        <NetworkError refetch={refetch} compact={false} />
      )}
    </>
  )

  render() {
    const { thingId } = this.props

    return (
      <HorizontalRouterMicroapp>
        <DataProvider
          request={{
            method: 'GET',
            path: `api/v1/things/${thingId}`,
          }}
        >
          {({ isDone, result, refetch }: IData) => {
            return !isDone
              ? this.renderLoading()
              : result.status.code === 200
              ? this.renderThing(result.entity, refetch)
              : this.renderError(result.status.code, refetch)
          }}
        </DataProvider>
      </HorizontalRouterMicroapp>
    )
  }
}

export default connect((state: IReduxState, props: IProps & IMatchParams) => ({
  // Cannot be named accessToken or it conflicts with withRequest() and is set to undefined
  currentAccessToken: state.authentication.accessToken,
  embeddedLayout: state.app.embeddedLayout,
  viewerId: state.authentication.user.id,
  ...urlParamsToProps(props, [['id', 'thingId']]),
}))(withRequest(injectIntl(ShowThing)))
