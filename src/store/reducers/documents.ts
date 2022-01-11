import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import isEqual from 'lodash-es/isEqual'
import last from 'lodash-es/last'
import find from 'lodash-es/find'
import { setSeenByMeDeep } from 'utils/documents'

interface IFile {
  type: string
  readonly pathArray: string[]
  readonly name: string
  readonly extension: string
  readonly id: string
  readonly seenByMe: boolean
  readonly size: number
  readonly _embedded: any
}

interface IFolder {
  readonly name: string
  readonly path: readonly string[]
  readonly parent: IFolder
  type?: string
  folders: IFolder[]
  files: readonly IFile[]
}
interface IState {
  readonly loading: boolean
  readonly directory: {
    readonly files: readonly IFile[]
    readonly folders: readonly IFolder[]
  }
}

const initialState: IState = {
  loading: true,
  directory: {
    files: [],
    folders: [],
  },
}
function createFolderStruct(itemsArray: readonly IFile[]) {
  const folders: IFolder[] = []

  function getOrCreateFolder(pathArray: string[]) {
    let parentPath
    let folder = find(folders, ['path', pathArray])

    if (!folder) {
      if (!pathArray.length) {
        folder = {
          name: '',
          path: [],
          parent: undefined,
          folders: [],
          files: [],
        }
      } else {
        parentPath = [].concat(pathArray)
        parentPath.pop()
        folder = {
          name: last(pathArray),
          path: pathArray,
          parent: getOrCreateFolder(parentPath),
          folders: [],
          files: [],
        }
      }
      folders.push(folder)
    }
    return folder
  }

  itemsArray.forEach(item => {
    getOrCreateFolder(item.pathArray)
  })

  // Set child folders & files.
  folders.forEach(folder => {
    folder.folders = folders
      .filter(fold => {
        return isEqual(fold.parent, folder)
      })
      .map(currentFolder => {
        currentFolder.type = 'dir'
        return currentFolder
      })
    folder.files = itemsArray
      .filter(file => {
        return isEqual(file.pathArray, folder.path)
      })
      .map(file => {
        file.type = 'file'
        return file
      })
  })
  // Only return the root.
  return find(folders, ['path', []])
}

export default createReducers(initialState, {
  fetchDocuments(state, { payload, status }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { loading: true })

      case 'ok':
        const directory =
          createFolderStruct(
            payload.map((item: { path: string; pathArray: string[] }) => {
              // Create an array from the path string
              item.pathArray = !item.path ? [] : item.path.split('/')
              return item
            }),
          ) || ({ files: [], folders: [] } as IState['directory'])
        return Object.assign({}, state, { loading: false, directory })

      case 'error':
        return merge({}, state, { loading: false })
      default:
        return state
    }
  },

  markRead(state, { payload }) {
    return Object.assign({}, state, {
      directory: setSeenByMeDeep(state.directory, payload),
    })
  },

  changeDir(state, { payload }) {
    return Object.assign({}, state, { directory: payload })
  },
})
