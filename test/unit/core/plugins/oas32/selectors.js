import { fromJS } from "immutable"
import { validOperationMethods } from "core/plugins/oas32/selectors"

describe("OAS 3.2 Selectors", function () {
  describe("validOperationMethods", function () {
    it("should include all standard HTTP methods plus QUERY", function () {
      const methods = validOperationMethods()

      expect(methods).toContain("get")
      expect(methods).toContain("put")
      expect(methods).toContain("post")
      expect(methods).toContain("delete")
      expect(methods).toContain("options")
      expect(methods).toContain("head")
      expect(methods).toContain("patch")
      expect(methods).toContain("trace")
      // New in OAS 3.2
      expect(methods).toContain("query")
    })

    it("should return 9 methods total", function () {
      const methods = validOperationMethods()
      expect(methods.length).toEqual(9)
    })
  })
})
