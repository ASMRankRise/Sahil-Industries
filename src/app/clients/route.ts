import { sourcePage } from '@/lib/source-page';

export const runtime = 'nodejs';

export function GET() {
  return sourcePage('clients.html');
}
