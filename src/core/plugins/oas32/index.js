/**
 * @prettier
 */
import VersionPragmaFilter from "./components/version-pragma-filter"
import DeviceAuthorizationAuth from "./components/auth/device-authorization-auth"
import StructuredTag from "./components/tags/structured-tag"
import ResponseSummary from "./components/response-summary"
import VersionPragmaFilterWrapper from "./wrap-components/version-pragma-filter"
import AuthItemWrapper from "./wrap-components/auth/auth-item"
import OpenAPIVersionWrapper from "./wrap-components/openapi-version"
import {
  isOAS32 as isOAS32Fn,
  createOnlyOAS32Selector as createOnlyOAS32SelectorFn,
  createSystemSelector as createSystemSelectorFn,
} from "./fn"
import {
  isOAS32 as selectIsOAS32,
  selectTags,
  selectTagDetails,
  selectTagParentField,
  selectTagKindField,
  selectTagSummaryField,
  selectHierarchicalTags,
  selectAdditionalOperations,
  selectAllOperationsForPath,
  selectResponseSummary,
  selectServerName,
  selectPathItemName,
  selectMediaTypeDescription,
  selectMediaTypes,
  selectMediaType,
  selectItemSchema,
} from "./spec-extensions/selectors"
import {
  isOAS3 as isOAS3SelectorWrapper,
  isOAS31 as isOAS31SelectorWrapper,
  validOperationMethods as validOperationMethodsWrapper,
  selectJsonSchemaDialectDefault as selectJsonSchemaDialectDefaultWrapper,
  operations as operationsWrapper,
  taggedOperations as taggedOperationsWrapper,
} from "./spec-extensions/wrap-selectors"
import { definitionsToAuthorize as definitionsToAuthorizeWrapper } from "./auth-extensions/wrap-selectors"
import {
  selectDeviceAuthorizationFlow,
  hasDeviceAuthorizationFlow,
  selectOAuth2MetadataUrl,
  isSecuritySchemeDeprecated,
  selectDeviceAuthorizationUrl,
  selectDeviceAuthorizationTokenUrl,
  selectDeviceAuthorizationScopes,
} from "./auth-extensions/selectors"
import { validOperationMethods } from "./selectors"

/**
 * OpenAPI 3.2 Plugin
 *
 * This plugin adds support for OpenAPI 3.2.x specifications.
 * OAS 3.2 is backward compatible with OAS 3.1, so this plugin extends
 * the OAS31 plugin while adding new features:
 *
 * New Features:
 * - QUERY HTTP method (new idempotent method for request bodies)
 * - additionalOperations (custom HTTP methods beyond standard verbs)
 * - querystring parameter location (in: querystring)
 * - Structured tags (parent, kind, summary fields)
 * - OAuth 2.0 Device Authorization flow
 * - oauth2MetadataUrl and deprecated fields on security schemes
 * - Response summary field (description now optional)
 * - components/mediaTypes for reusable Media Type Objects
 * - Server/PathItem name fields
 * - Media Type description and itemSchema fields
 */
const OAS32Plugin = ({ fn }) => {
  const createSystemSelector = fn.createSystemSelector || createSystemSelectorFn
  const createOnlyOAS32Selector = fn.createOnlyOAS32Selector || createOnlyOAS32SelectorFn // prettier-ignore

  return {
    fn: {
      isOAS32: isOAS32Fn,
      createSystemSelector: createSystemSelectorFn,
      createOnlyOAS32Selector: createOnlyOAS32SelectorFn,
    },
    components: {
      DeviceAuthorizationAuth,
      StructuredTag,
      ResponseSummary,
      OAS32VersionPragmaFilter: VersionPragmaFilter,
    },
    wrapComponents: {
      VersionPragmaFilter: VersionPragmaFilterWrapper,
      AuthItem: AuthItemWrapper,
      OpenAPIVersion: OpenAPIVersionWrapper,
    },
    statePlugins: {
      auth: {
        wrapSelectors: {
          definitionsToAuthorize: definitionsToAuthorizeWrapper,
        },
      },
      spec: {
        selectors: {
          isOAS32: createSystemSelector(selectIsOAS32),

          // Tag selectors (OAS 3.2 structured tags)
          selectTags,
          selectTagDetails: createSystemSelector(selectTagDetails),
          selectTagParentField: createOnlyOAS32Selector(createSystemSelector(selectTagParentField)), // prettier-ignore
          selectTagKindField: createOnlyOAS32Selector(createSystemSelector(selectTagKindField)), // prettier-ignore
          selectTagSummaryField: createOnlyOAS32Selector(createSystemSelector(selectTagSummaryField)), // prettier-ignore
          selectHierarchicalTags: createOnlyOAS32Selector(selectHierarchicalTags), // prettier-ignore

          // Operation selectors (additionalOperations)
          selectAdditionalOperations: createOnlyOAS32Selector(createSystemSelector(selectAdditionalOperations)), // prettier-ignore
          selectAllOperationsForPath: createOnlyOAS32Selector(createSystemSelector(selectAllOperationsForPath)), // prettier-ignore

          // Response selectors
          selectResponseSummary: createOnlyOAS32Selector(createSystemSelector(selectResponseSummary)), // prettier-ignore

          // Server/PathItem selectors
          selectServerName: createOnlyOAS32Selector(createSystemSelector(selectServerName)), // prettier-ignore
          selectPathItemName: createOnlyOAS32Selector(createSystemSelector(selectPathItemName)), // prettier-ignore

          // Media Type selectors
          selectMediaTypeDescription: createOnlyOAS32Selector(createSystemSelector(selectMediaTypeDescription)), // prettier-ignore
          selectMediaTypes: createOnlyOAS32Selector(selectMediaTypes),
          selectMediaType: createOnlyOAS32Selector(createSystemSelector(selectMediaType)), // prettier-ignore
          selectItemSchema: createOnlyOAS32Selector(createSystemSelector(selectItemSchema)), // prettier-ignore
        },
        wrapSelectors: {
          isOAS3: isOAS3SelectorWrapper,
          isOAS31: isOAS31SelectorWrapper,
          validOperationMethods: validOperationMethodsWrapper,
          selectJsonSchemaDialectDefault: selectJsonSchemaDialectDefaultWrapper,
          operations: operationsWrapper,
          taggedOperations: taggedOperationsWrapper,
        },
      },
      oas32: {
        selectors: {
          validOperationMethods,
          // Auth selectors for OAS 3.2 features
          selectDeviceAuthorizationFlow: createOnlyOAS32Selector(selectDeviceAuthorizationFlow), // prettier-ignore
          hasDeviceAuthorizationFlow: createOnlyOAS32Selector(hasDeviceAuthorizationFlow), // prettier-ignore
          selectOAuth2MetadataUrl: createOnlyOAS32Selector(selectOAuth2MetadataUrl), // prettier-ignore
          isSecuritySchemeDeprecated: createOnlyOAS32Selector(isSecuritySchemeDeprecated), // prettier-ignore
          selectDeviceAuthorizationUrl: createOnlyOAS32Selector(selectDeviceAuthorizationUrl), // prettier-ignore
          selectDeviceAuthorizationTokenUrl: createOnlyOAS32Selector(selectDeviceAuthorizationTokenUrl), // prettier-ignore
          selectDeviceAuthorizationScopes: createOnlyOAS32Selector(selectDeviceAuthorizationScopes), // prettier-ignore
        },
      },
    },
  }
}

export default OAS32Plugin
