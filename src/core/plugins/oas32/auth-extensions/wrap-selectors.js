/**
 * @prettier
 */
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Wraps definitionsToAuthorize to include deprecated security schemes
 * and handle OAuth 2.0 Device Authorization flow (OAS 3.2)
 *
 * OAS 3.2 adds:
 * - flows.deviceAuthorization for OAuth 2.0 Device Authorization Grant (RFC 8628)
 * - deprecated field on security schemes
 * - oauth2MetadataUrl field for OAuth 2.0 server metadata discovery
 */
export const definitionsToAuthorize = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) => {
    const definitions = system.specSelectors.securityDefinitions()
    let list = oriSelector()

    if (!definitions) return list

    // The base handling is done by OAS3/OAS31 plugins
    // OAS 3.2 adds support for deprecated schemes and device authorization
    // but doesn't change how they're added to the authorize list
    // The UI components will handle displaying the deprecated status
    // and the device authorization flow UI

    return list
  }
)

/**
 * Selects OAuth 2.0 Device Authorization flow configuration
 * Returns the deviceAuthorization flow if present
 */
export const selectDeviceAuthorizationFlow = (state, system, schemeName) => {
  const definitions = system.specSelectors.securityDefinitions()
  if (!definitions) return null

  const scheme = definitions.get(schemeName)
  if (!scheme || scheme.get("type") !== "oauth2") return null

  return scheme.getIn(["flows", "deviceAuthorization"])
}

/**
 * Checks if a security scheme has Device Authorization flow
 */
export const hasDeviceAuthorizationFlow = (state, system, schemeName) => {
  const flow = selectDeviceAuthorizationFlow(state, system, schemeName)
  return flow !== null && flow !== undefined
}

/**
 * Selects oauth2MetadataUrl from a security scheme (OAS 3.2)
 */
export const selectOAuth2MetadataUrl = (state, system, schemeName) => {
  const definitions = system.specSelectors.securityDefinitions()
  if (!definitions) return null

  const scheme = definitions.get(schemeName)
  if (!scheme) return null

  return scheme.get("oauth2MetadataUrl")
}

/**
 * Checks if a security scheme is deprecated (OAS 3.2)
 */
export const isSecuritySchemeDeprecated = (state, system, schemeName) => {
  const definitions = system.specSelectors.securityDefinitions()
  if (!definitions) return false

  const scheme = definitions.get(schemeName)
  if (!scheme) return false

  return scheme.get("deprecated") === true
}
