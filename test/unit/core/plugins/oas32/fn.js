import { fromJS } from "immutable"
import { isOAS32 } from "core/plugins/oas32/fn"

const isOAS32Shorthand = (version) =>
  isOAS32(
    fromJS({
      openapi: version,
    })
  )

describe("isOAS32", function () {
  it("should recognize valid OAS 3.2 version values", function () {
    expect(isOAS32Shorthand("3.2.0")).toEqual(true)
    expect(isOAS32Shorthand("3.2.1")).toEqual(true)
    expect(isOAS32Shorthand("3.2.25")).toEqual(true)
    expect(isOAS32Shorthand("3.2.100")).toEqual(true)
  })

  it("should fail for invalid OAS 3.2 version values", function () {
    expect(isOAS32Shorthand("3.2")).toEqual(false)
    expect(isOAS32Shorthand("3.2.")).toEqual(false)
    expect(isOAS32Shorthand("3.2.01")).toEqual(false) // leading zero
    expect(isOAS32Shorthand("2.0")).toEqual(false)
    expect(isOAS32Shorthand("3.0.0")).toEqual(false)
    expect(isOAS32Shorthand("3.1.0")).toEqual(false)
    expect(isOAS32Shorthand("3.3.0")).toEqual(false)
  })

  it("should gracefully fail for non-string values", function () {
    expect(isOAS32Shorthand(3.2)).toEqual(false)
    expect(isOAS32Shorthand(3)).toEqual(false)
    expect(isOAS32Shorthand({})).toEqual(false)
    expect(isOAS32Shorthand(null)).toEqual(false)
    expect(isOAS32Shorthand(undefined)).toEqual(false)
  })

  it("should gracefully fail when `openapi` field is missing", function () {
    expect(
      isOAS32(
        fromJS({
          openApi: "3.2.0", // wrong casing
        })
      )
    ).toEqual(false)
    expect(isOAS32Shorthand(null)).toEqual(false)
  })
})
