import { fromJS } from "immutable"
import { isOAS32 } from "core/plugins/oas32/fn"

const isOAS32Shorthand = (version) =>
  isOAS32(
    fromJS({
      openapi: version,
    })
  )

describe("isOAS32", function () {
  it("should recognize valid OAS32 version values", function () {
    expect(isOAS32Shorthand("3.2.0")).toEqual(true)
    expect(isOAS32Shorthand("3.2.1")).toEqual(true)
    expect(isOAS32Shorthand("3.2.25")).toEqual(true)
  })

  it("should fail for OAS31 version values", function () {
    expect(isOAS32Shorthand("3.1.0")).toEqual(false)
    expect(isOAS32Shorthand("3.1.1")).toEqual(false)
  })

  it("should fail for OAS30 version values", function () {
    expect(isOAS32Shorthand("3.0.0")).toEqual(false)
    expect(isOAS32Shorthand("3.0.3")).toEqual(false)
  })

  it("should fail for invalid OAS32 version values", function () {
    expect(isOAS32Shorthand("3.2")).toEqual(false)
    expect(isOAS32Shorthand("3.2.")).toEqual(false)
    expect(isOAS32Shorthand("3.2.01")).toEqual(false)
    expect(isOAS32Shorthand("2.0")).toEqual(false)
  })

  it("should gracefully fail for non-string values", function () {
    expect(isOAS32Shorthand(3.2)).toEqual(false)
    expect(isOAS32Shorthand(3)).toEqual(false)
    expect(isOAS32Shorthand({})).toEqual(false)
    expect(isOAS32Shorthand(null)).toEqual(false)
  })

  it("should gracefully fail when `openapi` field is missing", function () {
    expect(
      isOAS32(
        fromJS({
          openApi: "3.2.0",
        })
      )
    ).toEqual(false)
    expect(isOAS32Shorthand(null)).toEqual(false)
  })
})
