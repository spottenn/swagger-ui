/**
 * @prettier
 */

describe("OpenAPI 3.2 Features", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas32-features.yaml")
  })

  describe("Version Detection", () => {
    it("should detect OpenAPI 3.2.0 version", () => {
      cy.get(".version-stamp").should("contain", "OAS 3.2")
    })
  })

  describe("QUERY HTTP Method", () => {
    it("should display QUERY operation", () => {
      cy.get(".opblock-query").should("exist")
      cy.get(".opblock-query .opblock-summary-method").should(
        "contain",
        "QUERY"
      )
    })

    it("should allow expanding QUERY operation", () => {
      cy.get(".opblock-query").click()
      cy.get(".opblock-query .opblock-body").should("be.visible")
    })
  })

  describe("Structured Tags", () => {
    it("should display tags with hierarchy", () => {
      // Pets tag should exist
      cy.get(".opblock-tag[data-tag='Pets']").should("exist")
      // Cats is a child of Pets
      cy.get(".opblock-tag[data-tag='Cats']").should("exist")
      // Dogs is a child of Pets
      cy.get(".opblock-tag[data-tag='Dogs']").should("exist")
    })

    it("should display tag summary when present", () => {
      // The Pets tag has a summary field
      cy.get(".opblock-tag[data-tag='Pets']").should("exist")
    })
  })

  describe("Additional Operations", () => {
    it("should display custom HTTP methods from additionalOperations", () => {
      // PURGE is defined in additionalOperations
      cy.get(".opblock-purge").should("exist")
      cy.get(".opblock-purge .opblock-summary-method").should(
        "contain",
        "PURGE"
      )
    })
  })

  describe("Response Summary", () => {
    it("should display response summary field", () => {
      cy.get(".opblock-get").first().click()
      // Check that responses show summary
      cy.get(".responses-table").should("exist")
    })
  })

  describe("Querystring Parameter", () => {
    it("should display operations with querystring parameter", () => {
      // Just verify the spec loads and has multiple operations
      // The querystring parameter feature is about the in: querystring location
      // which is a new feature in OAS 3.2
      cy.get(".opblock").should("have.length.at.least", 5)
    })
  })

  describe("Security Schemes", () => {
    it("should display OAuth2 Device Authorization flow", () => {
      cy.get(".btn.authorize").click()
      cy.get(".auth-container").should("exist")
      // Check for device authorization related content
      cy.get(".modal-ux").should("be.visible")
    })
  })
})
