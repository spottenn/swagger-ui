/**
 * @prettier
 */
import StructuredTags from "./components/structured-tags"
import ResponseSummary from "./components/response-summary"
import {
  isOAS32 as isOAS32Fn,
  createOnlyOAS32Selector as createOnlyOAS32SelectorFn,
  createOnlyOAS32SelectorWrapper as createOnlyOAS32SelectorWrapperFn,
  createOnlyOAS32ComponentWrapper as createOnlyOAS32ComponentWrapperFn,
} from "./fn"
import {
  isOAS32 as selectIsOAS32,
  selectJsonSchemaDialectDefault,
  selectTags,
  selectTagHierarchy,
  selectTagKind,
  selectTagParent,
  selectTagSummary,
  selectAdditionalOperations,
  selectAllOperations,
  selectResponseSummary,
  selectMediaTypes,
  selectDeviceAuthorizationFlow,
  selectQuerystringParameters,
} from "./spec-extensions/selectors"
import {
  isOAS3 as isOAS3WrapSelector,
  isOAS31 as isOAS31WrapSelector,
  validOperationMethods as validOperationMethodsWrapSelector,
} from "./spec-extensions/wrap-selectors"
import { definitionsToAuthorize as definitionsToAuthorizeWrapper } from "./auth-extensions/wrap-selectors"
import afterLoad from "./after-load"

const OAS32Plugin = ({ fn }) => {
  const createOnlyOAS32Selector =
    fn.createOnlyOAS32Selector || createOnlyOAS32SelectorFn

  return {
    afterLoad,
    fn: {
      isOAS32: isOAS32Fn,
      createOnlyOAS32Selector: createOnlyOAS32SelectorFn,
      createOnlyOAS32SelectorWrapper: createOnlyOAS32SelectorWrapperFn,
      createOnlyOAS32ComponentWrapper: createOnlyOAS32ComponentWrapperFn,
    },
    components: {
      OAS32StructuredTags: StructuredTags,
      OAS32ResponseSummary: ResponseSummary,
    },
    wrapComponents: {},
    statePlugins: {
      auth: {
        wrapSelectors: {
          definitionsToAuthorize: definitionsToAuthorizeWrapper,
        },
      },
      spec: {
        selectors: {
          isOAS32:
            (state, ...args) =>
            (system) => {
              return selectIsOAS32(state, system, ...args)
            },

          // Tag hierarchy selectors (new in OAS 3.2)
          selectTags,
          selectTagHierarchy: createOnlyOAS32Selector(selectTagHierarchy),
          selectTagKind: createOnlyOAS32Selector(selectTagKind),
          selectTagParent: createOnlyOAS32Selector(selectTagParent),
          selectTagSummary: createOnlyOAS32Selector(selectTagSummary),

          // Additional operations (new in OAS 3.2)
          selectAdditionalOperations: createOnlyOAS32Selector(selectAdditionalOperations), // prettier-ignore
          selectAllOperations: createOnlyOAS32Selector(selectAllOperations),

          // Response enhancements (new in OAS 3.2)
          selectResponseSummary: createOnlyOAS32Selector(selectResponseSummary),

          // Reusable media types (new in OAS 3.2)
          selectMediaTypes: createOnlyOAS32Selector(selectMediaTypes),

          // Querystring parameter location (new in OAS 3.2)
          selectQuerystringParameters: createOnlyOAS32Selector(selectQuerystringParameters), // prettier-ignore

          // JSON Schema dialect default (same as OAS 3.1)
          selectJsonSchemaDialectDefault,
        },
        wrapSelectors: {
          isOAS3: isOAS3WrapSelector,
          isOAS31: isOAS31WrapSelector,
          validOperationMethods: validOperationMethodsWrapSelector,
        },
      },
      oas32: {
        selectors: {
          // OAuth 2.0 Device Authorization Grant (new in OAS 3.2)
          selectDeviceAuthorizationFlow: createOnlyOAS32Selector(selectDeviceAuthorizationFlow), // prettier-ignore
        },
      },
    },
  }
}

export default OAS32Plugin
