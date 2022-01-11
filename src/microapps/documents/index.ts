export const DOCUMENTS_MICROAPP_KEY = 'documents'
export { default as Documents } from './Documents'

export interface IFolder {
  name: string
}

export interface IFile {
  readonly name: string
  readonly extension: string
  readonly id: string
  seenByMe: boolean
  readonly size: number
  readonly _embedded: any
}

export interface IDirectory {
  files?: ReadonlyArray<IFile>
  folders?: ReadonlyArray<IFolder>
  name?: string
  parent?: IDirectory
}
