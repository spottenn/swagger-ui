/**
 * @prettier
 */
import { Map } from "immutable"

/**
 * Selects OAuth 2.0 Device Authorization flow configuration (OAS 3.2)
 * Returns the deviceAuthorization flow object if present
 *
 * Device Authorization flow fields:
 * - deviceAuthorizationUrl (required): URL for device authorization endpoint
 * - tokenUrl (required): URL for token endpoint
 * - refreshUrl (optional): URL for refresh endpoint
 * - scopes (required): Available scopes for the flow
 */
export const selectDeviceAuthorizationFlow =
  (state, schemeName) => (system) => {
    const definitions = system.specSelectors.securityDefinitions()
    if (!definitions) return null

    const scheme = definitions.get(schemeName)
    if (!scheme || scheme.get("type") !== "oauth2") return null

    return scheme.getIn(["flows", "deviceAuthorization"])
  }

/**
 * Checks if a security scheme has Device Authorization flow
 */
export const hasDeviceAuthorizationFlow = (state, schemeName) => (system) => {
  const flow = selectDeviceAuthorizationFlow(state, schemeName)(system)
  return flow !== null && flow !== undefined
}

/**
 * Selects oauth2MetadataUrl from a security scheme (OAS 3.2)
 * This URL points to RFC 8414 OAuth 2.0 Authorization Server Metadata
 */
export const selectOAuth2MetadataUrl = (state, schemeName) => (system) => {
  const definitions = system.specSelectors.securityDefinitions()
  if (!definitions) return null

  const scheme = definitions.get(schemeName)
  if (!scheme) return null

  return scheme.get("oauth2MetadataUrl")
}

/**
 * Checks if a security scheme is deprecated (OAS 3.2)
 */
export const isSecuritySchemeDeprecated = (state, schemeName) => (system) => {
  const definitions = system.specSelectors.securityDefinitions()
  if (!definitions) return false

  const scheme = definitions.get(schemeName)
  if (!scheme) return false

  return scheme.get("deprecated") === true
}

/**
 * Gets the device authorization URL from a Device Authorization flow
 */
export const selectDeviceAuthorizationUrl = (state, schemeName) => (system) => {
  const flow = selectDeviceAuthorizationFlow(state, schemeName)(system)
  if (!flow) return null
  return flow.get("deviceAuthorizationUrl")
}

/**
 * Gets the token URL from a Device Authorization flow
 */
export const selectDeviceAuthorizationTokenUrl =
  (state, schemeName) => (system) => {
    const flow = selectDeviceAuthorizationFlow(state, schemeName)(system)
    if (!flow) return null
    return flow.get("tokenUrl")
  }

/**
 * Gets the scopes from a Device Authorization flow
 */
export const selectDeviceAuthorizationScopes =
  (state, schemeName) => (system) => {
    const flow = selectDeviceAuthorizationFlow(state, schemeName)(system)
    if (!flow) return Map()
    return flow.get("scopes", Map())
  }
