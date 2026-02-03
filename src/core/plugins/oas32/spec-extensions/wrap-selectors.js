/**
 * @prettier
 */
import { fromJS, Map, List } from "immutable"
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Wraps isOAS3 selector to return true for OAS 3.2.x specs
 * This ensures OAS 3.2 specs are treated as OAS 3 compatible
 */
export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }

/**
 * Wraps isOAS31 selector to return true for OAS 3.2.x specs
 * OAS 3.2 is backward compatible with OAS 3.1, so it inherits all 3.1 features
 */
export const isOAS31 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }

/**
 * Wraps validOperationMethods to include QUERY and additionalOperations methods for OAS 3.2
 */
export const validOperationMethods =
  (oriSelector, system) =>
  (state, ...args) => {
    if (!system.specSelectors.isOAS32()) {
      return oriSelector(...args)
    }

    // Start with base OAS 3.2 methods (includes query)
    const baseMethods = system.oas32Selectors.validOperationMethods()
    const methods = [...baseMethods]

    // Add any custom methods from additionalOperations
    try {
      const spec = system.specSelectors.specJson()
      const paths = spec.get("paths")
      if (paths && typeof paths.forEach === "function") {
        paths.forEach((pathItem) => {
          if (pathItem && typeof pathItem.get === "function") {
            const additionalOps = pathItem.get("additionalOperations")
            if (additionalOps && typeof additionalOps.forEach === "function") {
              additionalOps.forEach((_, method) => {
                const lowerMethod = method.toLowerCase()
                if (!methods.includes(lowerMethod)) {
                  methods.push(lowerMethod)
                }
              })
            }
          }
        })
      }
    } catch (e) {
      // If we can't access the spec, just return base methods
    }

    return methods
  }

/**
 * Wraps selectJsonSchemaDialectDefault for OAS 3.2
 */
export const selectJsonSchemaDialectDefault = createOnlyOAS32SelectorWrapper(
  () => () => "https://spec.openapis.org/oas/3.2/dialect/2025-09-17"
)

/**
 * Helper function to extract additional operations from paths
 */
const getAdditionalOps = (paths) => {
  let additionalOps = List()

  if (!Map.isMap(paths)) {
    return additionalOps
  }

  paths.forEach((pathItem, pathName) => {
    if (!pathItem || !Map.isMap(pathItem)) {
      return
    }

    // Handle QUERY method (OAS 3.2)
    const queryOp = pathItem.get("query")
    if (Map.isMap(queryOp)) {
      additionalOps = additionalOps.push(
        fromJS({
          path: pathName,
          method: "query",
          operation: queryOp,
          id: `query-${pathName}`,
        })
      )
    }

    // Handle additionalOperations (custom HTTP methods in OAS 3.2)
    const additionalOperations = pathItem.get("additionalOperations")
    if (Map.isMap(additionalOperations)) {
      additionalOperations.forEach((operation, method) => {
        if (Map.isMap(operation)) {
          additionalOps = additionalOps.push(
            fromJS({
              path: pathName,
              method: method.toLowerCase(),
              operation,
              id: `${method.toLowerCase()}-${pathName}`,
            })
          )
        }
      })
    }
  })

  return additionalOps
}

/**
 * Wraps operations selector to include QUERY method and additionalOperations for OAS 3.2
 * Note: This is kept for completeness but taggedOperations wrapper is the main fix
 */
export const operations =
  (oriSelector, system) =>
  (state, ...args) => {
    const originalOperations = oriSelector(state, ...args)
    const isOAS32 = system.specSelectors.isOAS32()

    if (!isOAS32) {
      return originalOperations
    }

    const spec = system.specSelectors.specJsonWithResolvedSubtrees()
    const paths = spec.get("paths")

    const additionalOps = getAdditionalOps(paths)
    return originalOperations.concat(additionalOps)
  }

/**
 * Wraps taggedOperations to properly inject QUERY and additionalOperations for OAS 3.2
 * This is necessary because the base selector chain (operations -> operationsWithRootInherited
 * -> operationsWithTags -> taggedOperations) uses direct references to the original operations
 * selector, bypassing the wrap-selector system.
 */
export const taggedOperations =
  (oriSelector, system) =>
  (state, ...args) => {
    // Get the original tagged operations
    const originalResult = oriSelector(state, ...args)

    const isOAS32 = system.specSelectors.isOAS32()
    if (!isOAS32) {
      return originalResult
    }

    const spec = system.specSelectors.specJsonWithResolvedSubtrees()
    const paths = spec.get("paths")
    const additionalOps = getAdditionalOps(paths)

    if (additionalOps.size === 0) {
      return originalResult
    }

    // Add each additional operation to its appropriate tag
    let updatedResult = originalResult
    additionalOps.forEach((op) => {
      const tags = op.getIn(["operation", "tags"], List())
      if (tags.size === 0) {
        // No tags - add to default
        updatedResult = updatedResult.update("default", List(), (ops) =>
          ops.push(op)
        )
      } else {
        tags.forEach((tag) => {
          if (updatedResult.has(tag)) {
            updatedResult = updatedResult.update(tag, List(), (ops) => {
              // Get the operations list from the tag object
              if (Map.isMap(ops)) {
                return ops.update("operations", List(), (innerOps) =>
                  innerOps.push(op)
                )
              }
              return ops.push(op)
            })
          } else {
            // Tag doesn't exist - create it
            updatedResult = updatedResult.set(
              tag,
              Map({
                tagDetails: Map({ name: tag }),
                operations: List([op]),
              })
            )
          }
        })
      }
    })

    return updatedResult
  }
