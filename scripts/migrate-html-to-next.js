import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const jsx = html
  .replace(/class=/g, 'className=')
  .replace(/<!DOCTYPE html>/, '');

fs.writeFileSync(
  'frontend/app/page.tsx',
  `export default function Page(){return(${jsx})}`
);

