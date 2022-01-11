import { css } from 'glamor'
import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { View, Typeahead } from '@allthings/elements'

const styles = {
  typeaheadWrapper: css({
    border: `1px solid ${ColorPalette.greyIntense}`,
    margin: '30px 0',
  }),
  wrapper: css({ width: '100%' }),
}

const AddressTypeahead = ({
  address,
  onAddressChange,
  onAddressSelect,
  onClearSelection,
  placeholder,
  predictions,
}: {
  address: string
  onAddressChange: (arg: string) => void
  onAddressSelect: (selection: { label: string; value: string }) => void
  onClearSelection: () => void
  placeholder: string
  predictions: ReadonlyArray<{
    label: string
    value: string
  }>
}) => (
  <View {...styles.wrapper}>
    <View {...styles.typeaheadWrapper}>
      <Typeahead
        items={predictions}
        limit={10}
        onClearSelection={onClearSelection}
        onInputValueChange={onAddressChange}
        onSelect={onAddressSelect}
        placeholder={placeholder}
        placement="bottom"
        value={address}
      />
    </View>
  </View>
)

export default AddressTypeahead
