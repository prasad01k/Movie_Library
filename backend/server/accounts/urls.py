from django.urls import path, include
from . import views

accounts_urlpatterns = [
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/search/', views.search_movies, name='search_movies'),
]