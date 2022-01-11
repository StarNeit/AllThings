import { ColorPalette } from '@allthings/colors'
import {
  Dropdown,
  FloatingButton,
  Form,
  Input,
  Inset,
  ListSpinner,
  PhoneInput,
  SimpleLayout,
  SquareIconButton,
  Text,
  View,
} from '@allthings/elements'
import Link from 'components/Link'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { CustomTitleBar } from 'components/TitleBar'
import { push } from 'connected-react-router'
import withMixpanel from 'containers/withMixpanel'
import { css } from 'glamor'
import sortBy from 'lodash-es/sortBy'
import React, { FormEvent, ReactNode } from 'react'
import { Gateway } from 'react-gateway'
import { defineMessages, injectIntl, MessageDescriptor } from 'react-intl'
import { connect } from 'react-redux'
import ServiceCenterActions, { uploadFile } from 'store/actions/serviceCenter'
import withRequest, { IWithRequest } from 'containers/withRequest'
import FileChooserList from 'components/FileChooserList'
import FileChooser from 'components/FileChooser'
import { DropHandler } from 'utils/filePreviews'
import { IDropdownItem } from '@allthings/elements/Dropdown'
import { ICategory } from 'microapps/craftspeople/Craftspeople'

enum FormElements {
  address = 'address',
  category = 'category',
  description = 'description',
  phoneNumber = 'phoneNumber',
  title = 'title',
}

const TITLE_MAX_LENGTH = 250 // char
const PROFILE_PLACEHOLDER = 'PROFILE_PLACEHOLDER'

const messages = defineMessages({
  closeOverlay: {
    id: 'service-center-create-overlay.close-overlay',
    description:
      'The label of the close button of the create overlay of pinboard.',
    defaultMessage: 'Cancel',
  },
  craftspersonInCharge: {
    id: 'service-center-create-overlay.third-party-craftsperson-text',
    description: 'placeholder for craftsperson in charge text',
    defaultMessage: 'the craftsperson in charge',
  },
  createPost: {
    id: 'service-center-create-overlay.create-post',
    description:
      'The label of the send button in the create overlay of pinboard.',
    defaultMessage: 'Send',
  },
  descriptionPlaceholder: {
    id: 'service-center-create-overlay.description-placeholder',
    description: 'The placeholder of the description text of the enquiry',
    defaultMessage: 'Describe your request',
  },
  'key-loss': {
    id: 'service-center-create-overlay.keyloss-enquiry-placeholder',
    description: 'The placeholder of the keyloss enquiry',
    defaultMessage:
      'Please write us the locking-system-id/key-id and the number of required keys',
  },
  defects: {
    id: 'service-center-create-overlay.damage-report-placeholder',
    description: 'The placeholder of the damage report',
    defaultMessage:
      'If you want to report us a device damage, please write us the product type, brand, model name and if possible the model number',
  },
  titleText: {
    id: 'service-center-create-overlay.title-text',
    description: 'The title text in the create overlay of the service center.',
    defaultMessage: 'New service enquiry',
  },
  fillYourPhone: {
    id: 'service-center-create-overlay.fill-your-phone-1',
    description: 'phone number',
    defaultMessage: 'phone number',
  },
  thirdPartyShareInfo: {
    id: 'service-center-create-overlay.third-party-disclaimer',
    description: 'Text informing users a third party will see some data',
    defaultMessage:
      '* Your inquiry and contact information will be forwarded to {craftsperson}. This includes your email address which is {email}. You can change your email address in your {profilePlaceholder}.',
  },
  thirdPartyProfileText: {
    id: 'service-center-create-overlay.third-party-profile-text',
    description: 'link to go to profile',
    defaultMessage: 'profile',
  },
  ticketTitle: {
    id: 'service-center-create-overlay.ticket-title',
    description: 'Title of the ticket',
    defaultMessage: 'Title of the ticket',
  },
  chooseCategoryLabel: {
    defaultMessage: 'Choose the category of your enquiry',
    description: 'The text if no enquiry category was chosen yet.',
    id: 'service-center-create-overlay.enquiry-category',
  },
  chooseAddressLabel: {
    defaultMessage: 'Choose from your addresses',
    description: 'The text if no enquiry address was chosen yet.',
    id: 'service-center-create-overlay.enquiry-address',
  },
})

const Wrap = (props: { children: ReactNode }) => (
  <View
    {...css({ backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8' })}
    {...props}
  />
)

interface IOverlayData {
  addressId: string
  category: ICategory
  craftsperson: string
}

interface IProps {
  mixpanel: (eventName: string, trackInformation?: object) => void
  readonly onRequestClose: () => void
  readonly overlayData?: IOverlayData
}

interface IState {
  readonly thirdPartyData: boolean
  readonly submitInProgress: boolean
  readonly uploadedFiles: readonly IFile[]
  readonly isUploadingFiles: boolean
  readonly descriptionLabel: MessageDescriptor
}

type Props = IProps &
  IWithRequest &
  ReturnType<typeof mapStateToProps> &
  DispatchProp &
  InjectedIntlProps

class ServiceCenterCreateOverlay extends React.PureComponent<Props, IState> {
  getDescriptionMessage = (key?: string): MessageDescriptor =>
    key in messages
      ? messages[key]
      : [
          'report',
          'defective-missing-appliance',
          'general-defect',
          'defects',
        ].includes(key)
      ? messages.defects
      : messages.descriptionPlaceholder

  state: IState = {
    thirdPartyData: false,
    uploadedFiles: [],
    isUploadingFiles: false,
    submitInProgress: false,
    descriptionLabel: this.getDescriptionMessage(
      this.props.overlayData?.category?.key,
    ),
  }

  static defaultProps = {
    overlayData: {} as IOverlayData,
  }

  async componentDidMount() {
    await this.props.dispatch(ServiceCenterActions.fetchTicketCategories())
  }

  renderThirdPartyData = () => {
    const {
      email,
      intl: { formatMessage },
      overlayData,
    } = this.props
    const craftsperson =
      overlayData && overlayData.craftsperson
        ? overlayData.craftsperson
        : formatMessage(messages.craftspersonInCharge)
    const thirdPartyText = formatMessage(messages.thirdPartyShareInfo, {
      craftsperson,
      email,
      profilePlaceholder: PROFILE_PLACEHOLDER,
    }).split(PROFILE_PLACEHOLDER)

    return (
      <Text
        color={ColorPalette.text.secondary}
        data-e2e="third-party-disclaimer-text"
        size="s"
        {...css({
          padding: 20,
          cursor: 'default',
          // opacity: this.state.thirdPartyData ? 1 : 0,
          transition: '250ms',
        })}
      >
        {thirdPartyText[0]}
        <Link to="/settings">
          {formatMessage(messages.thirdPartyProfileText)}
        </Link>
        {thirdPartyText[1]}
      </Text>
    )
  }

  renderOverlayTitleBar = () => {
    const {
      intl: { formatMessage },
      onRequestClose,
      theme,
    } = this.props

    return (
      <CustomTitleBar color={theme} alignH="space-between" alignV="center">
        <Inset horizontal data-e2e="cancel-overlay-title">
          <Text strong>{formatMessage(messages.titleText)}</Text>
        </Inset>
        <SquareIconButton
          icon="remove-light-filled"
          iconSize={14}
          data-e2e="cancel-overlay"
          onClick={onRequestClose}
        />
      </CustomTitleBar>
    )
  }

  handleChooseFiles: DropHandler = async acceptedFiles => {
    this.setState({ isUploadingFiles: true })
    const fileUploads = await Promise.all(
      acceptedFiles.map(file =>
        uploadFile<IFile>(this.props.createRequest, file),
      ),
    )
    const newUploadedFiles = fileUploads
      .map(request => request.entity)
      // Filter out the failed uploads.
      .filter(Boolean)

    const uploadedFiles = this.state.uploadedFiles.concat(newUploadedFiles)

    this.setState({
      uploadedFiles,
      isUploadingFiles: false,
    })
  }

  handleRemoveFile = async (file: IFile) => {
    this.setState(prevState => ({
      uploadedFiles: prevState.uploadedFiles.filter(
        uploadedFile => uploadedFile.id !== file.id,
      ),
    }))
    await this.props.createRequest({
      method: 'DELETE',
      path: `api/v1/files/${file.id}`,
    })
  }

  handleChooseCategory = (item: IDropdownItem) => {
    const { thirdPartyData, key } = this.props.categories.find(
      category => category.id === item.value,
    )
    const descriptionLabel = this.getDescriptionMessage(key)

    this.setState({ thirdPartyData, descriptionLabel })
  }

  handleSubmit = async (_: FormEvent, data: object) => {
    const {
      dispatch,
      utilisationPeriodId,
      createRequest,
      overlayData,
      onRequestClose,
    } = this.props

    const fileIds = this.state.uploadedFiles.map(file => file.id)

    const entity = {
      category: data[FormElements.category],
      description: data[FormElements.description],
      files: fileIds,
      inputChannel: overlayData?.craftsperson ? 'craftsmen' : 'app',
      phoneNumber: data[FormElements.phoneNumber],
      title: data[FormElements.title],
    }

    this.setState({ submitInProgress: true })
    const utilPeriodId = data[FormElements.address] || utilisationPeriodId
    const response = await createRequest<ITicket>({
      method: 'POST',
      path: `/api/v1/utilisation-periods/${utilPeriodId}/tickets`,
      entity,
    })

    const ticket = response.entity

    dispatch(ServiceCenterActions.addTicketToList(ticket))
    dispatch(push(`/service-center/ticket/${ticket.id}`))
    onRequestClose()
  }

  render() {
    const { submitInProgress } = this.state
    const {
      locale,
      categories,
      addresses,
      phoneNumber,
      overlayData,
      isLoadingCategories,
      intl: { formatMessage },
    } = this.props

    const sortedCategories = sortBy(categories, category =>
      category.name[locale].toLowerCase(),
    ).map(category => ({ label: category.name[locale], value: category.id }))

    const initialCategory = overlayData.category
      ? sortedCategories.find(cat => cat.value === overlayData.category.id)
      : undefined

    const sortedAddresses = sortBy(addresses, address =>
      address.key.toLowerCase(),
    ).map(address => ({ label: address.key, value: address.id }))

    const initialAddress = overlayData.addressId
      ? sortedAddresses.find(address => address.value === overlayData.addressId)
      : undefined

    return (
      <Gateway into="root">
        <Overlay
          theme={{ primary: this.props.theme }}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.props.onRequestClose}
          {...css({
            '& form': {
              height: '100%',
              overflow: 'auto',
            },
          })}
        >
          <OverlayWindow>
            {this.renderOverlayTitleBar()}
            <Form onSubmit={this.handleSubmit}>
              <FileChooser
                onChoose={this.handleChooseFiles}
                multiple
                accept="image/jpeg,image/png"
                style={{
                  height: 'calc(100% - 50px)',
                  overflow: 'auto',
                }}
              >
                {openFileDialog => (
                  <SimpleLayout>
                    {!isLoadingCategories && (
                      <Wrap data-e2e="category-wrapper">
                        <Dropdown
                          label={formatMessage(messages.chooseCategoryLabel)}
                          placeholder={formatMessage(
                            messages.chooseCategoryLabel,
                          )}
                          initialSelectedItem={initialCategory}
                          name={FormElements.category}
                          items={sortedCategories}
                          disabled={!!overlayData.category}
                          menuHeight={250}
                          onSelect={this.handleChooseCategory}
                          data-e2e="service-center-overlay-choose-category"
                          data-e2e-disabled={!!overlayData.category}
                          required
                        />
                      </Wrap>
                    )}
                    {sortedAddresses.length > 1 && (
                      <Wrap data-e2e="address-wrapper">
                        <Dropdown
                          label={formatMessage(messages.chooseAddressLabel)}
                          placeholder={formatMessage(
                            messages.chooseAddressLabel,
                          )}
                          initialSelectedItem={initialAddress}
                          disabled={!!overlayData.addressId}
                          name={FormElements.address}
                          items={sortedAddresses}
                          menuHeight={250}
                          data-e2e="service-center-overlay-choose-address"
                          data-e2e-disabled={!!overlayData.addressId}
                          required
                        />
                      </Wrap>
                    )}
                    <Wrap>
                      <Input
                        type="text"
                        data-e2e="service-center-overlay-title"
                        maxLength={TITLE_MAX_LENGTH}
                        name={FormElements.title}
                        placeholder={formatMessage(messages.ticketTitle)}
                        label={formatMessage(messages.ticketTitle)}
                        required
                      />
                    </Wrap>
                    <Wrap>
                      <Input
                        type="text"
                        name={FormElements.description}
                        data-e2e="service-center-overlay-description"
                        placeholder={formatMessage(this.state.descriptionLabel)}
                        label={formatMessage(this.state.descriptionLabel)}
                        lines={5}
                        required
                      />
                    </Wrap>
                    <Wrap>
                      <PhoneInput
                        name={FormElements.phoneNumber}
                        placeholder={formatMessage(messages.fillYourPhone)}
                        label={formatMessage(messages.fillYourPhone)}
                        value={phoneNumber}
                        data-e2e="service-center-overlay-phonenumber"
                        required
                      />
                    </Wrap>

                    <FileChooserList
                      isUploading={this.state.isUploadingFiles}
                      onClickAdd={openFileDialog}
                      files={this.state.uploadedFiles}
                      onRemoveFile={this.handleRemoveFile}
                    />

                    {(this.state.thirdPartyData ||
                      overlayData?.category?.thirdPartyData) &&
                      this.renderThirdPartyData()}
                  </SimpleLayout>
                )}
              </FileChooser>
              <FloatingButton
                data-e2e="service-center-overlay-send"
                type="submit"
                disabled={submitInProgress}
              >
                {submitInProgress ? (
                  <ListSpinner />
                ) : (
                  <Text strong color="white">
                    {formatMessage(messages.createPost)}
                  </Text>
                )}
              </FloatingButton>
            </Form>
          </OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = ({
  app,
  authentication,
  serviceCenter,
  theme,
}: IReduxState) => ({
  addresses: authentication.user.addresses,
  categories: serviceCenter.categories.items,
  isLoadingCategories: serviceCenter.categories.loading,
  email: authentication.user.email,
  locale: app.locale,
  phoneNumber: authentication.user.phoneNumber,
  theme: theme.microApps.helpdesk,
  utilisationPeriodId: authentication.user.activePeriod.id,
})

export default connect(mapStateToProps)(
  withMixpanel(injectIntl(withRequest<Props>(ServiceCenterCreateOverlay))),
)
