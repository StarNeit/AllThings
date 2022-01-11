import React from 'react'
import withRequest, { IWithRequest } from './withRequest'

const makeStripeSessionCreator = (
  createRequest: IWithRequest['createRequest'],
) => async (type: string, assetId: string, entity: unknown) => {
  const response = await createRequest({
    method: 'POST',
    path: `api/v1/payments/${type}/${assetId}`,
    entity,
  })

  const { sessionId, stripePublishableKey } = response.entity
  return { sessionId, stripePublishableKey }
}

export interface IInjectedStripeCreator {
  createStripeSession: ReturnType<typeof makeStripeSessionCreator>
}

const withStripePaymentSessionCreator = <P extends IInjectedStripeCreator>(
  ProvidedComponent: React.ComponentType<P>,
): React.ComponentType<Omit<P, keyof IInjectedStripeCreator>> =>
  withRequest(
    ({
      createRequest,
      ...props
    }: Omit<P, keyof IInjectedStripeCreator> & IWithRequest) => (
      <ProvidedComponent
        createStripeSession={makeStripeSessionCreator(createRequest)}
        {...((props as unknown) as P)}
      ></ProvidedComponent>
    ),
  ) as any

export default withStripePaymentSessionCreator
