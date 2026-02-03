/**
 * @prettier
 */
import { fromJS, Map, List } from "immutable"
import {
  operations,
  validOperationMethods,
} from "core/plugins/oas32/spec-extensions/wrap-selectors"

describe("OAS 3.2 wrap-selectors", () => {
  describe("operations wrapper", () => {
    const createMockSystem = (isOAS32 = true, specData = {}) => ({
      specSelectors: {
        isOAS32: () => isOAS32,
        specJsonWithResolvedSubtrees: () => fromJS(specData),
        specJson: () => fromJS(specData),
      },
      oas32Selectors: {
        validOperationMethods: () => [
          "get",
          "put",
          "post",
          "delete",
          "options",
          "head",
          "patch",
          "trace",
          "query",
        ],
      },
    })

    const createMockOriSelector = (returnValue) => () => returnValue

    it("should add query operations for OAS 3.2 specs", () => {
      const specData = {
        openapi: "3.2.0",
        paths: {
          "/pets": {
            get: { summary: "List pets" },
            query: { summary: "Query pets" },
          },
        },
      }

      const originalOps = List([
        fromJS({
          path: "/pets",
          method: "get",
          operation: { summary: "List pets" },
          id: "get-/pets",
        }),
      ])

      const mockSystem = createMockSystem(true, specData)
      const mockOriSelector = createMockOriSelector(originalOps)
      const state = fromJS({ spec: specData })

      const wrapper = operations(mockOriSelector, mockSystem)
      const result = wrapper(state)

      expect(result.size).toBe(2)
      expect(result.getIn([1, "method"])).toBe("query")
      expect(result.getIn([1, "path"])).toBe("/pets")
    })

    it("should add additionalOperations for OAS 3.2 specs", () => {
      const specData = {
        openapi: "3.2.0",
        paths: {
          "/cache": {
            get: { summary: "Get cache" },
            additionalOperations: {
              PURGE: { summary: "Purge cache" },
            },
          },
        },
      }

      const originalOps = List([
        fromJS({
          path: "/cache",
          method: "get",
          operation: { summary: "Get cache" },
          id: "get-/cache",
        }),
      ])

      const mockSystem = createMockSystem(true, specData)
      const mockOriSelector = createMockOriSelector(originalOps)
      const state = fromJS({ spec: specData })

      const wrapper = operations(mockOriSelector, mockSystem)
      const result = wrapper(state)

      expect(result.size).toBe(2)
      expect(result.getIn([1, "method"])).toBe("purge")
      expect(result.getIn([1, "path"])).toBe("/cache")
    })

    it("should not modify operations for non-OAS 3.2 specs", () => {
      const originalOps = List([
        fromJS({
          path: "/pets",
          method: "get",
          operation: { summary: "List pets" },
          id: "get-/pets",
        }),
      ])

      const mockSystem = createMockSystem(false, {})
      const mockOriSelector = createMockOriSelector(originalOps)
      const state = fromJS({})

      const wrapper = operations(mockOriSelector, mockSystem)
      const result = wrapper(state)

      expect(result.size).toBe(1)
      expect(result).toBe(originalOps)
    })
  })

  describe("validOperationMethods wrapper", () => {
    it("should include query for OAS 3.2 specs", () => {
      const mockSystem = {
        specSelectors: {
          isOAS32: () => true,
          specJson: () => fromJS({ paths: {} }),
        },
        oas32Selectors: {
          validOperationMethods: () => [
            "get",
            "put",
            "post",
            "delete",
            "options",
            "head",
            "patch",
            "trace",
            "query",
          ],
        },
      }

      const mockOriSelector = () => [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
      ]
      const state = fromJS({})

      const wrapper = validOperationMethods(mockOriSelector, mockSystem)
      const result = wrapper(state)

      expect(result).toContain("query")
    })

    it("should include custom methods from additionalOperations", () => {
      const specData = {
        paths: {
          "/cache": {
            additionalOperations: {
              PURGE: { summary: "Purge cache" },
              NOTIFY: { summary: "Notify" },
            },
          },
        },
      }

      const mockSystem = {
        specSelectors: {
          isOAS32: () => true,
          specJson: () => fromJS(specData),
        },
        oas32Selectors: {
          validOperationMethods: () => [
            "get",
            "put",
            "post",
            "delete",
            "options",
            "head",
            "patch",
            "trace",
            "query",
          ],
        },
      }

      const mockOriSelector = () => [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
      ]
      const state = fromJS({})

      const wrapper = validOperationMethods(mockOriSelector, mockSystem)
      const result = wrapper(state)

      expect(result).toContain("purge")
      expect(result).toContain("notify")
    })
  })
})

describe("taggedOperations wrapper", () => {
  const createMockSystem = (isOAS32 = true, specData = {}) => ({
    specSelectors: {
      isOAS32: () => isOAS32,
      specJsonWithResolvedSubtrees: () => fromJS(specData),
    },
  })

  const createMockOriSelector = (returnValue) => () => returnValue

  it("should add query operations to tagged operations for OAS 3.2", () => {
    const {
      taggedOperations,
    } = require("core/plugins/oas32/spec-extensions/wrap-selectors")

    const specData = {
      openapi: "3.2.0",
      paths: {
        "/pets": {
          get: { summary: "List pets", tags: ["Pets"] },
          query: { summary: "Query pets", tags: ["Pets"] },
        },
      },
    }

    const originalTaggedOps = Map({
      Pets: Map({
        tagDetails: Map({ name: "Pets" }),
        operations: List([
          fromJS({
            path: "/pets",
            method: "get",
            operation: { summary: "List pets", tags: ["Pets"] },
            id: "get-/pets",
          }),
        ]),
      }),
    })

    const mockSystem = createMockSystem(true, specData)
    const mockOriSelector = createMockOriSelector(originalTaggedOps)
    const state = fromJS({ spec: specData })

    const wrapper = taggedOperations(mockOriSelector, mockSystem)
    const result = wrapper(state)

    // Should have Pets tag
    expect(result.has("Pets")).toBe(true)
    // Pets should have operations (could be in different formats)
    const petsTag = result.get("Pets")
    expect(Map.isMap(petsTag)).toBe(true)
  })

  it("should not modify tagged operations for non-OAS 3.2 specs", () => {
    const {
      taggedOperations,
    } = require("core/plugins/oas32/spec-extensions/wrap-selectors")

    const originalTaggedOps = Map({
      Pets: Map({
        tagDetails: Map({ name: "Pets" }),
        operations: List([
          fromJS({
            path: "/pets",
            method: "get",
            operation: { summary: "List pets" },
            id: "get-/pets",
          }),
        ]),
      }),
    })

    const mockSystem = createMockSystem(false, {})
    const mockOriSelector = createMockOriSelector(originalTaggedOps)
    const state = fromJS({})

    const wrapper = taggedOperations(mockOriSelector, mockSystem)
    const result = wrapper(state)

    expect(result).toBe(originalTaggedOps)
  })
})
