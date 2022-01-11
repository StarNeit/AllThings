import React from 'react'
import { connect } from 'react-redux'
import { css } from 'glamor'

import UtilisationPeriodActions from 'store/actions/utilisationPeriods'
import { AppTitle } from 'containers/App'
import { CustomTitleBar } from 'components/TitleBar'
import { View, SimpleLayout } from '@allthings/elements'
import Microapp from 'components/Microapp'
import { injectIntl, defineMessages } from 'react-intl'
import AndroidOpenIcon from '@allthings/react-ionicons/lib/AndroidOpenIcon'
import { ColorPalette, alpha } from '@allthings/colors'
import ExternalDataSkeleton from './ExternalDataSkeleton'
import {
  ModelPreview,
  ArchilogicTitleBar,
  ArchilogicData,
} from 'components/Archilogic'
// Because 3dio is still in a beta state, we have to load the models manually.
// import * as IO3D from '3dio/build/3dio'

// Allthings-id at archilogic. Should be used to load the models via archilogic-api.
// const ORGANISATION_RESOURCE_ID = '57311a42-8145-4484-93b3-9fce9a08d8b0'

// There should be a corresponding folder at archilogic, that holds all the models
// and also some subfolders.
const ORGANISATION_NAME = 'Allthings_Technologies_AG'

// Should be replaced by the "internal-app-title", which should be the same as
// a corresponding subfolder at archilogic, that holds the floor-plans of the related app.
// const DEFAULT_FOLDER = 'Kloten-Milano'

const iframe = css({
  border: 'none',
  display: 'flex',
  '@media all and (max-width: 880px)': {
    height: 'calc(100% - 120px)',
    top: '70px',
    width: '100%',
  },
  '@media all and (min-width: 880px)': {
    height: 'calc(100vh - 50px)',
    left: '375px',
    maxWidth: '880px',
    top: '50px',
    width: '100%',
    zIndex: 13,
  },
})

const iframeHolder = css({
  WebkitOverflowScrolling: 'touch',
  overflow: 'auto',
  width: '100%',
  '@media all and (max-width: 880px)': {
    height: '100vh',
  },
  '@media all and (min-width: 880px)': {
    position: 'fixed',
  },
})

const messages = defineMessages({
  emptyStateHeadline: {
    id: 'archilogic.empty-state.headline',
    defaultMessage: 'No 3D-Plan defined',
  },
  emptyStateHint: {
    id: 'archilogic.empty-state.hint',
    defaultMessage:
      "There is no 3D-Plan defined yet. If you don't see your 3D-Plan here within 48h, please get in touch with our support at app.team@allthings.me.",
  },
  testMessage: {
    id: 'testmessage.test',
    defaultMessage: 'Just for testing',
  },
})

interface IUtilisationPeriod {
  _embedded: {
    unit: {
      externalLinks: {
        archilogic: string
      }
    }
  }
}

interface IProps {
  config: MicroAppProps
  loading: boolean
  utilisationPeriods: IUtilisationPeriod[]
}

interface IState {
  readonly Io3dFolder: ReadonlyArray<any>
  readonly Io3dModel: any
  readonly Io3dError: string
  readonly Io3dLoading: boolean
}

type Props = IProps & DispatchProp & InjectedIntlProps

class Archilogic extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    props.dispatch(UtilisationPeriodActions.fetchUtilisationPeriods())
  }

  state: IState = {
    Io3dFolder: [],
    Io3dModel: null,
    Io3dError: null,
    Io3dLoading: true,
  }

  componentDidUpdate() {
    const { utilisationPeriods, loading } = this.props
    const { Io3dFolder, Io3dError } = this.state
    if (!loading) {
      const { externalLinks } = utilisationPeriods[0]._embedded.unit
      if (
        !(externalLinks && externalLinks.archilogic) &&
        !Io3dFolder.length &&
        !Io3dError
      ) {
        this.getModelsFromFolder()
      }
    }
  }

  getBack = () => {
    this.setState({ Io3dModel: null })
  }

  renderError() {
    const { formatMessage } = this.props.intl
    const { Io3dError } = this.state

    return (
      <View
        direction="row"
        alignH="center"
        alignV="center"
        wrap="wrap"
        style={{ padding: 15 }}
      >
        <View
          direction="column"
          style={{ maxWidth: 300, textAlign: 'center', margin: '10%' }}
        >
          <AndroidOpenIcon
            style={{
              width: 160,
              height: 160,
              fill: ColorPalette.lightGrey,
              margin: '0 auto',
            }}
          />
          <span
            style={{
              color: ColorPalette.text.primary,
              fontSize: 20,
              marginBottom: 30,
            }}
          >
            {formatMessage(messages.emptyStateHeadline)}
          </span>
          <span style={{ color: ColorPalette.lightGreyIntense }}>
            {Io3dError}
          </span>
        </View>
      </View>
    )
  }

  handleGetFolder = (res: () => any) => {
    this.setState({ Io3dLoading: false, Io3dFolder: res() })
  }

  handleModelClick = (_: React.MouseEvent, model: object) =>
    this.setState({ Io3dModel: model })

  handleErr = (err: Error) => {
    this.setState({ Io3dLoading: false, Io3dError: err.message })
  }

  // Because 3dio is still in a beta state, we have to load the models manually.
  getModelsFromFolder() {
    // IO3D.utils.services
    //   .call('Model.search', {
    //     arguments: {
    //       organizationResourceName: ORGANISATION_NAME,
    //       folderResourceName: DEFAULT_FOLDER,
    //     },
    //   })
    //   .then(this.handleGetFolder, this.handleErr)
    this.handleGetFolder(ArchilogicData)
  }

  renderModelOverview() {
    const { Io3dFolder } = this.state

    return (
      <View alignH="center" direction="row" wrap="wrap" style={{ padding: 15 }}>
        {Io3dFolder.length &&
          Io3dFolder.map(f => (
            <ModelPreview
              onClick={this.handleModelClick}
              key={f.modelResourceId}
              id={f.modelResourceId}
              name={f.modelResourceName}
              displayName={f.modelDisplayName}
              source={f.preview}
            />
          ))}
      </View>
    )
  }

  renderScene() {
    const { Io3dModel } = this.state

    return Io3dModel ? (
      <div {...css({ position: 'relative' })}>
        <div {...iframeHolder}>
          <iframe
            data-e2e="archilogic-content"
            scrolling="no"
            src={`https://spaces.archilogic.com/3d/${ORGANISATION_NAME}/${Io3dModel.resourceName}?modelResourceId=${Io3dModel.resourceId}&mode=view&view-menu=none&main-menu=none`}
            {...iframe}
          />
        </div>
      </div>
    ) : null
  }

  renderArchilogic() {
    const { Io3dError, Io3dLoading } = this.state
    if (Io3dLoading) {
      return <ExternalDataSkeleton />
    } else {
      return Io3dError
        ? this.renderError()
        : this.state.Io3dModel
        ? this.renderScene()
        : this.renderModelOverview()
    }
  }

  renderContent() {
    const { utilisationPeriods, loading } = this.props

    if (loading) {
      return <ExternalDataSkeleton />
    } else {
      const { externalLinks } = utilisationPeriods[0]._embedded.unit

      // 'eLinks = null' indicates, that no external links are defined.
      // If an external link is defined, load it in an iframe.
      // If no external link is defined, try to load the models of folder
      // 'Kloten-Milano' from archilogic.
      // We should have an immutable human readable internal-title in the app
      // that can be used to build a relation to 3rd party partners like archilogic.
      return externalLinks && externalLinks.archilogic ? (
        <div {...iframeHolder}>
          <iframe
            data-e2e="archilogic-content"
            scrolling="no"
            src={externalLinks.archilogic}
            {...iframe}
          />
        </div>
      ) : (
        this.renderArchilogic()
      )
    }
  }

  render() {
    const app = this.props.config
    const { Io3dModel } = this.state

    return (
      <Microapp
        {...css({ background: alpha(app.color, 0.03), height: '100%' })}
      >
        <AppTitle>{app.label}</AppTitle>
        <CustomTitleBar color={app.color}>
          <ArchilogicTitleBar
            label={app.label}
            detail={Io3dModel && Io3dModel.resourceId}
            modelDisplayName={Io3dModel && Io3dModel.modelDisplayName}
            onClick={this.getBack}
          />
        </CustomTitleBar>
        <SimpleLayout>{this.renderContent()}</SimpleLayout>
      </Microapp>
    )
  }
}

export default connect((state: IReduxState) => ({
  loading: state.utilisationPeriods.loading,
  utilisationPeriods: state.utilisationPeriods.items,
}))(injectIntl(Archilogic))
