import {
  GroupedCardList,
  Icon,
  ListItem,
  ListSpinner,
  SimpleLayout,
  Text,
  View,
} from '@allthings/elements'
import { IconType } from '@allthings/elements/Icon'
import OverlayToggle from 'components/OverlayToggle'
import withMixpanel from 'containers/withMixpanel'
import { css } from 'glamor'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import ServiceCenterCreateOverlay from '../serviceCenter/ServiceCenterCreateOverlay'
import { ICraftsperson } from './Craftspeople'
import { NoCraftspeopleHint } from './NoCraftspeopleHint'

const styles = {
  listItem: css({ justifyContent: 'center' }),
}

const ListItemIcon = ({ name }: { name: IconType }) => (
  <Icon
    color="secondaryText"
    name={name}
    size={16}
    {...css({ margin: '0 10px' })}
  />
)

type TMixpanelAction = 'phone' | 'ticket'

interface IProps {
  readonly addressId: string
  readonly craftspeople: ICraftsperson[]
  readonly introText?: IndexSignature<string>
  readonly loading: boolean
  readonly locale: string
  readonly mixpanel: (
    eventName: string,
    data: {
      action: TMixpanelAction
      service_provider_id: string
      service_provider_user_id: string
    },
  ) => void
}

const renderCraftsmenList = ({
  addressId,
  craftspeople,
  introText,
  loading,
  locale,
  mixpanel,
}: IProps) => {
  const craftspeopleCategories = craftspeople.reduce(
    (allCategories, { categories }) => [...allCategories, ...categories],
    [],
  )

  const sendMixpanelButtonClickedEvent = ({
    action,
    service_provider_id,
    service_provider_user_id,
  }: Parameters<IProps['mixpanel']>[1]) =>
    mixpanel('craftsmen.button.clicked', {
      action,
      service_provider_id,
      service_provider_user_id,
    })

  const noCraftspeopleToBeDisplayed =
    craftspeopleCategories.length === 0 || craftspeople.length === 0

  return loading ? (
    <ListSpinner />
  ) : noCraftspeopleToBeDisplayed ? (
    <NoCraftspeopleHint />
  ) : (
    <>
      {introText?.[locale] && (
        <ListItem>
          <Text autoBreak {...css({ maxWidth: '100%' })}>
            {introText[locale]}
          </Text>
        </ListItem>
      )}
      {craftspeople.map(
        ({
          categories,
          companyAddress,
          companyId,
          companyName,
          companyPhoneNumber,
          id,
          phoneNumber,
          username,
        }) =>
          categories.map(category => {
            const {
              city = '',
              houseNumber = '',
              postalCode = '',
              street = '',
            } = companyAddress

            return (
              <GroupedCardList key={id} title={category.name[locale]}>
                <ListItem {...css({ display: 'block', textAlign: 'center' })}>
                  {companyName && (
                    <Text data-e2e={`craftspeople-company-${companyName}`}>
                      {companyName}
                    </Text>
                  )}
                  {!companyName && username && (
                    <Text data-e2e={`craftspeople-username-${username}`}>
                      {username}
                    </Text>
                  )}
                  {(street || houseNumber) && (
                    <Text>{`${street} ${houseNumber}`}</Text>
                  )}
                  {(postalCode || city) && (
                    <Text>{`${postalCode} ${city}`}</Text>
                  )}
                </ListItem>
                {(companyPhoneNumber || phoneNumber) && (
                  <ListItem {...styles.listItem}>
                    <a
                      href={`tel:${companyPhoneNumber || phoneNumber}`}
                      onClick={() =>
                        sendMixpanelButtonClickedEvent({
                          action: 'phone',
                          service_provider_user_id: id,
                          ...(companyId && {
                            service_provider_id: companyId,
                          }),
                        })
                      }
                    >
                      <View direction="row">
                        <ListItemIcon name="phone" />
                        {companyPhoneNumber || phoneNumber}
                      </View>
                    </a>
                  </ListItem>
                )}
                <OverlayToggle
                  overlay={ServiceCenterCreateOverlay}
                  hashName="create"
                >
                  {({ open }) => (
                    <ListItem
                      data-e2e="craftspeople-send-request"
                      onClick={() => {
                        sendMixpanelButtonClickedEvent({
                          action: 'ticket',
                          service_provider_user_id: id,
                          ...(companyId && { service_provider_id: companyId }),
                        })
                        open({ addressId, category, craftsperson: username })
                      }}
                      {...styles.listItem}
                    >
                      <ListItemIcon name="email" />
                      <FormattedMessage
                        id="craftspeople.send-request"
                        description="Label of service center creation button"
                        defaultMessage="Send Request"
                      />
                    </ListItem>
                  )}
                </OverlayToggle>
              </GroupedCardList>
            )
          }),
      )}
    </>
  )
}

const CraftspeopleList = (props: IProps) => (
  <SimpleLayout>{renderCraftsmenList(props)}</SimpleLayout>
)

export default withMixpanel(CraftspeopleList)
