from django.urls import path

from youtube.views import YouTubeSearchView, index

urlpatterns = [
    path('youtube/', YouTubeSearchView.as_view(), name='youtube-search'),
    path('', index, name='index'),
]
