import React from 'react';

interface ArticleContentProps {
  article: {
    // Define the expected structure of the content object
    content?: string;
    url?: string;
    // Add other fields as necessary
  };
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  return (
    <div className='p-6 border rounded-lg shadow-md bg-gray-50'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Article Beginning</h2>
      <p className='text-gray-700 leading-relaxed'>{article.content}</p>
      <div className='flex space-x-4 justify-center mt-4'>
        <a href={article.url} target='_blank' rel='noopener noreferrer' className='text-indigo-600 hover:text-indigo-800'>
          Read More
        </a>
        <a href='#' className='text-teal-600 hover:text-teal-800'>
          Summarize this article
        </a>
      </div>
    </div>
  );
};

export default ArticleContent;
