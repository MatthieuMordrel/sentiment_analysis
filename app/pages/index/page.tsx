'use client';

import { useState } from 'react';
import axios from 'axios';
import Card from './card';

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 86400000).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchIn, setSearchIn] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('./api/search', {
        keywords,
        fromDate,
        toDate,
        searchIn,
        language,
      });

      const filteredArticles = response.data.articles.filter((article: { title: string }) => article.title !== '[Removed]');
      setArticles(filteredArticles);
      console.log(response);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      console.log(language);
      console.log(keywords);
      setLoading(false);
    }
  };

  return (
    <div className='flex-col text-center p-10'>
      <h1>News Sentiment Analysis</h1>
      <form
        onSubmit={e => {
          e.preventDefault(); //the default behavior is prevented using e.preventDefault(), allowing  to handle the form submission with JavaScript
          handleSearch(); //(in this case, the handleSearch function)
        }}
        className='space-y-4'>
        <div className='flex flex-col items-start'>
          <label className='mb-2 font-semibold'>Keywords: Use quotes for exact match</label>
          <input
            type='text'
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder='Enter Keywords'
            className='w-full p-2 border border-gray-300 rounded text-black'
          />
        </div>
        <div className='flex flex-col items-start'>
          <label className='mb-2 font-semibold'>From Date:</label>
          <input
            type='date'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            title='FromDate'
            className='w-full p-2 border border-gray-300 rounded text-black'
          />
        </div>
        <div className='flex flex-col items-start'>
          <label className='mb-2 font-semibold'>To Date:</label>
          <input
            type='date'
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            title='ToDate'
            className='w-full p-2 border border-gray-300 rounded text-black'
          />
        </div>
        <div className='flex flex-col items-start'>
          <label className='mb-2 font-semibold'>Search In:</label>
          <select
            value={searchIn}
            onChange={e => setSearchIn(e.target.value)}
            title='SearchIn'
            className='w-full p-2 border border-gray-300 rounded text-black'>
            <option value=''>All</option>
            <option value='title'>Title</option>
            <option value='description'>Description</option>
            <option value='content'>Content</option>
          </select>
        </div>
        <div className='flex flex-col items-start'>
          <label className='mb-2 font-semibold'>Language:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            title='Language'
            className='w-full p-2 border border-gray-300 rounded text-black'>
            <option value='en'>English</option>
            <option value='fr'>French</option>
            <option value='nl'>Dutch</option>
            <option value='ru'>Russian</option>
          </select>
        </div>
        <button type='submit' className='px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600'>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      <div className='my-6'>
        {articles.map(
          (
            article: { title: string; description: string; publishedAt: string; url: string; sentiment: number; source: { name: string } },
            index: number
          ) => (
            <Card key={index} article={article} />
          )
        )}
      </div>
    </div>
  );
}
