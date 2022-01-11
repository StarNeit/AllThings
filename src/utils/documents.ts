import cloneDeep from 'lodash-es/cloneDeep'
import flatten from 'lodash-es/flatten'
import { IDirectory, IFile } from 'microapps/documents'

export const getFilesDeep = (folder: IDirectory): IFile[] =>
  flatten([
    ...folder.files,
    ...folder.folders?.map(nestedFolder => getFilesDeep(nestedFolder)),
  ])

export const setSeenByMeDeep = (
  folder: IDirectory,
  fileId: string,
): IDirectory => {
  const directory = cloneDeep(folder)

  const seenFile = getFilesDeep(directory).find(file => file.id === fileId)
  seenFile.seenByMe = true

  return directory
}

export const someDeep = (
  folder: IDirectory,
  cb: (value: IFile, index?: number) => boolean,
): boolean => getFilesDeep(folder).some(cb)

export const countDeep = (folder: IDirectory): number =>
  getFilesDeep(folder).length
