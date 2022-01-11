import React from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import {
  View,
  Form,
  TextInput,
  SquareIconButton,
  Inset,
  Text,
  FloatingButton,
  SimpleLayout,
  ListSpinner,
  Icon,
} from '@allthings/elements'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { Gateway } from 'react-gateway'
import { withTheme } from 'utils/withTheme'
import FileChooser from 'components/FileChooser'
import RemovableImage from 'components/RemovableImage'
import { css } from 'glamor'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { CustomTitleBar } from 'components/TitleBar'
import DataProvider, { IData } from 'containers/DataProvider'
import uploadFile from 'utils/uploadFile'
import { push } from 'connected-react-router'
import get from 'lodash-es/get'

import { IThing } from '..'
import { enhanceWithPreviews, FileWithPreview } from 'utils/filePreviews'
import { FileWithPath } from 'react-dropzone'

const messages = defineMessages({
  contactInputPlaceholder: {
    id: 'marketplace-thing-create.contact-input-placeholder',
    description:
      'The placeholder for the phone number input of the create overlay of marketplace.',
    defaultMessage: 'Contact data',
  },
  closeOverlay: {
    id: 'marketplace-thing-create.close-overlay',
    description:
      'The label of the close button of the create overlay of marketplace.',
    defaultMessage: 'Abort',
  },
  createPost: {
    id: 'marketplace-thing-create.create-thing',
    description:
      'The label of the send button in the create overlay of pinboard.',
    defaultMessage: 'Send',
  },
  deleteButton: {
    id: 'marketplace-thing-create.delete-button',
    description:
      'The label of the delete button of the create overlay of marketplace.',
    defaultMessage: 'Delete',
  },
  descriptionInputPlaceholder: {
    id: 'marketplace-thing-create.name-description-placeholder',
    description:
      'The placeholder for the description input of the create overlay of marketplace.',
    defaultMessage: 'Description',
  },
  doneButton: {
    id: 'marketplace-thing-create.done-button',
    description:
      'The label of the done button of the create overlay of marketplace.',
    defaultMessage: 'Done',
  },
  nameInputPlaceholder: {
    id: 'marketplace-thing-create.name-input-placeholder',
    description:
      'The placeholder for the name input of the create overlay of marketplace.',
    defaultMessage: 'Name',
  },
  nameInputError: {
    id: 'marketplace-thing-create.name-input-error',
    description:
      'The error message for the name input of the create overlay of marketplace.',
    defaultMessage: 'Name is mandatory',
  },
  descriptionInputError: {
    id: 'marketplace-thing-create.description-input-error',
    description:
      'The error message for the description of the create overlay of marketplace.',
    defaultMessage: 'Please describe it with less than 255 letters',
  },
  priceInputPlaceholder: {
    id: 'marketplace-thing-create.price-input-placeholder',
    description:
      'The placeholder for the price input of the create overlay of marketplace.',
    defaultMessage: 'Price',
  },
  freePriceInputPlaceholder: {
    id: 'marketplace-thing-create.free-price-input-placeholder',
    description:
      "The placeholder for the price input if the user enters 0 or no-price (it's free)",
    defaultMessage: 'Price - For free, so kind of you 👋',
  },
  priceInputError: {
    id: 'marketplace-thing-create.price-input-error',
    description:
      'The error message for the price input of the create overlay of marketplace.',
    defaultMessage: 'Price is mandatory',
  },
  titleBarCreate: {
    id: 'marketplace-thing-create.titlebar-create',
    description: 'The title bar in the create overlay of marketplace.',
    defaultMessage: 'New product',
  },
  titleBarEdit: {
    id: 'marketplace-thing-create.titlebar-edit',
    description: 'The title bar in the edit overlay of marketplace.',
    defaultMessage: 'Edit product',
  },
})

interface IProps {
  appId: string
  theme: any
  thingId?: string
  type: string
  onChange?: (thing: Thing) => void
  creatorId: string
  onRequestClose: () => void
  pushToThing?: boolean
}

interface IState {
  filesToAdd: readonly FileWithPreview[]
  displayFiles: boolean
  isEditing: boolean
  submitInProgress: boolean
  hasError: boolean
  saving: boolean
  filesMarkedToRemove: ReadonlyArray<any>
  isFree: boolean
}

interface IFormData {
  contact: string
  description: string
  name: string
  price: string
}

class ThingOverlay extends React.PureComponent<
  IProps & InjectedIntlProps & IWithRequest,
  IState
> {
  state: IState = {
    filesToAdd: [],
    filesMarkedToRemove: [],
    displayFiles: false,
    saving: false,
    isEditing: false,
    submitInProgress: false,
    hasError: false,
    isFree: false,
  }

  handleSubmit = async (
    { files = [] }: { files: readonly IFile[] },
    { contact, description, name, price }: IFormData,
  ) => {
    this.setState({ saving: true })
    try {
      const { appId, createRequest, creatorId, type, thingId } = this.props
      const { filesMarkedToRemove, filesToAdd } = this.state
      const upload = await Promise.all(
        filesToAdd.map((file: any) =>
          uploadFile(file.name, file, createRequest),
        ),
      )
      await Promise.all(
        filesMarkedToRemove.map(async fileId => {
          return await createRequest({
            method: 'DELETE',
            path: `api/v1/files/${fileId}`,
          })
        }),
      )
      const response = await createRequest({
        method: thingId ? 'PATCH' : 'POST',
        path: thingId
          ? `api/v1/things/${thingId}`
          : `api/v1/users/${creatorId}/things`,
        entity: {
          appId,
          properties: [
            { key: 'contact', type: 'string', value: contact },
            { key: 'price', type: 'string', value: price },
          ],
          description,
          name,
          files: files
            // remove files that are marked to remove
            .filter(file => filesMarkedToRemove.indexOf(file) === -1)
            // add new files that got uploaded
            .concat(upload.map((uploaded: any) => uploaded.entity.id)),
          public: true,
          status: type,
        },
      })

      if (response.status.code >= 200 && response.status.code < 400) {
        this.props.onChange(response.entity)
      } else {
        throw new Error('Saving the thing failed')
      }
    } catch (e) {
      this.setState({
        hasError: true,
      })
    }

    this.setState({ saving: false })
  }

  renderBar = ({ isEditing }: { readonly isEditing: boolean }) => {
    const { intl } = this.props

    return (
      <CustomTitleBar alignH="space-between">
        <Inset horizontal data-e2e="marketplace-overlay-title">
          <Text strong>
            {intl.formatMessage(
              messages[`titleBar${isEditing ? 'Edit' : 'Create'}`],
            )}
          </Text>
        </Inset>
        <SquareIconButton
          icon="remove-light-filled"
          iconSize="xs"
          data-e2e="cancel-thing-overlay"
          onClick={this.props.onRequestClose}
        />
      </CustomTitleBar>
    )
  }

  renderContent = (defaults = {}) => (
    <SimpleLayout>
      {this.renderBar({ isEditing: false })}
      {this.renderPanel({ defaults })}
    </SimpleLayout>
  )

  handleChoose = (files: readonly FileWithPath[]) => {
    this.setState(state => ({
      filesToAdd: state.filesToAdd.concat(enhanceWithPreviews(files)),
    }))
  }

  removeExistingFile = (fileId: number) => {
    this.setState(({ filesMarkedToRemove }) => ({
      filesMarkedToRemove: filesMarkedToRemove.concat(fileId),
    }))
  }

  removeFile = (index: number) =>
    this.setState(({ filesToAdd }) => ({
      filesToAdd: filesToAdd.filter((_, i) => i !== index),
    }))

  // @todo: Pull this into @allthings/elements
  renderFiles = (openFileDialog: OnClick, files: ReadonlyArray<IFile>) => {
    const GUTTER = 3
    const ITEM_SIZE = 95

    return (
      <View
        {...css({ background: '#fff', margin: `0 -${GUTTER}px`, padding: 15 })}
        direction="row"
        wrap="wrap"
      >
        <View
          direction="row"
          alignV="center"
          alignH="center"
          onClick={openFileDialog}
          {...css({
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            border: `2px dashed ${ColorPalette.lightGreyIntense}`,
            borderRadius: 2,
            margin: GUTTER,
          })}
        >
          <Icon
            name="picture-add-filled"
            color={ColorPalette.lightGreyIntense}
            size={ITEM_SIZE / 2}
          />
        </View>
        {files
          .filter(
            file => this.state.filesMarkedToRemove.indexOf(file.id) === -1,
          )
          .map((file: any, index: number) => (
            <View {...css({ margin: GUTTER })} key={file.preview}>
              <RemovableImage
                image={file._embedded.files.thumb.url}
                id={file.id}
                size={ITEM_SIZE}
                data-e2e={`file-upload-delete-button-${index}`}
                onRemove={this.removeExistingFile}
              />
            </View>
          ))}
        {this.state.filesToAdd.map((file: any, index) => (
          <View {...css({ margin: GUTTER })} key={file.preview}>
            <RemovableImage
              image={file.preview}
              id={index}
              data-e2e={`file-upload-delete-button-${index}`}
              size={ITEM_SIZE}
              onRemove={this.removeFile}
            />
          </View>
        ))}
      </View>
    )
  }

  renderLoading = () => {
    return <p>...</p>
  }

  getPlaceholder = (name: string) =>
    this.props.intl.formatMessage(messages[`${name}InputPlaceholder`])

  renderPanel = ({ defaults }: any) => (
    <Form
      onSubmit={(_: any, data: IFormData) => this.handleSubmit(defaults, data)}
    >
      <TextInput
        autoFocus
        data-e2e="marketplace-overlay-name"
        name="name"
        maxLength={25}
        label={this.getPlaceholder('name')}
        placeholder={this.getPlaceholder('name')}
        defaultValue={defaults.name}
        required
      />
      <TextInput
        data-e2e="marketplace-overlay-description"
        name="description"
        placeholder={this.getPlaceholder('description')}
        label={this.getPlaceholder('description')}
        lines={4}
        defaultValue={defaults.description}
        required
      />
      <TextInput
        data-e2e="marketplace-overlay-price"
        name="price"
        maxLength={8}
        placeholder={this.getPlaceholder('price')}
        label={
          this.state.isFree
            ? this.getPlaceholder('freePrice')
            : this.getPlaceholder('price')
        }
        defaultValue={defaults.properties && defaults.properties.price}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          this.setState({
            isFree: Number(e.target.value) <= 0,
          })
        }
      />
      <TextInput
        data-e2e="marketplace-overlay-contact"
        minLength={3}
        name="contact"
        placeholder={this.getPlaceholder('contact')}
        label={this.getPlaceholder('contact')}
        defaultValue={defaults.properties && defaults.properties.contact}
      />

      <FileChooser
        onChoose={this.handleChoose}
        multiple
        accept="image/jpeg,image/png"
      >
        {(openFileDialog: OnClick) =>
          !this.state.isEditing &&
          this.renderFiles(openFileDialog, get(defaults, '_embedded.files', []))
        }
      </FileChooser>
      <FloatingButton
        data-e2e="marketplace-overlay-submit"
        type="submit"
        disabled={this.state.submitInProgress}
        {...css(this.state.saving ? { pointerEvents: 'none' } : null)}
      >
        {this.state.saving ? (
          <ListSpinner />
        ) : (
          <Text strong color="white">
            {this.props.intl.formatMessage(messages.doneButton)}
          </Text>
        )}
      </FloatingButton>
    </Form>
  )

  renderWithThing() {
    return (
      <DataProvider
        request={{
          method: 'GET',
          path: `api/v1/things/${this.props.thingId}`,
        }}
      >
        {({ isDone, result }: IData) =>
          isDone ? this.renderContent(result.entity) : <span>s</span>
        }
      </DataProvider>
    )
  }

  render() {
    return (
      <Gateway into="root">
        <Overlay
          theme={this.props.theme}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayWindow>
            {this.props.thingId ? this.renderWithThing() : this.renderContent()}
          </OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

const mapDispatchToProps = (
  dispatch: FunctionalDispatch,
  { onChange, pushToThing, type }: Partial<IProps>,
) => ({
  onChange: (thing: IThing) => {
    onChange && onChange(thing)
    if (pushToThing !== false) {
      dispatch(
        push(
          `/${type === 'for-sale' ? 'marketplace' : 'sharing'}/me/${thing.id}`,
        ),
      )
    }
  },
})

const mapStateToProps = (state: IReduxState) => ({
  appId: state.app.config.appID,
  creatorId: state.authentication.user.id,
})

export default withTheme()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withRequest(injectIntl(ThingOverlay))),
)
