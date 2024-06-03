# views.py
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Playlist, Movie
from .serializers import PlaylistSerializer, MovieSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class Login(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response({"non_field_errors": ["Username and password are required."]}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({"auth_token": token.key})
            else:
                return Response({"non_field_errors": ["This account is inactive."]}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if User.objects.filter(username=username).exists():
                return Response({"non_field_errors": ["Unable to login with provided credentials."]}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"non_field_errors": ["User does not exist."]}, status=status.HTTP_400_BAD_REQUEST)

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
    serializer = PlaylistSerializer(data=request.data, context={'request': request})
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
