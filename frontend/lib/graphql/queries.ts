// graphql/queries.ts
export const POST_QUERY = `
  query Post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      blocks {
        name
        renderedHtml
      }
    }
  }
`;
