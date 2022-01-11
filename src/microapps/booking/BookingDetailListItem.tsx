import React from 'react'
import { ListItem, Text, View } from '@allthings/elements'

interface IProps {
  categoryName: string
  categoryDetail: string | React.ReactElement<any>
  hideLine?: boolean
}

const BookingDetailListItem = ({
  categoryDetail,
  categoryName,
  hideLine,
}: IProps) => (
  <ListItem hideLine={hideLine}>
    <View flex={30}>
      <Text color="secondary">{categoryName}</Text>
    </View>
    <View flex={70}>
      <Text size="l" strong>
        {categoryDetail}
      </Text>
    </View>
  </ListItem>
)

export default BookingDetailListItem
