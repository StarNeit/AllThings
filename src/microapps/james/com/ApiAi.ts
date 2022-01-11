import rest from 'rest'
import mime from 'rest/interceptor/mime'

const client = rest.wrap(mime)

export default function query(entity: any) {
  return client({
    method: 'POST',
    path: 'https://api.api.ai/v1/query',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${(window as any).apiAiToken}`,
    },
    entity,
  })
}
