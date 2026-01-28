/**
 * @prettier
 */
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
 * Wraps validOperationMethods to include QUERY for OAS 3.2
 */
export const validOperationMethods =
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.specSelectors.isOAS32()) {
      return system.oas32Selectors.validOperationMethods()
    }
    return oriSelector(...args)
  }

/**
 * Wraps selectJsonSchemaDialectDefault for OAS 3.2
 */
export const selectJsonSchemaDialectDefault = createOnlyOAS32SelectorWrapper(
  () => () => "https://spec.openapis.org/oas/3.2/dialect/2025-09-17"
)
