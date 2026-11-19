import RedirectPage from '../../[shortUrl]/RedirectPage';
import { verifyTempToken } from '@/lib/tempLink';

export const dynamic = 'force-dynamic';

export default async function TempLinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = verifyTempToken(decodeURIComponent(token));

  if (result.error) {
    return (
      <RedirectPage
        destinationUrl={null}
        error={result.error === 'expired' ? 'This link has expired.' : 'This link is invalid.'}
      />
    );
  }

  return <RedirectPage destinationUrl={result.longUrl} />;
}
