// tslint:disable-next-line:no-implicit-dependencies
import Actionable, { State, STATE_PENDING } from 'components/Action/Actionable'
// tslint:disable-next-line
import { Button } from '@allthings/elements'
import React from 'react'

export interface IActionButtonProps extends IndexSignature {
  readonly status: State
}

const ActionButton = ({ status, ...props }: IActionButtonProps) => (
  <Button {...props} disabled={status === STATE_PENDING} />
)

export default Actionable(ActionButton)
