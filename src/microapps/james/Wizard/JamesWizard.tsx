import React from 'react'
import { css } from 'glamor'
import { View, SimpleLayout, Button } from '@allthings/elements'
import { injectIntl } from 'react-intl'

import { ScrollWizard } from 'components/ScrollWizard'
import JamesWizardGerman from './JamesWizardGerman'
import JamesWizardStart from './JamesWizardStart'
import JamesWizardWash from './JamesWizardWash'
import JamesWizardHoliday from './JamesWizardHoliday'
import CommercialWizardStart from './CommercialWizardStart'
import CommercialWizardCarwash from './CommercialWizardCarwash'
import CommercialWizardReservation from './CommercialWizardReservation'

import Microapp from 'components/Microapp'
import { CustomTitleBar } from 'components/TitleBar'

const styles = {
  wizard: css({
    maxHeight: 500,
    width: '100%',
  }),
  page: css({
    padding: '0 30px 20px 30px',
  }),
}

interface IProps {
  appType: string
  color: string
  onAdvance: () => void
  onFinish: () => void
  page: number
  username: string
}

class JamesWizard extends React.Component<IProps & InjectedIntlProps> {
  static defaultProps = {
    appType: 'residential',
    page: 0,
  }

  renderCommercialServices() {
    const {
      color,
      page,
      username,
      onAdvance,
      onFinish,
      intl: { locale },
    } = this.props

    return (
      <ScrollWizard page={page} {...styles.wizard}>
        {locale !== 'de' ? (
          <JamesWizardGerman
            color={color}
            onAdvance={onAdvance}
            {...styles.page}
          />
        ) : null}
        <CommercialWizardStart
          greetName={username}
          color={color}
          onAdvance={onAdvance}
          {...styles.page}
        />
        <CommercialWizardCarwash
          color={color}
          onAdvance={onAdvance}
          {...styles.page}
        />
        <CommercialWizardReservation
          color={color}
          onAdvance={onFinish}
          {...styles.page}
        />
      </ScrollWizard>
    )
  }

  renderResidentialServices() {
    const {
      color,
      page,
      username,
      onAdvance,
      onFinish,
      intl: { locale },
    } = this.props

    return (
      <ScrollWizard page={page} {...styles.wizard}>
        {locale !== 'de' ? (
          <JamesWizardGerman
            color={color}
            onAdvance={onAdvance}
            {...styles.page}
          />
        ) : null}
        <JamesWizardStart
          greetName={username}
          color={color}
          onAdvance={onAdvance}
          {...styles.page}
        />

        <JamesWizardWash color={color} onAdvance={onAdvance} {...styles.page} />

        <JamesWizardHoliday
          color={color}
          onAdvance={onFinish}
          {...styles.page}
        />
      </ScrollWizard>
    )
  }

  render() {
    const { color, onFinish, appType } = this.props

    return (
      <Microapp>
        <CustomTitleBar color={color}>
          <View fill direction="row" alignV="center" alignH="end">
            <Button
              onClick={onFinish}
              backgroundColor="none"
              color="#fff"
              {...css({ opacity: 0.33 })}
              data-e2e="james-abort"
            >
              Überspringen
            </Button>
          </View>
        </CustomTitleBar>
        <SimpleLayout>
          <View
            flex="flex"
            direction="row"
            alignV="center"
            {...css({ background: color })}
          >
            {appType === 'residential'
              ? this.renderResidentialServices()
              : this.renderCommercialServices()}
          </View>
        </SimpleLayout>
      </Microapp>
    )
  }
}

export default injectIntl(JamesWizard)
