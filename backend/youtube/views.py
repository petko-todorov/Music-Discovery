import os

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from dotenv import load_dotenv

from .models import YouTubeCache

load_dotenv()

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY_2")


class YouTubeSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")

        if not query:
            return Response({"error": "Missing query parameter"}, status=400)

        query = query.strip().lower()

        cached = YouTubeCache.objects.filter(query=query).first()
        if cached:
            return Response({
                "youtubeUrl": f"https://www.youtube.com/watch?v={cached.video_id}",
                "cached": True
            })

        params = {
            "part": "snippet",
            "q": query,
            "key": YOUTUBE_API_KEY,
            "maxResults": 1,
            "type": "video"
        }
        resp = requests.get(YOUTUBE_SEARCH_URL, params=params).json()
        video_id = resp['items'][0]['id']['videoId'] if resp.get(
            'items') else None
        YouTubeCache.objects.create(
            query=query,
            video_id=video_id
        )
        return Response({
            "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}" if video_id else None
        })


def index(request):
    return render(request, 'index.html')
