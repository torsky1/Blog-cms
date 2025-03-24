from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/new/', views.post_create, name='post_new'),
    path('post/<slug:slug>/', views.post_detail, name='post_detail'),
    path('post/<slug:slug>/edit/', views.post_edit, name='post_edit'),
    # API endpoints
    path('api/posts/', views.PostListAPI.as_view(), name='post_list_api'),
    path('api/posts/<slug:slug>/', views.PostDetailAPI.as_view(), name='post_detail_api'),
] 