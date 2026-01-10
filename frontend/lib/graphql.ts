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

export const ALL_POSTS_QUERY = `
  query AllPosts {
    posts {
      nodes {
        slug
      }
    }
  }
`;
