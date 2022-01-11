import {
  ChevronRightListItem,
  GroupedCardList,
  HorizontalView,
  SimpleLayout,
} from '@allthings/elements'
import Microapp from 'components/Microapp'
import withMixpanel from 'containers/withMixpanel'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { MicroApps } from 'enums'
import { css } from 'glamor'
import React from 'react'
import { connect } from 'react-redux'
import { IAddress } from 'store/reducers/authentication'
import CraftspeopleList from './CraftspeopleList'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { Locale } from '../../enums'

interface IProps {
  readonly addresses: IAddress[]
  readonly locale: string
  readonly introText?: IndexSignature<string>
  readonly mixpanel: (eventName: string) => void
}

export interface ICategory {
  readonly description: Partial<Record<Locale, string>>
  readonly id: string
  readonly key: string
  readonly name: Partial<Record<Locale, string>>
  readonly thirdPartyData: boolean
  readonly vocabulary: string
}

interface ICraftspersonEmbedded {
  readonly externalAgentCompany?: {
    readonly _embedded?: {
      readonly logo?: string
    }
  }
}

export interface ICraftsperson {
  readonly _embedded: ICraftspersonEmbedded
  readonly categories: ICategory[]
  readonly companyAddress: {
    city: string
    houseNumber: string
    postalCode: string
    street: string
  }
  readonly companyId: string
  readonly companyName: string
  readonly companyPhoneNumber: string
  readonly id: string
  readonly phoneNumber: string
  readonly username: string
}

interface IState {
  readonly addressId: string
  readonly craftspeople: ICraftsperson[]
  readonly loading: boolean
}

class Craftspeople extends React.PureComponent<IProps & IWithRequest, IState> {
  state = {
    addressId: '',
    craftspeople: [] as ICraftsperson[],
    loading: true,
  }

  async componentDidMount() {
    const { addresses, mixpanel } = this.props

    mixpanel('craftsmen.overview.viewed')

    addresses.length === 1
      ? await this.updateAddressCraftspeople(addresses[0].id)
      : this.setState({ loading: false })
  }

  handleBack = () => this.setState({ addressId: '' })

  updateAddressCraftspeople = async (id: string) => {
    const { entity } = await this.props.createRequest({
      method: 'GET',
      path: `/api/v1/utilisation-periods/${id}/craftspeople`,
    })

    this.setState({
      addressId: id,
      craftspeople: entity._embedded.items,
      loading: false,
    })
  }

  renderAddressList = () =>
    this.props.addresses.map(({ id, key }) => (
      <ChevronRightListItem
        data-e2e={`${id}-craftspeople-address`}
        key={key}
        onClick={() => this.updateAddressCraftspeople(id)}
      >
        {key}
      </ChevronRightListItem>
    ))

  renderTitleBar = (onlyOneAddress: boolean) => {
    const { addressId } = this.state

    return (
      <>
        {onlyOneAddress || (!onlyOneAddress && !addressId) ? (
          <MicroappBigTitleBar type={MicroApps.CRAFTSPEOPLE} />
        ) : (
          <GenericBackTitleBar onBack={this.handleBack} />
        )}
      </>
    )
  }

  render() {
    const { addresses, locale, introText } = this.props
    const onlyOneAddress = addresses.length === 1
    const { addressId, craftspeople, loading } = this.state

    return (
      <Microapp>
        <SimpleLayout padded={'horizontal'}>
          {this.renderTitleBar(onlyOneAddress)}
          <HorizontalView {...css({ height: '100%' })}>
            {!onlyOneAddress && (
              <GroupedCardList title="">
                {this.renderAddressList()}
              </GroupedCardList>
            )}
            {(addressId || onlyOneAddress) && (
              <CraftspeopleList
                addressId={addressId}
                craftspeople={craftspeople}
                introText={introText}
                loading={loading}
                locale={locale}
              />
            )}
          </HorizontalView>
        </SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = ({ authentication: { user }, app }: IReduxState) => ({
  addresses: user.addresses,
  introText: app.microApps.find(
    microApp => microApp.type === MicroApps.CRAFTSPEOPLE,
  )?.introText,
  locale: user.locale,
})

export default connect(
  mapStateToProps,
  null,
)(withRequest(withMixpanel(Craftspeople)))
