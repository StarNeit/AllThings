import React, { PureComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import Feed from './Feed'
import HorizontalRouter from 'components/HorizontalRouter'
import PostLikeAll from './PostLikeAll'
import PostDetail from './PostDetail'
import UserProfileContainer from 'containers/UserProfileContainer'

const PostUserProfileContainer = (props: IProps) => (
  <UserProfileContainer
    userId={props.match.params.uid}
    onBack={() => props.onBack(props.match.params.id)}
  />
)

interface IParams {
  uid: string
  id: string
}

interface IMatch {
  params: IParams
}
interface IProps {
  match: IMatch
  onBack: (userId: string) => void
}

class Pinboard extends PureComponent<RouteComponentProps<any>> {
  onBack = (id: string) => {
    this.props.history.push(id ? `/pinboard/post/${id}/` : '/pinboard')
  }
  render() {
    const props = {
      onBack: this.onBack,
    }
    return (
      <HorizontalRouter
        routes={[
          { path: '/pinboard', component: Feed },
          {
            path: '/pinboard/post/:id',
            component: PostDetail,
          },
          {
            path: '/pinboard/post/:id/profile/:uid',
            component: PostUserProfileContainer,
            props,
          },
          { path: '/pinboard/post/:id/likes', component: PostLikeAll },
          {
            path: '/pinboard/post/:id/likes/:uid',
            component: PostUserProfileContainer,
            props,
          },
          { path: '/pinboard/:id/likes', component: PostLikeAll },
          {
            path: '/pinboard/:id/likes/:uid',
            component: PostUserProfileContainer,
            props,
          },
          {
            path: '/pinboard/profile/:uid',
            component: PostUserProfileContainer,
            props,
          },
        ]}
      />
    )
  }
}

export default withRouter(Pinboard)
