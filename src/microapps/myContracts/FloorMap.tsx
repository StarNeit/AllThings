import React from 'react'
import { FormattedMessage } from 'react-intl'

class FloorMap {
  static map = {
    'floor-X': (floorNumber: string, i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.floor-x"
          defaultMessage="{floorNumber} floor"
          values={{ floorNumber }}
        />
      )
    },
    'basement-X': (floorNumber: string, i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.basement-x"
          defaultMessage="{floorNumber} basement"
          values={{ floorNumber }}
        />
      )
    },
    'attic-X': (floorNumber: string, i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.attic-x"
          defaultMessage="{floorNumber} attic"
          values={{ floorNumber }}
        />
      )
    },

    outside: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.outside"
          defaultMessage="outside"
        />
      )
    },
    inside: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.inside"
          defaultMessage="inside"
        />
      )
    },
    basement: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.basement"
          defaultMessage="basement"
        />
      )
    },
    mezzanine: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.mezzanine"
          defaultMessage="mezzanine"
        />
      )
    },
    'raised-ground-floor': (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.raised-ground-floor"
          defaultMessage="raised ground floor"
        />
      )
    },
    roof: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.roof"
          defaultMessage="roof"
        />
      )
    },
    property: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.property"
          defaultMessage="property"
        />
      )
    },
    diverse: (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.diverse"
          defaultMessage="diverse"
        />
      )
    },
    'free-zone': (i: number) => {
      return (
        <FormattedMessage
          key={i}
          id="contracts.floors.free-zone"
          defaultMessage="free zone"
        />
      )
    },
  }

  static getMessage(floorKey: string, i: number) {
    /**
     * floor-X + basement-X; attic-x
     * X = floorNumber
     */
    if (floorKey.substr(0, 'floor-'.length) === 'floor-') {
      return this.map['floor-X'](floorKey.split('-')[1], i)
    }
    if (floorKey.substr(0, 'basement-'.length) === 'basement-') {
      return this.map['basement-X'](floorKey.split('-')[1], i)
    }
    if (floorKey.substr(0, 'attic-'.length) === 'attic-') {
      return this.map['attic-X'](floorKey.split('-')[1], i)
    }

    if (this.map.hasOwnProperty(floorKey)) {
      return this.map[floorKey](i)
    }

    return null
  }
}

export default FloorMap
