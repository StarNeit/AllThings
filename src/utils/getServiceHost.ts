export default function getServiceHost(hostname: string, service = 'api') {
  // Example hostnames with their corresponding api hosts:
  // app.example.org                    => api.allthings.me
  // app.allthings.me                   => api.allthings.me
  // app.dev.allthings.me               => api.dev.allthings.me
  // app.staging.allthings.me           => api.staging.allthings.me
  // app.prerelease-red.allthings.me    => api.prerelease-red.allthings.me
  const regexp = /\w+\.(dev|staging|prerelease(-[\w\d-]+)?)\S*/
  const match = regexp.exec(hostname)

  if (!match) {
    return `${service}.allthings.me`
  }

  return `${service}.${match[1]}.allthings.me`
}
