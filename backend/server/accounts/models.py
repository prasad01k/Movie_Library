from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    release_date = models.DateField()
    image_url = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    is_public = models.BooleanField(default=True)
    movies = models.ManyToManyField(Movie)

    def __str__(self):
        return self.name
