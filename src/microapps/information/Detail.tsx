import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import AndroidAttachIcon from '@allthings/react-ionicons/lib/AndroidAttachIcon'
import DocumentIcon from '@allthings/react-ionicons/lib/DocumentIcon'
import ImageIcon from '@allthings/react-ionicons/lib/ImageIcon'
import { css } from 'glamor'
import {
  View,
  Responsive,
  SimpleLayout,
  Card,
  CardContent,
} from '@allthings/elements'
import { AppTitle } from 'containers/App'
import { CustomTitleBar, TitleBarBackButton } from 'components/TitleBar'
import InformationActions from 'store/actions/information'
import Localized, { getLocalized } from 'containers/Localized'
import DetailSkeleton from './DetailSkeleton'
import { Text } from '@allthings/elements'
import Image from 'components/Image'
import formatBytes from 'utils/formatBytes'
import RichMediaHtmlContent from 'components/RichMediaHtmlContent'
import Link from 'components/Link'
import { RouteComponentProps } from 'react-router'
import OverlayToggle from 'components/OverlayToggle'
import ImageGalleryOverlay from 'components/ImageGalleryOverlay'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { push } from 'connected-react-router'

const iconStyle = { fill: ColorPalette.black, width: 32, height: 32 }

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    readonly returnTo?: string
  }

type RouterProps = RouteComponentProps<{ id: string }>

class Detail extends React.PureComponent<Props & DispatchProp & RouterProps> {
  componentDidMount() {
    this.props.doFetchArticle(this.props.match.params.id)
  }

  componentDidUpdate(prevProps: Props & RouterProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.doFetchArticle(this.props.match.params.id)
    }
  }

  renderOverlay = ({ toggle }: { toggle: OnClick }) => (
    <ImageGalleryOverlay onClose={toggle} images={this.props.images} />
  )

  renderAttachment = ({
    extension,
    files: {
      original: { url: fileUrl, size },
    },
    id,
    name,
  }: IFile) => {
    const icon =
      extension === 'png' ? (
        <ImageIcon style={iconStyle} />
      ) : extension === 'txt' ? (
        <DocumentIcon style={iconStyle} />
      ) : (
        <AndroidAttachIcon style={iconStyle} />
      )

    return (
      <li className="informationDetail-documents-list-item" key={id}>
        <Link
          to={fileUrl}
          key={name}
          name={name}
          setLastLocation
          target="_blank"
        >
          <View direction="row" alignV="start">
            <i style={{ margin: '0 10px' }}>{icon}</i>
            <div>
              <Text
                className="fileElement-title"
                size="l"
                style={{ display: 'block' }}
              >
                {name}
              </Text>
              <Text className="fileElement-data" size="s">
                {`${extension.toUpperCase()} · ${formatBytes(size)}`}
              </Text>
            </div>
          </View>
        </Link>
      </li>
    )
  }

  renderAttachments = ({ files }: { readonly files: ReadonlyArray<IFile> }) =>
    files.length > 0 && (
      <div className="informationDetail-documents">
        <h2 className="informationDetail-documents-title">
          <FormattedMessage
            id="information-detail.attatched-documents"
            description="Text for file attachments"
            defaultMessage="Attached documents:"
          />
        </h2>
        <ul
          className="informationDetail-documents-list"
          data-e2e="information-detail-attachment-list"
        >
          {files.map(this.renderAttachment)}
        </ul>
      </div>
    )

  renderContent = ({
    localized,
  }: {
    localized: {
      teaser: string
      content: string
    }
  }) => (
    <View
      direction="column"
      {...css({ overflowWrap: 'break-word', wordWrap: 'break-word' })}
    >
      <div
        {...css({
          fontStyle: 'italic',
          margin: 0,
        })}
      >
        <RichMediaHtmlContent html={localized.teaser} localAnchors />
      </div>
      <div>
        <RichMediaHtmlContent
          allowYoutube
          localAnchors
          html={localized.content}
        />
      </div>
    </View>
  )

  renderFirstImage = () => {
    const { images } = this.props
    if (images.length === 0) {
      return null
    }

    const image = this.props.images[0]
    const { name, files } = image
    const { url } = files.hasOwnProperty('small') ? files.small : files.medium

    return (
      <OverlayToggle renderOverlay={this.renderOverlay}>
        {({ open }) => (
          <View
            {...css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '230px',
              minHeight: '230px',
              overflow: 'hidden',
              ':hover': {
                cursor: 'pointer',
              },
            })}
          >
            <Image
              alt={name}
              data-e2e={`information-image-name-${name}`}
              onClick={open}
              src={url}
              {...css(
                this.props.article.headerImageResizingStrategy === 'fit'
                  ? {
                      width: 'auto !important',
                      height: 'auto !important',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }
                  : {
                      width: '100%',
                    },
              )}
            />
          </View>
        )}
      </OverlayToggle>
    )
  }

  renderArticle = () => {
    const {
      article,
      topic,
      locale,
      files,
      goBackToTopic,
      goToInformation,
    } = this.props

    return (
      <Localized messages={article._embedded.translations}>
        {localized => (
          <HorizontalRouterMicroapp>
            <Responsive mobile>
              <GenericBackTitleBar
                backText={getLocalized(topic.name, locale)}
                data-e2e="information-detail-back"
                data-e2e-back-key={topic.key}
                onBack={() =>
                  topic.key ? goBackToTopic(topic.key) : goToInformation()
                }
              />
            </Responsive>
            <SimpleLayout>
              {this.renderFirstImage()}
              <Card>
                <CardContent data-e2e="information-detail-text">
                  <AppTitle>{localized.title}</AppTitle>
                  <Text
                    strong
                    size="giant"
                    data-e2e="information-article-topic-title"
                  >
                    {localized.title}
                  </Text>
                  {this.renderContent({ localized })}
                  {this.renderAttachments({ files })}
                </CardContent>
              </Card>
            </SimpleLayout>
          </HorizontalRouterMicroapp>
        )}
      </Localized>
    )
  }

  renderLoading = () => (
    <HorizontalRouterMicroapp>
      <CustomTitleBar>
        <Responsive mobile>
          <TitleBarBackButton />
        </Responsive>
      </CustomTitleBar>
      <SimpleLayout>
        <Card>
          <CardContent>
            <DetailSkeleton />
          </CardContent>
        </Card>
      </SimpleLayout>
    </HorizontalRouterMicroapp>
  )

  renderError = () => (
    <HorizontalRouterMicroapp>
      <GenericBackTitleBar onBack={this.props.goToInformation} />
      <SimpleLayout>
        <View flex="flex" alignH="center" alignV="center" direction="column">
          <FormattedMessage
            id="information-article.article-not-found"
            description="This message is displayed if there the article is not found."
            defaultMessage="We're sorry, this article could not be found."
          />
        </View>
      </SimpleLayout>
    </HorizontalRouterMicroapp>
  )

  render() {
    const { error, loading } = this.props

    if (loading) {
      return this.renderLoading()
    } else if (error) {
      return this.renderError()
    } else {
      return this.renderArticle()
    }
  }
}

const mapStateToProps = ({
  app,
  authentication,
  information: { article, topics },
}: IReduxState) => ({
  accessToken: authentication.accessToken,
  article: article.item,
  topic:
    article.item.category && topics.items.length > 0
      ? topics.items.find(({ topic }) => topic.key === article.item.category)
          .topic
      : undefined,
  embeddedLayout: app.embeddedLayout,
  error: article.error,
  files: article.files,
  images: article.images,
  loading: article.loading,
  locale: app.locale,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goToInformation: () => dispatch(push(`/information`)),
  goBackToTopic: (topic: string) =>
    dispatch(push(`/information/topic/${topic}`)),
  doFetchArticle: (id: string) => dispatch(InformationActions.fetchArticle(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
