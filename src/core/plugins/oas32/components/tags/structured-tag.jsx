/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * StructuredTag component for OAS 3.2
 * Displays tag information including new 3.2 fields:
 * - parent: hierarchical tag organization
 * - kind: tag classification
 * - summary: short description
 */
const StructuredTag = ({ tag, getComponent }) => {
  const Markdown = getComponent("Markdown", true)

  const name = tag.get("name")
  const description = tag.get("description")
  const externalDocs = tag.get("externalDocs")
  // OAS 3.2 fields
  const parent = tag.get("parent")
  const kind = tag.get("kind")
  const summary = tag.get("summary")

  return (
    <div className="structured-tag">
      <div className="structured-tag__header">
        <span className="structured-tag__name">{name}</span>
        {kind && <span className="structured-tag__kind badge">{kind}</span>}
        {parent && (
          <span className="structured-tag__parent">
            <small>Parent: {parent}</small>
          </span>
        )}
      </div>

      {summary && (
        <div className="structured-tag__summary">
          <em>{summary}</em>
        </div>
      )}

      {description && (
        <div className="structured-tag__description">
          <Markdown source={description} />
        </div>
      )}

      {externalDocs && (
        <div className="structured-tag__external-docs">
          <a
            href={externalDocs.get("url")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {externalDocs.get("description") || "External Documentation"}
          </a>
        </div>
      )}
    </div>
  )
}

StructuredTag.propTypes = {
  tag: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default StructuredTag
