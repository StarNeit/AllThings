import API from '@allthings/js-sdk'
import getServiceHost from 'utils/getServiceHost'

export interface IApiResponse<ReturnType = any> {
  status: {
    code: number
  }
  error?: string
  entity: ReturnType | undefined
  token?: string
}

export interface IApiRequest {
  method?: 'PATCH' | 'GET' | 'POST' | 'PUT' | 'DELETE'
  accessToken?: string
  path: string
  params?: IndexSignature
  entity?: IndexSignature
  timeout?: boolean
  headers?: IndexSignature<string>
  clientID?: string | boolean
  client_id?: string | boolean
  requiresCsrf?: boolean
}

export default function api(getState: () => IReduxState) {
  return <ReturnType = any>(requestConfig: IApiRequest) => {
    const { app, authentication } = getState()

    const {
      hostname,
      config: { clientID },
    } = app

    const request = createRequest<ReturnType>({
      hostname,
      clientID,
    })

    requestConfig.accessToken =
      requestConfig.accessToken || authentication.accessToken
    return request(requestConfig)
  }
}

export function createRequest<ReturnType = any>({
  hostname,
  clientID,
}: {
  hostname: string
  clientID: string
}): (requestConfig: any) => Promise<IApiResponse<ReturnType>> {
  return API(
    `https://${hostname}`,
    `https://${getServiceHost(hostname)}`,
    clientID,
  )
}
