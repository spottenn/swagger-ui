/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * ResponseSummary component displays the summary field for responses.
 * OAS 3.2 adds a summary field to Response Objects and makes description optional.
 */
const ResponseSummary = ({ summary, description, getComponent }) => {
  const Markdown = getComponent("Markdown", true)

  // If neither summary nor description exists, return null
  if (!summary && !description) {
    return null
  }

  return (
    <div className="response-summary">
      {summary && <span className="response-summary__text">{summary}</span>}
      {description && (
        <div className="response-summary__description">
          <Markdown source={description} />
        </div>
      )}
    </div>
  )
}

ResponseSummary.propTypes = {
  summary: PropTypes.string,
  description: PropTypes.string,
  getComponent: PropTypes.func.isRequired,
}

ResponseSummary.defaultProps = {
  summary: null,
  description: null,
}

export default ResponseSummary
