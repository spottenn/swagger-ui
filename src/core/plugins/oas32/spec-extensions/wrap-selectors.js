/**
 * @prettier
 */

import { createOnlyOAS32SelectorWrapper } from "../fn"
import { validOperationMethods as oas32ValidOperationMethods } from "./selectors"

/**
 * Wraps the isOAS3 selector to return true for OAS 3.2 specs.
 * This ensures all OAS3 features work for OAS 3.2 documents.
 */
export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }

/**
 * Wraps the isOAS31 selector to return true for OAS 3.2 specs.
 * OAS 3.2 is backwards compatible with OAS 3.1, so all OAS 3.1 features apply.
 */
export const isOAS31 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }

/**
 * Wraps validOperationMethods to include QUERY method for OAS 3.2.
 */
export const validOperationMethods = createOnlyOAS32SelectorWrapper(
  () => () => oas32ValidOperationMethods()
)
