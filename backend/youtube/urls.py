from django.urls import path

from youtube.views import YouTubeSearchView

urlpatterns = [
    path('youtube', YouTubeSearchView.as_view(), name='youtube-search'),
]
