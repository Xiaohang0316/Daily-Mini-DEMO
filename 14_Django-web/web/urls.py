from django.urls import path
from .views import index, index1

urlpatterns = [
    path('', index, name='index2'),
    path('index1/', index1, name='index1')
]