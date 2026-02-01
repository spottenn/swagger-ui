/**
 * @prettier
 */
import constant from "lodash/constant"

/**
 * Valid operation methods for OAS 3.2
 * Includes all OAS 3.0/3.1 methods plus QUERY (new in 3.2)
 */
export const validOperationMethods = constant([
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
