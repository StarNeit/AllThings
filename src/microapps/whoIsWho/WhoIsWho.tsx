import React from 'react'
import HorizontalRouter from 'components/HorizontalRouter'
import UserProfileContainer from 'containers/UserProfileContainer'
import WhoIsWhoList from './WhoIsWhoList'

const WhoIsWho = (props: { config: object }) => (
  <HorizontalRouter
    routes={[
      {
        path: '/who-is-who',
        component: WhoIsWhoList,
        props: { config: props.config },
      },
      {
        path: '/who-is-who/profile/:id',
        component: UserProfileContainer,
      },
    ]}
  />
)

export default WhoIsWho
