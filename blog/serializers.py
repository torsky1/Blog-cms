from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'author',
            'created_at',
            'updated_at',
            'published',
            'image',
            'comments_count'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.count() 