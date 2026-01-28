/**
 * @prettier
 */
import { createSelector } from "reselect"
import { List, Map, OrderedMap } from "immutable"
import { isOAS32 as isOAS32Helper } from "../fn"
import { specJsonWithResolvedSubtrees } from "../../spec/selectors"

/**
 * Detects if the current spec is OpenAPI 3.2.x
 */
export const isOAS32 = (state, system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOAS32Helper(spec)
}

/**
 * Gets the default JSON Schema dialect for OAS 3.2
 * OAS 3.2 uses JSON Schema 2020-12 as the default dialect
 */
export const selectJsonSchemaDialectDefault = () =>
  "https://spec.openapis.org/oas/3.2/dialect/2025-09-17"

/**
 * Selects all tags from the spec
 */
export const selectTags = createSelector(specJsonWithResolvedSubtrees, (spec) =>
  spec.get("tags", List())
)

/**
 * Selects tag details by name, including OAS 3.2 fields:
 * - parent: hierarchical tag organization
 * - kind: tag classification
 * - summary: short description (new in 3.2)
 */
export const selectTagDetails = (state, system, tagName) => {
  const tags = selectTags(state)
  return tags.find((tag) => tag.get("name") === tagName, Map())
}

/**
 * Selects the parent field from a tag (OAS 3.2)
 */
export const selectTagParentField = (state, system, tagName) => {
  const tag = selectTagDetails(state, system, tagName)
  return tag ? tag.get("parent") : null
}

/**
 * Selects the kind field from a tag (OAS 3.2)
 */
export const selectTagKindField = (state, system, tagName) => {
  const tag = selectTagDetails(state, system, tagName)
  return tag ? tag.get("kind") : null
}

/**
 * Selects the summary field from a tag (OAS 3.2)
 */
export const selectTagSummaryField = (state, system, tagName) => {
  const tag = selectTagDetails(state, system, tagName)
  return tag ? tag.get("summary") : null
}

/**
 * Builds a hierarchical tag structure based on parent relationships
 * Returns a map where keys are parent tag names and values are arrays of child tags
 */
export const selectHierarchicalTags = createSelector(selectTags, (tags) => {
  const hierarchy = OrderedMap().asMutable()
  const rootTags = []

  tags.forEach((tag) => {
    const parent = tag.get("parent")

    if (parent) {
      if (!hierarchy.has(parent)) {
        hierarchy.set(parent, [])
      }
      hierarchy.get(parent).push(tag)
    } else {
      rootTags.push(tag)
    }
  })

  return Map({
    roots: List(rootTags),
    children: hierarchy.asImmutable(),
  })
})

/**
 * Selects additional operations from a path item (OAS 3.2)
 * additionalOperations allows custom HTTP methods beyond standard verbs
 */
export const selectAdditionalOperations = (state, system, pathName) => {
  const spec = specJsonWithResolvedSubtrees(state)
  const pathItem = spec.getIn(["paths", pathName], Map())
  return pathItem.get("additionalOperations", Map())
}

/**
 * Gets all operations including additionalOperations for a path
 */
export const selectAllOperationsForPath = (state, system, pathName) => {
  const { specSelectors } = system.getSystem()
  const validMethods = specSelectors.validOperationMethods()
  const spec = specJsonWithResolvedSubtrees(state)
  const pathItem = spec.getIn(["paths", pathName], Map())

  let operations = List()

  // Standard operations
  validMethods.forEach((method) => {
    const operation = pathItem.get(method)
    if (Map.isMap(operation)) {
      operations = operations.push(
        Map({
          method,
          operation,
          path: pathName,
          isAdditional: false,
        })
      )
    }
  })

  // Additional operations (custom HTTP methods)
  const additionalOps = pathItem.get("additionalOperations", Map())
  additionalOps.forEach((operation, method) => {
    if (Map.isMap(operation)) {
      operations = operations.push(
        Map({
          method,
          operation,
          path: pathName,
          isAdditional: true,
        })
      )
    }
  })

  return operations
}

/**
 * Selects response summary field (OAS 3.2)
 * In OAS 3.2, description is optional and summary is added
 */
export const selectResponseSummary = (
  state,
  system,
  pathMethod,
  statusCode
) => {
  const spec = specJsonWithResolvedSubtrees(state)
  const [path, method] = pathMethod
  return spec.getIn(["paths", path, method, "responses", statusCode, "summary"])
}

/**
 * Selects server name field (OAS 3.2)
 */
export const selectServerName = (state, system, serverIndex) => {
  const spec = specJsonWithResolvedSubtrees(state)
  return spec.getIn(["servers", serverIndex, "name"])
}

/**
 * Selects path item name field (OAS 3.2)
 */
export const selectPathItemName = (state, system, pathName) => {
  const spec = specJsonWithResolvedSubtrees(state)
  return spec.getIn(["paths", pathName, "name"])
}

/**
 * Selects media type description field (OAS 3.2)
 */
export const selectMediaTypeDescription = (
  state,
  system,
  pathMethod,
  mediaType
) => {
  const spec = specJsonWithResolvedSubtrees(state)
  const [path, method] = pathMethod
  return spec.getIn([
    "paths",
    path,
    method,
    "requestBody",
    "content",
    mediaType,
    "description",
  ])
}

/**
 * Selects reusable media types from components (OAS 3.2)
 */
export const selectMediaTypes = createSelector(
  specJsonWithResolvedSubtrees,
  (spec) => spec.getIn(["components", "mediaTypes"], Map())
)

/**
 * Selects a specific reusable media type by name
 */
export const selectMediaType = (state, system, mediaTypeName) => {
  const mediaTypes = selectMediaTypes(state)
  return mediaTypes.get(mediaTypeName)
}

/**
 * Selects itemSchema for streaming media types (OAS 3.2)
 */
export const selectItemSchema = (state, system, pathMethod, mediaType) => {
  const spec = specJsonWithResolvedSubtrees(state)
  const [path, method] = pathMethod
  return spec.getIn([
    "paths",
    path,
    method,
    "requestBody",
    "content",
    mediaType,
    "itemSchema",
  ])
}
