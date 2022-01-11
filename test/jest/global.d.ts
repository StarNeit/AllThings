// Extend the NodeJS global object.
declare namespace NodeJS {
  export interface Global {
    document: any
    fetch: any
    nodeWithIntlProvider: any
    uuid: any
    mockStore: any
    mount: any
    mountIntl: any
    render: any
    renderer: any
    shallow: any
    shallowIntl: any
  }
}
