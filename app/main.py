# app/main.py

# Import necessary modules from FastAPI and other libraries
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from textblob import TextBlob
import logging
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize the FastAPI app
app = FastAPI()

# Define constants for the News API key and URL
# Calls load_dotenv(): This function reads the .env file located in the root directory of your project and loads the environment variables defined in that file into the environment. This allows you to access these variables using os.getenv() or os.environ.
load_dotenv()
NEWS_API_KEY = os.getenv('NEWS_API_KEY')  # Replace with your News API key
NEWS_API_URL = 'https://newsapi.org/v2/everything'

# Define a Pydantic model for the search request
class SearchRequest(BaseModel):
    keywords: str
    fromDate: str = None
    toDate: str = None
    searchIn: str = None
    language: str = None

# 1. A request is made to the /search endpoint with a JSON body.
# 2. FastAPI parses the JSON body and attempts to create an instance of SearchRequest with the provided data.
# 3. If the data does not match the expected types or required fields, FastAPI raises a validation error and returns a 422 response with details about what went wrong.
# 4. If the data is valid, the search_news function is called with the validated SearchRequest instance.

# Function to analyze sentiment of a given text using TextBlob
def analyze_sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

# Define a POST endpoint for searching news
@app.post("/search")
# app is an instance of FastAPI. This instance is created when you initialize your FastAPI application, typically with app = FastAPI().

def search_news(request: SearchRequest):
    # Log the parameters retrieved from the API route
    logging.info(f"Search parameters: keywords={request.keywords}, fromDate={request.fromDate}, toDate={request.toDate}, searchIn={request.searchIn}, language={request.language}")

    # Set up parameters for the News API request
    params = {
        'q': request.keywords,
        'from': request.fromDate,
        'to': request.toDate,
        'searchIn': request.searchIn,
        "language": request.language,
        'apiKey': NEWS_API_KEY,
    }
    # Make a GET request to the News API
    response = requests.get(NEWS_API_URL, params=params)
    # Raise an HTTPException if the response status code is not 200
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    # Extract articles from the response and analyze their sentiment
    articles = response.json().get('articles', [])
    for article in articles:
        article['sentiment'] = analyze_sentiment(article['description'] or '')


    # Return the articles with their sentiment analysis
    return {'articles': articles}
