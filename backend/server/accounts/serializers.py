# serializer.py
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

    def create(self, validated_data):
        user = self.context['request'].user
        playlist = Playlist.objects.create(user=user, **validated_data)
        return playlist
