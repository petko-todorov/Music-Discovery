import os

from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


class YouTubeSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")

        if not query:
            return Response({"error": "Missing query parameter"}, status=400)

        params = {
            "part": "snippet",
            "q": query,
            "key": YOUTUBE_API_KEY,
            "maxResults": 1,
            "type": "video"
        }
        resp = requests.get(YOUTUBE_SEARCH_URL, params=params).json()
        video_id = resp['items'][0]['id']['videoId'] if resp.get('items') else None
        return Response({
            "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}" if video_id else None
        })
