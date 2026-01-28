import { fromJS, List, Map } from "immutable"
import {
  selectTagHierarchy,
  validOperationMethods,
  isQuerystringParameter,
} from "core/plugins/oas32/spec-extensions/selectors"

describe("OAS 3.2 selectors", function () {
  describe("validOperationMethods", function () {
    it("should include the QUERY method", function () {
      const methods = validOperationMethods()

      expect(methods.includes("query")).toEqual(true)
    })

    it("should include all standard HTTP methods", function () {
      const methods = validOperationMethods()

      expect(methods.includes("get")).toEqual(true)
      expect(methods.includes("post")).toEqual(true)
      expect(methods.includes("put")).toEqual(true)
      expect(methods.includes("delete")).toEqual(true)
      expect(methods.includes("patch")).toEqual(true)
      expect(methods.includes("options")).toEqual(true)
      expect(methods.includes("head")).toEqual(true)
      expect(methods.includes("trace")).toEqual(true)
    })
  })

  describe("selectTagHierarchy", function () {
    it("should build tag hierarchy from parent relationships", function () {
      const state = fromJS({})
      const tags = fromJS([
        { name: "Root1", kind: "navigation" },
        { name: "Root2", kind: "navigation" },
        { name: "Child1", parent: "Root1", kind: "resource" },
        { name: "Child2", parent: "Root1", kind: "resource" },
        { name: "GrandChild", parent: "Child1", kind: "resource" },
      ])

      const result = selectTagHierarchy.resultFunc(tags)

      expect(result.roots).toContain("Root1")
      expect(result.roots).toContain("Root2")
      expect(result.roots).not.toContain("Child1")
      expect(result.children["Root1"]).toContain("Child1")
      expect(result.children["Root1"]).toContain("Child2")
      expect(result.children["Child1"]).toContain("GrandChild")
    })

    it("should handle empty tags list", function () {
      const result = selectTagHierarchy.resultFunc(List())

      expect(result.roots).toEqual([])
      expect(result.children).toEqual({})
    })

    it("should handle tags without parent (all roots)", function () {
      const tags = fromJS([
        { name: "Tag1", summary: "First tag" },
        { name: "Tag2", summary: "Second tag" },
      ])

      const result = selectTagHierarchy.resultFunc(tags)

      expect(result.roots).toContain("Tag1")
      expect(result.roots).toContain("Tag2")
      expect(result.roots.length).toEqual(2)
    })

    it("should store tag metadata in tagMap", function () {
      const tags = fromJS([
        {
          name: "Users",
          summary: "User operations",
          kind: "resource",
          description: "User management",
        },
      ])

      const result = selectTagHierarchy.resultFunc(tags)

      expect(result.tagMap["Users"]).toBeDefined()
      expect(result.tagMap["Users"].name).toEqual("Users")
      expect(result.tagMap["Users"].summary).toEqual("User operations")
      expect(result.tagMap["Users"].kind).toEqual("resource")
      expect(result.tagMap["Users"].description).toEqual("User management")
    })
  })

  describe("isQuerystringParameter", function () {
    it("should return true for querystring parameters", function () {
      const param = fromJS({
        name: "rawQuery",
        in: "querystring",
        schema: { type: "string" },
      })

      expect(isQuerystringParameter(param)).toEqual(true)
    })

    it("should return false for query parameters", function () {
      const param = fromJS({
        name: "filter",
        in: "query",
        schema: { type: "string" },
      })

      expect(isQuerystringParameter(param)).toEqual(false)
    })

    it("should return false for path parameters", function () {
      const param = fromJS({
        name: "id",
        in: "path",
        schema: { type: "string" },
      })

      expect(isQuerystringParameter(param)).toEqual(false)
    })

    it("should return false for non-Map values", function () {
      expect(isQuerystringParameter(null)).toEqual(false)
      expect(isQuerystringParameter(undefined)).toEqual(false)
      expect(isQuerystringParameter("string")).toEqual(false)
    })
  })
})
