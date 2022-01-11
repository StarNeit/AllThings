export const getStaticImage = (path: string) =>
  `${process.env.CDN_HOST_URL_PREFIX || ''}/static/img/${path}`
