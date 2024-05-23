export interface Article {
  content: string;
  urlToImage: string;
  sentiment: number;
  url: string;
  description: string;
  title: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface State {
  keywords: string;
  fromDate: string;
  toDate: string;
  searchIn: string;
  articles: Article[];
  loading: boolean;
  language: string;
  finalArticles: Article[];
  sources: string[];
  selectedSource: string;
  content: Article | {};
  isVisible: boolean;
  highlightedKey: number | null;
  errorMessage: string;
}
