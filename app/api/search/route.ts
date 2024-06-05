// app/api/search/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { keywords, fromDate, toDate, searchIn, language } = await request.json(); // We destructured the object received by the request
  console.log('Search parameters :', keywords, fromDate, toDate, searchIn, language);
  console.log('Key is correctly defined as', process.env.NEWS_API_KEY);
  console.log('The environment is: ', process.env.NODE_ENV);
  try {
    console.log('Entering the try block...');
    const requestPath = '/api/python';
    console.log('Request path:', requestPath);
    const response = await axios.post(requestPath, {
      keywords,
      fromDate,
      toDate,
      searchIn,
      language,
    });
    return NextResponse.json(response.data); // Return a NextResponse object containing the JSON encoded data in the body
    // The NextResponse.json(data, options) is a special method of Next.js which extends the normal Response.json method.
  } catch (error: any) {
    console.error('Error fetching articles:', error.response?.data || error.message); // Log detailed error information

    // Handle 404 error specifically
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'No articles found for the given search criteria' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error fetching articles' },
      { status: error.response?.status || 500 }
    );
  }
}
