from django import forms
from .models import Post, Comment

class PostForm(forms.ModelForm):
    title = forms.CharField(
        label='Tytuł',
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    content = forms.CharField(
        label='Treść',
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 10
        })
    )
    published = forms.BooleanField(
        label='Opublikowany',
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )

    class Meta:
        model = Post
        fields = ['title', 'content', 'published']

    def clean_title(self):
        title = self.cleaned_data['title']
        if len(title) < 5:
            raise forms.ValidationError('Tytuł musi mieć co najmniej 5 znaków.')
        return title

class CommentForm(forms.ModelForm):
    text = forms.CharField(
        label='Twój komentarz',
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Napisz komentarz...'
        })
    )

    class Meta:
        model = Comment
        fields = ['text'] 