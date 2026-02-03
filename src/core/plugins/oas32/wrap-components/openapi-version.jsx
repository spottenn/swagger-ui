/**
 * @prettier
 */
import React from "react"

/**
 * Wraps OpenAPIVersion component to display "3.2" for OAS 3.2 specs
 */
const OpenAPIVersionWrapper = (Original, system) => (props) => {
  if (system.specSelectors.isOAS32()) {
    return <Original {...props} oasVersion="3.2" />
  }
  return <Original {...props} />
}

export default OpenAPIVersionWrapper
