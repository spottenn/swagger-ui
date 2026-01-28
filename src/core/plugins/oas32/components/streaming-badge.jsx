/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * StreamingBadge component displays a visual indicator for streaming responses.
 * OAS 3.2 introduces itemSchema, itemEncoding, and prefixEncoding for
 * describing streaming/sequential media types like text/event-stream,
 * application/jsonl, and application/json-seq.
 */
const StreamingBadge = ({ mediaType }) => {
  if (!mediaType) return null

  return (
    <span className="streaming-badge" title={`Streaming: ${mediaType}`}>
      streaming
    </span>
  )
}

StreamingBadge.propTypes = {
  mediaType: PropTypes.string,
}

StreamingBadge.defaultProps = {
  mediaType: null,
}

export default StreamingBadge
