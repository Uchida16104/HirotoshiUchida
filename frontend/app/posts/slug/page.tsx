import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamic = 'force-dynamic'; // <-- Disable static prerender

export async function generateStaticParams() {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, { cache: 'no-store' });
  const json = await res.json();

  const nodes = json?.data?.posts?.nodes || [];

  // Filter out invalid slugs
  return nodes
    .filter((p: any) => typeof p.slug === 'string' && p.slug.trim() !== '')
    .map((p: any) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
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

  const res = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    body: JSON.stringify({ query, variables: { slug: params.slug } }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    console.error('GraphQL fetch failed:', res.status, await res.text());
    notFound();
  }

  const json = await res.json();
  const post = json?.data?.post;

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title || 'Untitled Post'}</h1>
      {(post.blocks || []).map((block: any, i: number) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: block?.renderedHtml || '' }} />
      ))}
    </article>
  );
}
