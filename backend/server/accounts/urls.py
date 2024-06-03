from django.urls import path, include
from . import views

accounts_urlpatterns = [
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/search/', views.search_movies, name='search_movies'),
    path('api/playlists/', views.playlist_dispatcher, name='playlists'),
    path('api/playlists/<int:pk>/', views.playlist_detail_dispatcher, name='playlist_detail'),
    path('api/playlists/<int:pk>/add_movie/', views.add_movie_to_playlist, name='add_movie_to_playlist'),
    path('api/playlists/<int:pk>/movies/', views.get_playlist_movies, name='get_playlist_movies'),  # New URL pattern
]
