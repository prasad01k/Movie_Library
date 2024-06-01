from django.shortcuts import render
# accounts/views.py
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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
