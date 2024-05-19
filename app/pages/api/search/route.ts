// app/api/search/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { keywords, fromDate, toDate, searchIn, language } = await request.json(); //We destructured the object received by the request
  console.log(language);
  try {
    const response = await axios.post('http://localhost:8000/search', {
      //uses fetch under the woord, resolves to a response object
      keywords,
      fromDate,
      toDate,
      searchIn,
      language,
    });
    return NextResponse.json(response.data); // Return a NextReponse object containing the json encoded data in the body
    //The NextResponse.json(data, options) is a special method of Next.js which extends the normal Response.json method.
  } catch (error: any) {
    console.error('Error fetching articles:', error.response?.data || error.message); // Log detailed error information
    return NextResponse.json({ error: 'Error fetching articles' }, { status: error.response?.status || 500 });
  }
}
