import { ALL_POSTS_QUERY, POST_QUERY } from '../../../lib/graphql/queries';

export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, { cache: 'no-store' });
  const json = await res.json();

  if (!json?.data?.posts?.nodes) {
    return [];
  }

  return json.data.posts.nodes.map((p: any) => ({ slug: p.slug }));
}

export default async function Page({ params }: any) {
  if (!params?.slug) {
    return <p>Invalid slug</p>;
  }

  const res = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: POST_QUERY, variables: { slug: params.slug } }),
  });

  const json = await res.json();

  if (!json?.data?.post) {
    return <p>Post not found</p>;
  }

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
