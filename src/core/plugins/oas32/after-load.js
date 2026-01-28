/**
 * @prettier
 */
import { wrapOAS32Fn } from "./fn"

function afterLoad({ fn, getSystem }) {
  // Wrap sample generation functions to be specific to OpenAPI 3.2 version
  // OAS 3.2 uses the same JSON Schema 2020-12 as OAS 3.1
  if (typeof fn.sampleFromSchema === "function" && fn.jsonSchema202012) {
    const wrappedFns = wrapOAS32Fn(
      {
        sampleFromSchema: fn.jsonSchema202012.sampleFromSchema,
        sampleFromSchemaGeneric: fn.jsonSchema202012.sampleFromSchemaGeneric,
        createXMLExample: fn.jsonSchema202012.createXMLExample,
        memoizedSampleFromSchema: fn.jsonSchema202012.memoizedSampleFromSchema,
        memoizedCreateXMLExample: fn.jsonSchema202012.memoizedCreateXMLExample,
        getJsonSampleSchema: fn.jsonSchema202012.getJsonSampleSchema,
        getYamlSampleSchema: fn.jsonSchema202012.getYamlSampleSchema,
        getXmlSampleSchema: fn.jsonSchema202012.getXmlSampleSchema,
        getSampleSchema: fn.jsonSchema202012.getSampleSchema,
        mergeJsonSchema: fn.jsonSchema202012.mergeJsonSchema,
      },
      getSystem()
    )

    Object.assign(this.fn, wrappedFns)
  }

  // OAS 3.2 recognizes the same file upload patterns as OAS 3.1
  if (fn.isFileUploadIntendedOAS31) {
    const { isFileUploadIntended: isFileUploadIntendedWrap } = wrapOAS32Fn(
      {
        isFileUploadIntended: fn.isFileUploadIntendedOAS31,
      },
      getSystem()
    )

    this.fn.isFileUploadIntended = isFileUploadIntendedWrap
  }

  // Wrap hasSchemaType for OAS 3.2 (same as OAS 3.1)
  if (fn.jsonSchema202012) {
    const { hasSchemaType } = wrapOAS32Fn(
      {
        hasSchemaType: fn.jsonSchema202012.hasSchemaType,
      },
      getSystem()
    )

    this.fn.hasSchemaType = hasSchemaType
  }
}

export default afterLoad
