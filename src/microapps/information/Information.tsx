import React from 'react'
import {
  Route,
  Switch,
  withRouter,
  Redirect,
  RouteComponentProps,
} from 'react-router'
import { View, ColumnLayout, Responsive } from '@allthings/elements'
import HorizontalRouter from 'components/HorizontalRouter'
import TopicList from './TopicList'
import ArticleList from './ArticleList'
import Detail from './Detail'
import ArticlePlaceholder from './ArticlePlaceholder'
import DataProvider, { IData } from 'containers/DataProvider'
import { css } from 'glamor'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'

interface IProps {
  config: MicroAppProps
  location: object
}

class Information extends React.Component<IProps & RouteComponentProps> {
  render() {
    const props = { config: this.props.config }

    return (
      <HorizontalRouterMicroapp>
        {/* Redirect from /information/article/:id to /information/topic/:key/:id */}
        <Route
          path="/information/article/:id"
          render={({ match }) => (
            <DataProvider
              request={{
                method: 'GET',
                path: `api/v1/articles/${match.params.id}`,
              }}
            >
              {({ isDone, result }: IData) => {
                return isDone ? (
                  <Redirect
                    to={`/information/topic/${result.entity.category}/${result.entity.id}`}
                  />
                ) : (
                  <View />
                )
              }}
            </DataProvider>
          )}
        />
        <Responsive mobile onlyRenderOnMatch>
          <View direction="column" flex="flex" {...css({ overflow: 'auto' })}>
            <HorizontalRouter
              routes={[
                { path: '/information', component: TopicList, props },
                {
                  path: '/information/topic/:key',
                  component: ArticleList,
                  props,
                },
                {
                  path: '/information/topic/:key/:id',
                  exact: true,
                  component: Detail,
                  props,
                },
              ]}
            />
          </View>
        </Responsive>
        <Responsive desktop tablet onlyRenderOnMatch>
          <ColumnLayout>
            <HorizontalRouter
              routes={[
                { path: '/information', component: TopicList, props },
                {
                  path: '/information/topic/:key',
                  component: ArticleList,
                  props,
                },
              ]}
            />
            <Switch>
              <Route
                path="/information/topic/:key/:id"
                exact
                component={Detail}
              />
              <Route path="*" component={ArticlePlaceholder} />
            </Switch>
          </ColumnLayout>
        </Responsive>
      </HorizontalRouterMicroapp>
    )
  }
}

export default withRouter(Information)
