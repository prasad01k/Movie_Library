from rest_framework import serializers
from .models import Playlist, Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['title', 'description', 'release_date', 'image_url']

class PlaylistSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'is_public', 'movies']
