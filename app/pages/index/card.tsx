import React from 'react';

interface Article {
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  sentiment: number;
  source: { name: string };
}

interface CardProps {
  article: Article;
}

const Card: React.FC<CardProps> = ({ article }) => {
  //article is destructured to access the properties
  const formattedDate = new Date(article.publishedAt)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, ' ');

  const sentimentLabel = article.sentiment > 0.5 ? 'very good' : article.sentiment > 0.2 ? 'good' : article.sentiment < -0.2 ? 'bad' : 'neutral';

  return (
    <div className='p-4 mb-4 border rounded shadow-sm bg-white'>
      <p className='text-gray-500'>
        {formattedDate} - {article.source.name}
      </p>
      <h2 className='text-xl font-bold mb-2 text-black'>
        <a href={article.url} target='_blank' rel='noopener noreferrer'>
          {article.title}
        </a>
        <span className={`ml-2 ${article.sentiment > 0.2 ? 'text-green-500' : article.sentiment < -0.2 ? 'text-red-500' : 'text-gray-700'}`}>
          Sentiment: {sentimentLabel}
        </span>
      </h2>
      <p className='text-gray-900'>{article.description}</p>
    </div>
  );
};

export default Card;
