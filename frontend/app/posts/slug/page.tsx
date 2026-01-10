export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, { cache: 'no-store' });
  const json = await res.json();
  return json.data.posts.nodes.map((p:any)=>({slug:p.slug}));
}

export default async function Page({ params }: any) {
  return <article>{params.slug}</article>;
}

query Post($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    title
    blocks {
      name
      renderedHtml
    }
  }
}
