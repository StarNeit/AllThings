import { DropEvent, FileWithPath } from 'react-dropzone'

export type FileWithPreview = FileWithPath & { preview?: string }
export type DropHandler = (
  accepted: FileWithPreview[],
  rejected: FileWithPath[],
  event: DropEvent,
) => void

export const enhanceWithPreviews = (
  files: readonly FileWithPath[],
): readonly FileWithPreview[] =>
  files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))

export const clearPreviews = (files: readonly FileWithPreview[]) =>
  files.forEach(file => URL.revokeObjectURL(file.preview))
