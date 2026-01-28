/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../../fn"

/**
 * AuthItem wrapper for OAS 3.2
 * Handles:
 * - OAuth 2.0 Device Authorization flow
 * - Deprecated security schemes (shows deprecated badge)
 */
const AuthItem = createOnlyOAS32ComponentWrapper(
  ({ originalComponent: Ori, ...props }) => {
    const { getComponent, schema, name } = props
    const DeviceAuthorizationAuth = getComponent(
      "DeviceAuthorizationAuth",
      true
    )
    const type = schema.get("type")
    const flows = schema.get("flows")
    const isDeprecated = schema.get("deprecated") === true

    // Check if this is an OAuth2 scheme with Device Authorization flow
    if (type === "oauth2" && flows && flows.has("deviceAuthorization")) {
      // If it ONLY has deviceAuthorization flow, use the dedicated component
      const hasOnlyDeviceAuth =
        flows.size === 1 && flows.has("deviceAuthorization")

      if (hasOnlyDeviceAuth) {
        return <DeviceAuthorizationAuth schema={schema} name={name} />
      }

      // Otherwise, fall through to original which handles multiple flows
      // The original OAuth2 component should be enhanced to handle device auth
    }

    // Wrap with deprecated warning if needed
    if (isDeprecated) {
      return (
        <div className="auth-item--deprecated">
          <Ori {...props} />
          <div className="deprecated-notice">
            <small>This security scheme is deprecated.</small>
          </div>
        </div>
      )
    }

    return <Ori {...props} />
  }
)

export default AuthItem
