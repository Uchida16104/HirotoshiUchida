import fs from 'node:fs';
import path from 'node:path';

const outDir = 'generated';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  'index','page','single','archive','taxonomy','author','date','404','maintenance'
];

const exts = ['php','html','vue','tsx','jsx','svelte','blade.php','hack'];

const targets = ['php','html','vue','tsx','jsx','svelte','blade.php','hack'];

const names = ['index','page','single','archive','taxonomy','author','date','404','maintenance'];

files.forEach(f => {
  exts.forEach(e => {
    const filePath = path.join(outDir, `${f}.${e}`);
    fs.writeFileSync(
      filePath,
      `<!-- ${f}.${e} generated -->`
    );
  });
});

for (const n of names)
  for (const t of targets)
    console.log(`${n}.${t} generated`);

