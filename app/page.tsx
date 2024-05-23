'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from './components/card';
import SourceDropdown from './components/filter';
import ArticleContent from './components/content';
import FormField from './components/form';
import { Article, State } from './type';

const useArticles = () => {
  const [state, setState] = useState<State>({
    keywords: '',
    fromDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    toDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    searchIn: 'title',
    articles: [],
    loading: false,
    language: 'en',
    finalArticles: [],
    sources: [],
    selectedSource: '',
    content: {},
    isVisible: false,
    highlightedKey: null,
    errorMessage: '',
  });

  const handleSearch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, errorMessage: '' })); //Reset error message and put the loading state on true while data is being fetched
    try {
      const { data } = await axios.post('./api/search', {
        keywords: state.keywords,
        fromDate: state.fromDate,
        toDate: state.toDate,
        searchIn: state.searchIn,
        language: state.language,
      });
      const filteredArticles = data.articles
        .filter((article: Article) => article.title !== '[Removed]')
        .sort((a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      const uniqueSources: string[] = Array.from(
        new Set<string>(
          data.articles.filter((article: Article) => article.source.name !== '[Removed]').map((article: Article) => article.source.name)
        )
      ).sort();
      setState(prev => ({
        ...prev,
        articles: filteredArticles,
        finalArticles: filteredArticles,
        sources: uniqueSources,
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setState(prev => ({ ...prev, errorMessage: 'No articles found for the given search criteria' }));
        setTimeout(() => setState(prev => ({ ...prev, errorMessage: '' })), 3000);
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.keywords, state.fromDate, state.toDate, state.searchIn, state.language]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      finalArticles: state.selectedSource ? state.articles.filter(article => article.source.name === state.selectedSource) : state.articles,
    }));
  }, [state.selectedSource, state.articles]);

  return { state, setState, handleSearch };
};

export default function Home() {
  const { state, setState, handleSearch } = useArticles();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!isInitialRender.current) {
      console.log('Articles updated:', state.articles);
    } else {
      isInitialRender.current = false; //This becomes false when the article state takes [] as value.
    }
  }, [state.articles]);

  return (
    <div className='flex-col text-center p-10'>
      <h1 className='text-4xl font-bold text-white mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg'>
        News Sentiment Analysis
      </h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSearch();
        }}
        className='space-y-4'>
        <FormField
          label='Keywords: Use quotes for exact match, use AND or OR for multiple keywords and NOT for excluding keywords'
          type='text'
          value={state.keywords}
          onChange={e => setState(prev => ({ ...prev, keywords: e.target.value }))}
          placeholder='Enter Keywords'
        />
        <FormField label='From Date:' type='date' value={state.fromDate} onChange={e => setState(prev => ({ ...prev, fromDate: e.target.value }))} />
        <FormField label='To Date:' type='date' value={state.toDate} onChange={e => setState(prev => ({ ...prev, toDate: e.target.value }))} />
        <FormField
          label='Search In:'
          type='select'
          value={state.searchIn}
          onChange={e => setState(prev => ({ ...prev, searchIn: e.target.value }))}
          options={[
            { value: '', label: 'All' },
            { value: 'title', label: 'Title' },
            { value: 'description', label: 'Description' },
            { value: 'content', label: 'Content' },
          ]}
        />
        <FormField
          label='Language:'
          type='select'
          value={state.language}
          onChange={e => setState(prev => ({ ...prev, language: e.target.value }))}
          options={[
            { value: '', label: 'All languages' },
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'nl', label: 'Dutch' },
            { value: 'ru', label: 'Russian' },
          ]}
        />
        <div className='flex flex-row items-center justify-center'>
          <SourceDropdown
            sources={state.sources}
            selectedSource={state.selectedSource}
            onSelectSource={source => setState(prev => ({ ...prev, selectedSource: source }))}
          />
          <button type='submit' className='ml-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 self-end'>
            Search
          </button>
        </div>
        {state.errorMessage && <p className='text-red-500 ml-4'>{state.errorMessage}</p>}
        <p className='mt-2 text-sm text-white font-medium'>Number of articles: {state.finalArticles.length} (100 max per request)</p>
      </form>
      {state.loading && <p>Loading...</p>}
      <div className='my-6 flex' onMouseEnter={() => setState(prev => ({ ...prev, isVisible: true }))}>
        <div className='w-2/3'>
          {state.finalArticles.map((article, index) => (
            <Card
              key={index}
              article={{
                ...article, //Spreading the article allows to pass default value for some properties while making sure we still pass all the properties of article.
                description: article.description || '',
                url: article.url || '',
                sentiment: typeof article.sentiment === 'number' ? article.sentiment : 0,
                urlToImage: article.urlToImage || '',
                content: article.content || '',
              }}
              onHoverContent={content => setState(prev => ({ ...prev, content, highlightedKey: index }))}
              isHighlighted={state.highlightedKey === index}
            />
          ))}
        </div>
        <div className='relative w-1/3 mx-4'>
          <div className='sticky top-6'>{state.isVisible && <ArticleContent article={state.content} />}</div>
        </div>
      </div>
    </div>
  );
}
