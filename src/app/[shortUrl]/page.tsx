import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Url from '@/models/Url';

async function getUrl(shortUrl: string) {
  await dbConnect();
  const url = await Url.findOne({ shortUrl });
  return url;
}

export default async function ShortUrlPage({
  params,
}: {
  params: Promise<{ shortUrl: string }>;
}) {
  const { shortUrl } = await params;
  const url = await getUrl(shortUrl);

  if (url) {
    redirect(url.longUrl);
  } else {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-red-500">URL Not Found</h1>
        </div>
    );
  }
}
