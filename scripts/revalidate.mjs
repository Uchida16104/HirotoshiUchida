fetch('https://hirotoshi-uchida.vercel.app/api/revalidate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
});

