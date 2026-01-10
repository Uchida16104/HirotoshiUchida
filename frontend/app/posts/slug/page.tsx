export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, { cache: 'no-store' });
  const json = await res.json();
  return json.data.posts.nodes.map((p: any) => ({ slug: p.slug }));
}

export default async function Page({ params }: any) {
  // Define the GraphQL query as a string
  const query = `
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

  // Fetch post data
  const res = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug: params.slug } }),
  });
  const json = await res.json();

  const post = json.data.post;

  return (
    <article>
      <h1>{post.title}</h1>
      {post.blocks.map((block: any, i: number) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: block.renderedHtml }} />
      ))}
    </article>
  );
}

