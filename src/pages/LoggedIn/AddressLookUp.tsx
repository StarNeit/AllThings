import { gql } from 'apollo-boost'
import AddressTypeahead from 'components/SignUp/AddressTypeahead'
import { css } from 'glamor'
import debounce from 'lodash/debounce'
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router'
import { ColorPalette } from '@allthings/colors'
import { ChevronRightListItem, Spinner, View } from '@allthings/elements'
import AddressNotFound from './AddressNotFound'
import RegistrationScreensTemplate from './RegistrationScreensTemplate'
import withMixpanel, { IInjectedMixpanelProps } from 'containers/withMixpanel'
import RequestSent from './RequestSent'

const messages = defineMessages({
  addressPlaceholder: {
    id: 'request-code.address-placeholder',
    description: 'Placeholder for the address field',
    defaultMessage: 'Enter your address',
  },
  cancelButton: {
    id: 'check-in.try-a-code',
    description: 'Label of the button going back to code page',
    defaultMessage: 'I have a code',
  },
  insertAddress: {
    id: 'request-code.enter-address',
    description: 'The label for address look up input field',
    defaultMessage: 'Enter your address',
  },
  requestAccess: {
    id: 'request-code.submit-button',
    description: 'Button label for the submit button',
    defaultMessage: 'Request Access',
  },
  subHeader: {
    id: 'request-code.subheader',
    description: 'Subheader for typeahead',
    defaultMessage:
      'Please give us your address and we will look it up for you.',
  },
})

const styles = {
  multipleAddressWrapper: css({
    marginTop: '20px',
    border: `1px solid ${ColorPalette.greyIntense}`,
  }),
  wrapper: css({ width: '100%' }),
}

enum Screen {
  AddressLookUp = 'AddressLookUp',
  AddressNotFound = 'AddressNotFound',
  MultipleAddress = 'MultipleAddress',
  RequestSent = 'RequestSent',
}

interface IState {
  address: string
  loading: boolean
  multipleAddress: ReadonlyArray<{ id: string; link: string; name: string }>
  placeId: string
  predictions: ReadonlyArray<{ label: string; value: string }>
  screen: Screen
  selectedAddress: string
}

type Props = ReturnType<typeof mapStateToProps>

class AddressLookUp extends React.PureComponent<
  WithApolloClient<
    Props &
      RouteComponentProps &
      DispatchProp &
      InjectedIntlProps &
      IInjectedMixpanelProps
  >,
  IState
> {
  state: IState = {
    address: '',
    loading: false,
    multipleAddress: [],
    placeId: '',
    predictions: [],
    screen:
      (this.props.location.state &&
        this.props.location.state.screen &&
        Screen[this.props.location.state.screen as keyof typeof Screen]) ||
      Screen.AddressLookUp,
    selectedAddress: '',
  }

  componentDidMount() {
    this.props.mixpanel('cir.address.viewed')
  }

  getPredictions = async (userInput: string) => {
    const { data } = await this.props.client.query({
      query: gql`
        query($userInput: String!) {
          placePredictions(userInput: $userInput) {
            placeId
            description
          }
        }
      `,
      variables: { userInput },
    })

    const predictions = !!data.placePredictions
      ? data.placePredictions.map(
          ({
            description,
            placeId,
          }: {
            description: string
            placeId: string
          }) => ({
            label: description,
            value: placeId,
          }),
        )
      : []

    this.setState({ predictions })
  }

  debounceInputChange = debounce(this.getPredictions, 500)

  handleAddressChange = (address: string) => {
    this.setState({ address })
    this.debounceInputChange(address)
  }

  onClearSelection = () => {
    this.setState({ selectedAddress: '', address: '' })
  }

  handleAddressSelect = (selection: { label: string; value: string }) => {
    // selection will be null when the address is cleared
    if (selection) {
      const address = selection ? selection.label : this.state.address
      const placeId = selection.value
      this.props.mixpanel('cir.address.selected', {
        address_string: address,
        google_places_id: placeId,
      })
      this.setState({
        address,
        selectedAddress: selection ? selection.value : '',
        placeId,
      })
    }
  }

  findNearestGroup = async ({
    latitude,
    longitude,
  }: {
    latitude: string
    longitude: string
  }) => {
    const { data } = await this.props.client.query({
      query: gql`
        query($filter: GroupsFilter) {
          groups(filter: $filter) {
            nodes {
              address {
                city
                houseNumber
                postalCode
                street
              }
              id
            }
          }
        }
      `,
      variables: {
        filter: {
          nearby: {
            latitude,
            longitude,
            maxDistance: 300,
            minDistance: 0,
          },
        },
      },
    })

    this.setState({ loading: false })

    return data.groups.nodes
  }

  submitCheckInRequest = async (addresses: readonly string[]) => {
    const { client, userId } = this.props
    this.setState({ loading: true })
    const result = await client.mutate({
      mutation: gql`
        mutation CreateCheckInRequest($groupIds: [ID!]!, $userId: ID!) {
          createCheckinRequest(groupIds: $groupIds, userId: $userId) {
            id
          }
        }
      `,
      variables: { groupIds: [...addresses], userId },
    })

    if (result.data.createCheckinRequest.id) {
      this.props.mixpanel('cir.success.viewed', {
        address_string: this.state.address,
        cir_id: result.data.createCheckinRequest.id,
        google_place_id: this.state.placeId,
      })
      this.setState({ screen: Screen.RequestSent, loading: false })
    }
  }

  checkForDuplicateAddresses = (
    addresses: ReadonlyArray<{
      address: {
        city: string
        houseNumber: string
        postalCode: string
        street: string
      }
      id: string
    }>,
  ) => {
    const multipleAddress = addresses.reduce(
      (uniqueAddresses, { address, id }) => {
        const { city, houseNumber, postalCode, street } = address
        const addressAsString = `${street} ${houseNumber}, ${city} ${postalCode}`
        const duplicateAddressIndex = uniqueAddresses.findIndex(
          ({ address: fullAddress }) => fullAddress === addressAsString,
        )
        const isUnique = !(duplicateAddressIndex > -1)

        isUnique
          ? uniqueAddresses.push({ address: addressAsString, id: [id] })
          : uniqueAddresses[duplicateAddressIndex].id.push(id)

        return uniqueAddresses
      },
      [],
    )

    if (multipleAddress.length > 1) {
      const groupIds = multipleAddress.reduce(
        (allAddressIds, address) => [...allAddressIds, ...address.id],
        [],
      )

      this.props.mixpanel('cir.address.multiple', {
        address_string: this.state.address,
        google_place_id: this.state.placeId,
        group_ids: groupIds,
      })
    }

    this.setState({ multipleAddress, screen: Screen.MultipleAddress })
  }

  handleSubmit = async () => {
    this.setState({ loading: true })
    const { client } = this.props
    const result = await client.query({
      query: gql`
        query GeoCoordinates($id: ID!) {
          placeCoordinate(id: $id) {
            latitude
            longitude
          }
        }
      `,
      variables: { id: this.state.selectedAddress },
    })

    const nearByGroups = await this.findNearestGroup(
      result.data.placeCoordinate,
    )

    nearByGroups.length === 0
      ? this.setState({ screen: Screen.AddressNotFound })
      : nearByGroups.length > 1
      ? this.checkForDuplicateAddresses(nearByGroups)
      : this.submitCheckInRequest([nearByGroups[0].id])
  }

  renderAddressSelection = () =>
    this.state.multipleAddress.map(({ address, id }: any, index) => {
      const handleClick = () => this.submitCheckInRequest(id as any)

      return (
        <View {...styles.wrapper}>
          <ChevronRightListItem
            data-e2e={`multiple-address-${index}`}
            key={id}
            onClick={handleClick}
          >
            {address}
          </ChevronRightListItem>
        </View>
      )
    })

  handleCancelLink = () =>
    this.props.history.push('/check-in', {
      preventRedirect: true,
    })

  renderAddressLookUp = () => {
    const {
      address,
      loading,
      predictions,
      screen,
      selectedAddress,
    } = this.state
    const { formatMessage } = this.props.intl
    const showMultipleAddressScreen = screen === Screen.MultipleAddress
    const button = loading ? (
      <Spinner />
    ) : !showMultipleAddressScreen ? (
      formatMessage(messages.requestAccess)
    ) : null
    const buttonIsDisabled = loading || !selectedAddress

    return (
      <RegistrationScreensTemplate
        button={button}
        buttonDisable={buttonIsDisabled}
        cancel={formatMessage(messages.cancelButton)}
        content={
          showMultipleAddressScreen ? (
            !this.state.loading && (
              <View {...styles.multipleAddressWrapper}>
                {this.renderAddressSelection()}
              </View>
            )
          ) : (
            <AddressTypeahead
              address={address}
              onAddressChange={this.handleAddressChange}
              onAddressSelect={this.handleAddressSelect}
              onClearSelection={this.onClearSelection}
              predictions={predictions}
              placeholder={formatMessage(messages.addressPlaceholder)}
            />
          )
        }
        onButtonClick={this.handleSubmit}
        onCancelTextClick={this.handleCancelLink}
        header={formatMessage(messages.insertAddress)}
        subHeader={formatMessage(messages.subHeader)}
      />
    )
  }

  handleButtonClick = () => this.setState({ screen: Screen.AddressLookUp })

  renderContent = () => {
    const { screen } = this.state
    const { formatMessage } = this.props.intl
    const content =
      screen === Screen.AddressNotFound ? (
        <AddressNotFound
          address={this.state.address}
          onButtonClick={this.handleButtonClick}
          placeId={this.state.placeId}
        />
      ) : screen === Screen.RequestSent ? (
        <RequestSent
          formatMessage={formatMessage}
          onButtonClick={this.handleButtonClick}
        />
      ) : (
        this.renderAddressLookUp()
      )

    return content
  }

  render() {
    return (
      <>
        {this.props.hasActivePeriod && <Redirect to="/" />}
        {this.renderContent()}
      </>
    )
  }
}

const mapStateToProps = ({ authentication }: IReduxState) => ({
  accessToken: authentication.accessToken,
  hasActivePeriod: !(
    Object.keys(authentication.user.activePeriod).length === 0
  ),
  userId: authentication.user.id,
  isCheckedIn: authentication.isCheckedIn,
})

export default connect(mapStateToProps)(
  withMixpanel(withApollo(withRouter(injectIntl(AddressLookUp)))),
)
