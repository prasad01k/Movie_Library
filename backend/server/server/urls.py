from django.contrib import admin
from django.urls import path, include
from accounts.urls import accounts_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += accounts_urlpatterns
