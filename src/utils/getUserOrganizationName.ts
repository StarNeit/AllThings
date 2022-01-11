// We want to highlight additional information regarding the user in this
// specific order, see https://allthings.atlassian.net/browse/APP-5312:
// 1. organization name
// 2. external agent company name
// 3. company name

const getUserOrganizationName = (user: IAPIUser) => {
  const organization = user?._embedded?.organization
  const externalAgentCompany = user?._embedded?.externalAgentCompany
  const company = user?._embedded?.company

  return organization
    ? organization.name
    : externalAgentCompany
    ? externalAgentCompany.name
    : company
    ? company?.name
    : null
}

export default getUserOrganizationName
