/**
 * @prettier
 */
import { List, Map, OrderedMap } from "immutable"
import { createSelector } from "reselect"

import { isOAS32 as isOAS32Fn } from "../fn"

const map = Map()

export const isOAS32 = createSelector(
  (state, system) => system.specSelectors.specJson(),
  isOAS32Fn
)

/**
 * Selects the default JSON Schema dialect for OAS 3.2.
 * OAS 3.2 continues to use JSON Schema 2020-12.
 */
export const selectJsonSchemaDialectDefault = () =>
  "https://spec.openapis.org/oas/3.1/dialect/base"

/**
 * Selects tags from the spec with enhanced OAS 3.2 fields.
 * OAS 3.2 adds parent, kind, and summary fields to tags.
 */
export const selectTags = () => (system) => {
  const tags = system.specSelectors.specJson().get("tags")
  return List.isList(tags) ? tags : List()
}

/**
 * Selects a structured tag hierarchy based on parent relationships.
 * Returns tags organized by their parent-child relationships.
 */
export const selectTagHierarchy = createSelector(
  (state, system) => system.specSelectors.specJson().get("tags", List()),
  (tags) => {
    if (!List.isList(tags)) return { roots: [], children: {} }

    const tagMap = {}
    const children = {}
    const roots = []

    // First pass: create tag map
    tags.forEach((tag) => {
      const name = tag.get("name")
      if (name) {
        tagMap[name] = tag.toJS()
        children[name] = []
      }
    })

    // Second pass: build hierarchy
    tags.forEach((tag) => {
      const name = tag.get("name")
      const parent = tag.get("parent")

      if (parent && tagMap[parent]) {
        children[parent].push(name)
      } else {
        roots.push(name)
      }
    })

    return { roots, children, tagMap }
  }
)

/**
 * Selects the kind field for a specific tag.
 * The kind field classifies tags (e.g., "navigation", "resource").
 */
export const selectTagKind = (state, tagName) => (system) => {
  const tags = system.specSelectors.specJson().get("tags", List())
  const tag = tags.find((t) => t.get("name") === tagName)
  return tag ? tag.get("kind") : null
}

/**
 * Selects the parent field for a specific tag.
 */
export const selectTagParent = (state, tagName) => (system) => {
  const tags = system.specSelectors.specJson().get("tags", List())
  const tag = tags.find((t) => t.get("name") === tagName)
  return tag ? tag.get("parent") : null
}

/**
 * Selects the summary field for a specific tag.
 */
export const selectTagSummary = (state, tagName) => (system) => {
  const tags = system.specSelectors.specJson().get("tags", List())
  const tag = tags.find((t) => t.get("name") === tagName)
  return tag ? tag.get("summary") : null
}

/**
 * Selects additional (non-standard) operations from a path item.
 * OAS 3.2 introduces additionalOperations for non-standard HTTP methods.
 */
export const selectAdditionalOperations = (state, path) => (system) => {
  const pathItem = system.specSelectors.specJson().getIn(["paths", path])
  if (!Map.isMap(pathItem)) return map

  const additionalOps = pathItem.get("additionalOperations")
  return Map.isMap(additionalOps) ? additionalOps : map
}

/**
 * Gets the valid operation methods including QUERY for OAS 3.2.
 * OAS 3.2 adds the QUERY HTTP method.
 */
export const validOperationMethods = () =>
  List([
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
    "query",
  ])

/**
 * Selects all operations including QUERY and additionalOperations.
 */
export const selectAllOperations = createSelector(
  [
    (state, system) => system.specSelectors.specJson().get("paths", map),
    (state, system) => system.specSelectors.validOperationMethods(),
  ],
  (paths, validMethods) => {
    if (!Map.isMap(paths)) return OrderedMap()

    return paths.reduce((allOps, pathItem, path) => {
      if (!Map.isMap(pathItem)) return allOps

      // Standard operations including query
      const standardOps = pathItem
        .filter((value, key) => validMethods.includes(key))
        .map((op, method) => op.set("__method", method).set("__path", path))

      // Additional operations (non-standard HTTP methods)
      const additionalOps = pathItem.get("additionalOperations", map)
      const additionalMapped = Map.isMap(additionalOps)
        ? additionalOps.map((op, method) =>
            op
              .set("__method", method)
              .set("__path", path)
              .set("__isAdditional", true)
          )
        : map

      return allOps.merge(standardOps).merge(additionalMapped)
    }, OrderedMap())
  }
)

/**
 * Selects the response summary field (new in OAS 3.2).
 * Response description is now optional, summary can be used instead.
 */
export const selectResponseSummary =
  (state, path, method, statusCode) => (system) => {
    const response = system.specSelectors
      .specJson()
      .getIn(["paths", path, method, "responses", statusCode])
    return response ? response.get("summary") : null
  }

/**
 * Selects reusable media types from components/mediaTypes.
 * New in OAS 3.2: components can contain reusable Media Type Objects.
 */
export const selectMediaTypes = () => (system) => {
  const mediaTypes = system.specSelectors
    .specJson()
    .getIn(["components", "mediaTypes"])
  return Map.isMap(mediaTypes) ? mediaTypes : map
}

/**
 * Selects OAuth 2.0 Device Authorization Grant configuration.
 * New in OAS 3.2: flows.deviceAuthorization for RFC 8628 support.
 */
export const selectDeviceAuthorizationFlow =
  (state, securitySchemeName) => (system) => {
    const securityScheme = system.specSelectors
      .specJson()
      .getIn(["components", "securitySchemes", securitySchemeName])

    if (!Map.isMap(securityScheme)) return null
    if (securityScheme.get("type") !== "oauth2") return null

    const flows = securityScheme.get("flows")
    if (!Map.isMap(flows)) return null

    return flows.get("deviceAuthorization")
  }

/**
 * Checks if a parameter uses the new querystring location.
 * OAS 3.2 adds in: querystring for handling entire query string.
 */
export const isQuerystringParameter = (parameter) => {
  return Map.isMap(parameter) && parameter.get("in") === "querystring"
}

/**
 * Selects all querystring parameters for an operation.
 */
export const selectQuerystringParameters =
  (state, path, method) => (system) => {
    const parameters = system.specSelectors
      .specJson()
      .getIn(["paths", path, method, "parameters"], List())

    return parameters.filter(isQuerystringParameter)
  }
