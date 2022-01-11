import { css } from 'glamor'
import React from 'react'
// tslint:disable-next-line:no-implicit-dependencies
import NoOp from 'utils/noop'
// tslint:disable-next-line
import { ColorPalette } from '@allthings/colors'
import { Text, View } from '@allthings/elements'

export interface IModelPreviewProps {
  readonly id: string
  readonly name: string
  readonly displayName: string
  readonly source: string
  readonly onClick: (event: React.MouseEvent, model: object) => void
}

const ModelPreview = ({
  source,
  id,
  name,
  displayName,
  onClick = NoOp,
}: IModelPreviewProps): JSX.Element => {
  const handleClick = (e: React.MouseEvent) => {
    onClick(e, {
      modelDisplayName: displayName,
      resourceId: id,
      resourceName: name,
    })
  }

  return (
    <View
      direction="row"
      alignH="space-between"
      style={{
        cursor: 'pointer',
        marginBottom: 10,
        marginRight: 10,
        maxHeight: 200,
        maxWidth: 200,
      }}
    >
      <div
        {...css({
          border: `1px solid ${ColorPalette.lightGrey}`,
          minHeight: 149,
          minWidth: 198,
        })}
      >
        <img onClick={handleClick} src={source} />
        <Text size="s" style={{ padding: '5px', textAlign: 'right' }}>
          {displayName}
        </Text>
      </div>
    </View>
  )
}

export default ModelPreview
