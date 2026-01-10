// scripts/generate-samples.mjs
const frameworks = ['vue','nuxt','svelte','tsx','jsx','blade.php','hack', 'html'];
const names = ['index','page','single','archive','taxonomy','author','date','404','maintenance'];

for (const f of frameworks)
  for (const n of names)
    console.log(`samples/${f}/${n}.${f}`);

