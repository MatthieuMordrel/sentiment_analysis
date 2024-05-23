import React from 'react';

interface Article {
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  sentiment: number;
  source: { name: string };
  urlToImage: string;
  content: string;
}

interface CardProps {
  article: Article;
  onHoverContent: (source: object) => void;
  isHighlighted: boolean;
}

const Card: React.FC<CardProps> = ({ article, onHoverContent, isHighlighted }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const sentimentLabel = article.sentiment > 0.5 ? 'Very good' : article.sentiment > 0.2 ? 'Good' : article.sentiment < -0.2 ? 'Bad' : 'Neutral';
  const sentimentColor = article.sentiment > 0.2 ? 'text-green-500' : article.sentiment < -0.2 ? 'text-red-500' : 'text-gray-700';

  return (
    <div
      className={`flex p-4 mb-4 border rounded shadow-sm ${isHighlighted ? 'bg-blue-100' : 'bg-white'}`}
      onMouseEnter={() => onHoverContent({ url: article.url, content: article.content })}>
      <img src={article.urlToImage} alt={article.title} className='w-32 h-32 object-cover mr-4' />
      <div className='flex flex-col justify-center' style={{ width: 'calc(100% - 8rem)' }}>
        <p className='text-gray-500 mb-2'>
          {formattedDate} - {article.source.name}
        </p>
        <h2 className='text-xl font-bold mb-2 text-black'>
          <a href={article.url} target='_blank' rel='noopener noreferrer' className='hover:underline hover:text-blue-500'>
            {article.title} -
          </a>
          <span className={`ml-2 ${sentimentColor}`}>Sentiment: {sentimentLabel}</span>
        </h2>
        <p className='text-gray-900'>{article.description}</p>
      </div>
    </div>
  );
};

export default Card;
