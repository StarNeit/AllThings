export default async (name: string, blob: any, api: any) => {
  const fd = new FormData()
  fd.append('file', blob, name)

  const upload = await api({
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    path: 'api/v1/files',
    entity: fd,
  })

  if (upload.status.code === 201) {
    return upload
  } else {
    throw new Error('Upload failed')
  }
}
