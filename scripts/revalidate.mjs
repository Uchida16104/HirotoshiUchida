fetch('https://hirotoshiuchida.vercel.app/api/revalidate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
});

