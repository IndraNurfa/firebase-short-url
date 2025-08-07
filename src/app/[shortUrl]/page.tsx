import dbConnect from '@/lib/db';
import Url from '@/models/Url';
import RedirectPage from './RedirectPage';

async function getUrl(shortUrl: string) {
  try {
    await dbConnect();
    const url = await Url.findOne({ shortUrl });
    return { destinationUrl: url?.longUrl, error: null };
  } catch (e) {
    console.error('error', e);
    return { destinationUrl: null, error: 'A database error occurred.' };
  }
}

export default async function ShortUrlPage({
  params,
}: {
  params: Promise<{ shortUrl: string }>;
}) {
  const { shortUrl } = await params;
  const { destinationUrl, error } = await getUrl(shortUrl);

  return <RedirectPage destinationUrl={destinationUrl} error={error} />;
}
