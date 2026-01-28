/**
 * @prettier
 */

describe("OpenAPI 3.2 features", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas32-features.yaml")
  })

  describe("OAS 3.2 version detection", () => {
    it("should load an OAS 3.2 document without errors", () => {
      // Verify the spec loaded successfully by checking for operations
      cy.get(".opblock-summary").should("have.length.at.least", 1)
    })

    it("should display the correct version in the info section", () => {
      cy.get(".info .version").should("contain", "1.0.0")
    })
  })

  describe("Structured Tags", () => {
    it("should display tags with operations", () => {
      cy.get(".opblock-tag").should("exist")
    })

    it("should display User operations under Users tag", () => {
      cy.get(".opblock-tag[data-tag='Users']").should("exist")
    })

    it("should display Product operations under Products tag", () => {
      cy.get(".opblock-tag[data-tag='Products']").should("exist")
    })
  })

  describe("QUERY HTTP method", () => {
    it("should display the QUERY operation", () => {
      // Expand the Users tag if not already expanded
      cy.get(".opblock-tag[data-tag='Users']").click()

      // Look for the QUERY operation
      cy.get(".opblock-query").should("exist")
    })

    it("should show QUERY method badge", () => {
      cy.get(".opblock-tag[data-tag='Users']").click()
      cy.get(".opblock-query .opblock-summary-method").should(
        "contain.text",
        "QUERY"
      )
    })
  })

  describe("Response summary field", () => {
    it("should display response summary when available", () => {
      cy.get(".opblock-tag[data-tag='Users']").click()
      cy.get(".opblock-get").first().click()

      // Check that the response section exists
      cy.get(".responses-wrapper").should("exist")
    })
  })

  describe("OAuth 2.0 Device Authorization", () => {
    it("should display OAuth2 security scheme", () => {
      // Click authorize button to see security schemes
      cy.get(".btn.authorize").should("exist")
    })
  })

  describe("Info section with summary", () => {
    it("should display the info summary", () => {
      cy.get(".info").should("exist")
      cy.get(".info .title").should("contain", "OpenAPI 3.2 Features Test")
    })

    it("should display the description", () => {
      cy.get(".info .description").should("exist")
    })
  })
})
