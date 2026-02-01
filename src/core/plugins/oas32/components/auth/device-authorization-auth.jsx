/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * Component for OAuth 2.0 Device Authorization Grant (RFC 8628)
 * This flow is designed for devices with limited input capabilities
 * (smart TVs, IoT devices, CLI tools, etc.)
 *
 * The flow works as follows:
 * 1. Client requests device and user codes from deviceAuthorizationUrl
 * 2. User navigates to verification_uri and enters the user_code
 * 3. Client polls the tokenUrl until authorization is complete
 */
const DeviceAuthorizationAuth = ({
  schema,
  getComponent,
  name,
  authSelectors,
}) => {
  const JumpToPath = getComponent("JumpToPath", true)
  const Markdown = getComponent("Markdown", true)
  const path = authSelectors.selectAuthPath(name)

  const deviceFlow = schema.getIn(["flows", "deviceAuthorization"])
  const deviceAuthorizationUrl = deviceFlow?.get("deviceAuthorizationUrl")
  const tokenUrl = deviceFlow?.get("tokenUrl")
  const refreshUrl = deviceFlow?.get("refreshUrl")
  const scopes = deviceFlow?.get("scopes")
  const description = schema.get("description")
  const oauth2MetadataUrl = schema.get("oauth2MetadataUrl")
  const isDeprecated = schema.get("deprecated") === true

  return (
    <div className="device-authorization-auth">
      <h4>
        {name} (oauth2 - deviceAuthorization){" "}
        {isDeprecated && <span className="deprecated-badge">Deprecated</span>}
        <JumpToPath path={path} />
      </h4>

      {isDeprecated && (
        <div className="deprecated-warning">
          <strong>Warning:</strong> This security scheme is deprecated.
        </div>
      )}

      {description && <Markdown source={description} />}

      <p>
        This API uses OAuth 2.0 Device Authorization Grant (RFC 8628). This flow
        is designed for devices with limited input capabilities.
      </p>

      <table className="device-authorization-details">
        <tbody>
          <tr>
            <th>Device Authorization URL:</th>
            <td>
              <code>{deviceAuthorizationUrl}</code>
            </td>
          </tr>
          <tr>
            <th>Token URL:</th>
            <td>
              <code>{tokenUrl}</code>
            </td>
          </tr>
          {refreshUrl && (
            <tr>
              <th>Refresh URL:</th>
              <td>
                <code>{refreshUrl}</code>
              </td>
            </tr>
          )}
          {oauth2MetadataUrl && (
            <tr>
              <th>OAuth 2.0 Metadata URL:</th>
              <td>
                <a
                  href={oauth2MetadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {oauth2MetadataUrl}
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {scopes && scopes.size > 0 && (
        <div className="device-authorization-scopes">
          <h5>Available Scopes:</h5>
          <table>
            <thead>
              <tr>
                <th>Scope</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {scopes
                .entrySeq()
                .map(([scopeName, scopeDescription]) => (
                  <tr key={scopeName}>
                    <td>
                      <code>{scopeName}</code>
                    </td>
                    <td>{scopeDescription}</td>
                  </tr>
                ))
                .toArray()}
            </tbody>
          </table>
        </div>
      )}

      <div className="device-authorization-instructions">
        <h5>How to Authorize:</h5>
        <ol>
          <li>
            Make a POST request to the Device Authorization URL with your client
            credentials
          </li>
          <li>
            You will receive a <code>device_code</code>, <code>user_code</code>,
            and <code>verification_uri</code>
          </li>
          <li>
            Navigate to the verification URI and enter the user code to
            authorize
          </li>
          <li>
            Poll the Token URL with the device code until authorization is
            complete
          </li>
        </ol>
      </div>
    </div>
  )
}

DeviceAuthorizationAuth.propTypes = {
  schema: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  authSelectors: PropTypes.object.isRequired,
}

export default DeviceAuthorizationAuth
