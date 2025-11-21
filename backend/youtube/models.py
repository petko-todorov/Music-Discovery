from django.db import models

# Create your models here.


class YouTubeCache(models.Model):
    query = models.CharField(max_length=255, unique=True)
    video_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
