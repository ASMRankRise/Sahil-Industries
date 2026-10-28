import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function sourcePage(fileName: string) {
  const page = await readFile(path.join(process.cwd(), 'public', fileName), 'utf8');
  return new Response(page, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
