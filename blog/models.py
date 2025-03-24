from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name='Tytuł')
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name='Slug')
    content = models.TextField(verbose_name='Treść')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Autor')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data utworzenia')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data aktualizacji')
    published = models.BooleanField(default=False, verbose_name='Opublikowany')
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True, verbose_name='Obraz')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posty'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Sprawdź czy slug już istnieje
            base_slug = self.slug
            counter = 1
            while Post.objects.filter(slug=self.slug).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(verbose_name='Komentarz')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Komentarz'
        verbose_name_plural = 'Komentarze'

    def __str__(self):
        return f'Komentarz od {self.author.username} do {self.post.title}'
