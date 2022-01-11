import React, { ReactNode } from 'react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router'
import HorizontalRouter from 'components/HorizontalRouter'
import { View, ColumnLayout, Responsive } from '@allthings/elements'
import MyThings from './MyThings'
import Overview from './Overview'
import ShowThing from './ShowThing'
import ThingOverlay from './ThingOverlay/ThingOverlay'
import RenderOnQuery from 'containers/RenderOnQuery'
import { css } from 'glamor'

interface IProps {
  type: 'marketplace' | 'sharing'
  renderPlaceholder: () => ReactNode
}

interface IState {
  deletedThings: ReadonlyArray<string>
}

class ThingRouter extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  state: IState = {
    deletedThings: [],
  }

  addDeletedThing = (thingId: string): Promise<void> =>
    new Promise<void>(resolve =>
      this.setState(
        ({ deletedThings }) => ({
          deletedThings: deletedThings.concat(thingId),
        }),
        resolve,
      ),
    )

  render() {
    const { type, history, renderPlaceholder } = this.props
    const { deletedThings } = this.state
    const props = { type, deletedThings }

    return (
      <>
        <RenderOnQuery name="thing">
          {({ close }) => (
            <ThingOverlay
              onRequestClose={close}
              type={type === 'sharing' ? 'to-give' : 'for-sale'}
            />
          )}
        </RenderOnQuery>
        <Responsive mobile onlyRenderOnMatch>
          <View direction="column" flex="flex" {...css({ overflow: 'auto' })}>
            <HorizontalRouter
              routes={[
                {
                  path: `/${type}`,
                  component: Overview,
                  props,
                },
                {
                  path: `/${type}/me`,
                  component: MyThings,
                  props,
                },
                {
                  path: `/${type}/me/:id`,
                  exact: true,
                  component: ShowThing,
                  props: {
                    ...props,
                    onDeleteThing: (thingId: string) => {
                      history.push(`/${type}/me`)
                      this.addDeletedThing(thingId)
                    },
                    backTo: `/${type}/me`,
                  },
                },
                {
                  path: `/${type}/show/:id`,
                  exact: true,
                  component: ShowThing,
                  props: {
                    ...props,
                    onDeleteThing: (thingId: string) => {
                      history.push(`/${type}`)
                      this.addDeletedThing(thingId)
                    },
                    backTo: `/${type}`,
                  },
                },
              ]}
            />
          </View>
        </Responsive>
        <Responsive desktop tablet onlyRenderOnMatch>
          <ColumnLayout>
            <HorizontalRouter
              routes={[
                { path: `/${type}`, component: Overview, props },
                {
                  path: `/${type}/me`,
                  component: MyThings,
                  props,
                },
              ]}
            />
            <Switch>
              <Route
                path={`/${type}/me/:id`}
                exact
                render={rprops => (
                  <ShowThing
                    backTo={`/${type}/me`}
                    onDeleteThing={async thingId => {
                      await this.addDeletedThing(thingId)
                      history.push(`/${type}/me`)
                    }}
                    {...rprops}
                  />
                )}
              />
              <Route
                path={`/${type}/show/:id`}
                exact
                render={rprops => (
                  <ShowThing
                    backTo={`/${type}`}
                    onDeleteThing={async thingId => {
                      await this.addDeletedThing(thingId)
                      history.push(`/${type}`)
                    }}
                    {...rprops}
                  />
                )}
              />
              <Route path="*" render={renderPlaceholder} />
            </Switch>
          </ColumnLayout>
        </Responsive>
      </>
    )
  }
}

export default withRouter(ThingRouter)
