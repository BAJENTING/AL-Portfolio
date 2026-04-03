import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.HOMESPH_NEWS_API_KEY;
  const apiUrl = `${process.env.HOMESPH_NEWS_API_URL}/api/v1/articles`;

  if (!apiKey) {
    console.error('Missing HOMESPH_NEWS_API_KEY');
    return NextResponse.json({ error: 'API key configuration missing' }, { status: 500 });
  }

  if (!process.env.HOMESPH_NEWS_API_URL) {
    console.error('Missing HOMESPH_NEWS_API_URL');
    return NextResponse.json({ error: 'API URL configuration missing' }, { status: 500 });
  }

  try {
    console.log('Fetching news from:', apiUrl);
    const response = await fetch(apiUrl, {
      headers: {
        'X-Site-Api-Key': apiKey,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`News API Error (${response.status}):`, errorText);
      return NextResponse.json({ 
        error: `Failed to fetch news from upstream: ${response.status}`,
        details: errorText.substring(0, 100)
      }, { status: response.status });
    }

    const data = await response.json();
    // Documentation says result.data.data is the actual array of articles
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('News Proxy Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
