/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * StructuredTags component renders tags with hierarchical relationships.
 * OAS 3.2 introduces parent, kind, and summary fields for tags.
 */
const StructuredTags = ({ specSelectors, layoutSelectors, getComponent }) => {
  const tagHierarchy = specSelectors.selectTagHierarchy()
  if (!tagHierarchy || !tagHierarchy.roots) {
    return null
  }

  const { roots, children, tagMap } = tagHierarchy
  const DeepLink = getComponent("DeepLink")
  const Markdown = getComponent("Markdown", true)

  const renderTag = (tagName, depth = 0) => {
    const tag = tagMap[tagName]
    if (!tag) return null

    const childTags = children[tagName] || []
    const hasChildren = childTags.length > 0
    const isShown = layoutSelectors.isShown(["tags", tagName], true)

    return (
      <div
        key={tagName}
        className={`structured-tag structured-tag--depth-${depth}`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="structured-tag__header">
          <h3 className="structured-tag__name">
            <DeepLink enabled={true} isShown={isShown} path={["tags", tagName]}>
              {tagName}
            </DeepLink>
            {tag.kind && (
              <span className="structured-tag__kind">[{tag.kind}]</span>
            )}
          </h3>
          {tag.summary && (
            <span className="structured-tag__summary">{tag.summary}</span>
          )}
        </div>

        {tag.description && (
          <div className="structured-tag__description">
            <Markdown source={tag.description} />
          </div>
        )}

        {hasChildren && (
          <div className="structured-tag__children">
            {childTags.map((childTagName) =>
              renderTag(childTagName, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  if (roots.length === 0) {
    return null
  }

  return (
    <div className="structured-tags">
      {roots.map((tagName) => renderTag(tagName, 0))}
    </div>
  )
}

StructuredTags.propTypes = {
  specSelectors: PropTypes.shape({
    selectTagHierarchy: PropTypes.func.isRequired,
  }).isRequired,
  layoutSelectors: PropTypes.shape({
    isShown: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default StructuredTags
