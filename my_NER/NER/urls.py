from django.urls import path
from . import views

urlpatterns = [
    path('SaveFile', views.SaveFile, name = 'SaveFile'),
]