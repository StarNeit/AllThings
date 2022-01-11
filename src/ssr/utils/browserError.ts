export default class BrowserError extends Error {
  inspect: () => string = null

  name: string = null

  constructor(message: string, name: string, stack: string) {
    super(String(message))

    this.name = `Browser${name}`

    this.inspect = () => String(stack || `${this.name}: ${this.message}`)
  }
}
