from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<slug:slug>/', views.post_detail, name='post_detail'),
    path('post/new/', views.post_create, name='post_create'),
    # API endpoints
    path('api/posts/', views.PostListAPI.as_view(), name='post_list_api'),
    path('api/posts/<slug:slug>/', views.PostDetailAPI.as_view(), name='post_detail_api'),
] 