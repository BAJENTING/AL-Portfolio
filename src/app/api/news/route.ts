import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.HOMESPH_NEWS_API_KEY;
  const apiUrl = `${process.env.HOMESPH_NEWS_API_URL}/api/v1/articles`;

  if (!apiKey || !process.env.HOMESPH_NEWS_API_URL) {
    return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Site-Api-Key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 0 } // Disable cache for debugging
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API Error:', errorText);
      return NextResponse.json({ error: `Failed to fetch news: ${response.status}` }, { status: response.status });
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
