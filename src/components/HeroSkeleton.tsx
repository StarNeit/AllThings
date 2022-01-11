import React from 'react'
import { Hero, Spinner, View } from '@allthings/elements'
import Microapp from 'components/Microapp'

const HeroSkeleton = () => {
  return (
    <Microapp>
      <Hero text="" img="" title="" />
      <View
        direction="column"
        alignV="center"
        alignH="start"
        flex="flex"
        style={{ background: '#F3F5F7', height: '100%', paddingTop: 10 }}
      >
        <Spinner />
      </View>
    </Microapp>
  )
}

export default HeroSkeleton
