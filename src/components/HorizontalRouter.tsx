import React from 'react'
import {
  withRouter,
  matchPath,
  RouteProps,
  RouteComponentProps,
} from 'react-router'
import { View } from '@allthings/elements'
import { css } from 'glamor'

interface IRoute extends RouteProps {
  readonly path: string
  readonly exact?: boolean
  readonly component: React.ComponentType<any>
  readonly props?: {}
}

interface IProps {
  routes: ReadonlyArray<IRoute>
}

interface IState {
  currentRoute: number
  nextRoutes: ReadonlyArray<IRoute>
  routes: ReadonlyArray<IRoute>
  waitForTransitionEnd: boolean
}

class HorizontalRouter extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  getMatchingRoutes = (props: IProps & RouteComponentProps) =>
    props.routes.reduce((acc, route) => {
      const match = matchPath(props.location.pathname, route)
      if (match) {
        const routeWithProps = {
          ...route,
          props: {
            match,
            location: props.location,
            history: props.history,
            ...route.props,
          },
        }
        acc.push(routeWithProps)
      }
      return acc
    }, [])

  constructor(props: IProps & RouteComponentProps, context: React.Context<{}>) {
    super(props, context)

    const routes = this.getMatchingRoutes(props)
    const currentRoute = routes.length

    this.state = {
      routes,
      currentRoute,
      nextRoutes: null,
      waitForTransitionEnd: false,
    }
  }

  componentDidUpdate(prevProps: IProps & RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const oldRoutes = this.getMatchingRoutes(prevProps)
      const nextRoutes = this.getMatchingRoutes(this.props)

      if (nextRoutes.length < oldRoutes.length) {
        this.setState({
          nextRoutes,
          waitForTransitionEnd: true,
          currentRoute: nextRoutes.length,
        })
      } else {
        this.setState({
          routes: nextRoutes,
          currentRoute: nextRoutes.length,
        })
      }
    }
  }

  handleTransitionEnd = () => {
    if (this.state.waitForTransitionEnd) {
      this.setState({
        routes: this.state.nextRoutes,
        nextRoutes: null,
        waitForTransitionEnd: false,
      })
    }
  }

  render() {
    const { currentRoute, routes } = this.state

    const translateX = (currentRoute - 1) * -100

    return (
      <View
        direction="row"
        flex="flex"
        {...css({
          transform: `translate3d(${translateX}%, 0, 0)`,
          transition: '.5s',
        })}
        onTransitionEnd={this.handleTransitionEnd}
      >
        {routes.map(route => (
          <View
            key={route.path as string}
            {...css({ width: '100%' })}
            flex="none"
            direction="column"
          >
            <route.component {...route.props} />
          </View>
        ))}
      </View>
    )
  }
}

export default withRouter(HorizontalRouter)
