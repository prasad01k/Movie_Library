import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from .models import Playlist, Movie
from .serializers import PlaylistSerializer, MovieSerializer
from rest_framework.exceptions import ValidationError



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_playlist_movies(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk, user=request.user)
    except Playlist.DoesNotExist:
        return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    movies = playlist.movies.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_movie_to_playlist(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk, user=request.user)
    except Playlist.DoesNotExist:
        return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    movie_data = request.data.get('movie')
    if not movie_data:
        return Response({'error': 'Movie data is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check for the required fields in movie_data
    required_fields = ['title', 'release_date', 'image_url']
    for field in required_fields:
        if field not in movie_data:
            return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = MovieSerializer(data=movie_data)
    if serializer.is_valid():
        movie, created = Movie.objects.get_or_create(
            title=serializer.validated_data['title'],
            defaults=serializer.validated_data
        )
        playlist.movies.add(movie)
        playlist.save()
        playlist_serializer = PlaylistSerializer(playlist)
        return Response(playlist_serializer.data, status=status.HTTP_200_OK)
    else:
        # Return detailed error messages
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('query', '')
    if query:
        url = f"http://www.omdbapi.com/?apikey={settings.OMDB_API_KEY}&s={query}"
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to fetch data from OMDB API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'Query parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def playlist_dispatcher(request):
    if request.method == 'GET':
        return list_playlists(request)
    elif request.method == 'POST':
        return create_playlist(request)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def playlist_detail_dispatcher(request, pk):
    if request.method == 'PATCH':
        return update_playlist(request, pk)
    elif request.method == 'DELETE':
        return delete_playlist(request, pk)

def create_playlist(request):
    data = request.data
    data['user'] = request.user.id
    serializer = PlaylistSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def list_playlists(request):
    playlists = Playlist.objects.filter(user=request.user)
    serializer = PlaylistSerializer(playlists, many=True)
    return Response(serializer.data)

def update_playlist(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk, user=request.user)
    except Playlist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def delete_playlist(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk, user=request.user)
    except Playlist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    playlist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
