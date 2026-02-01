/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * ResponseSummary component for OAS 3.2
 * Displays the summary field for responses
 * In OAS 3.2, description is optional and summary is added
 */
const ResponseSummary = ({ summary }) => {
  if (!summary) return null

  return <span className="response-summary">{summary}</span>
}

ResponseSummary.propTypes = {
  summary: PropTypes.string,
}

export default ResponseSummary
