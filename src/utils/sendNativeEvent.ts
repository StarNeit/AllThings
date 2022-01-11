export interface INativeMessage {
  name: string
  data: any
}

const sendNativeEvent = (token: string, event: INativeMessage) =>
  window.postMessage(JSON.stringify({ token, event }), '*')

export const navigateToMyFlat = (token: string) =>
  sendNativeEvent(token, {
    name: 'tab-change',
    data: '/my-flat',
  })

export default sendNativeEvent
