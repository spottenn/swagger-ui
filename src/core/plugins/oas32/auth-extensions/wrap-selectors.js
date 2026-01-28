/**
 * @prettier
 */
import { Map } from "immutable"

/**
 * Wraps definitionsToAuthorize to include Device Authorization Grant.
 * OAS 3.2 adds flows.deviceAuthorization for RFC 8628 support.
 */
export const definitionsToAuthorize =
  (oriSelector, system) =>
  (state, ...args) => {
    const definitions = oriSelector(...args)

    if (!system.specSelectors.isOAS32()) {
      return definitions
    }

    // Enhance OAuth2 definitions with device authorization flow if present
    return definitions.map((definition) => {
      const schema = definition.get("schema")
      if (!Map.isMap(schema)) return definition

      if (schema.get("type") !== "oauth2") return definition

      const flows = schema.get("flow") || schema.get("flows")
      if (!Map.isMap(flows)) return definition

      const deviceAuth = flows.get("deviceAuthorization")
      if (!Map.isMap(deviceAuth)) return definition

      // Add device authorization as a recognized flow
      return definition.setIn(
        ["schema", "flows", "deviceAuthorization"],
        deviceAuth
      )
    })
  }
