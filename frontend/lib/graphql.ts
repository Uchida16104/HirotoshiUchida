export async function getPosts() {
  const res = await fetch(
    "https://hirotoshiuchida.onrender.com/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            posts {
              nodes {
                title
                slug
                content
              }
            }
          }
        `
      })
    }
  );
  return res.json();
}

