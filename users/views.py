from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from .forms import UserRegistrationForm
from blog.models import Post

# Create your views here.

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Rejestracja zakończona pomyślnie! Witamy na pokładzie!')
            return redirect('users:dashboard')
        else:
            messages.error(request, 'Wystąpił błąd podczas rejestracji. Popraw błędy w formularzu.')
    else:
        form = UserRegistrationForm()
    return render(request, 'users/register.html', {'form': form})

class CustomLoginView(LoginView):
    template_name = 'users/login.html'
    redirect_authenticated_user = True

def logout_view(request):
    logout(request)
    messages.success(request, 'Zostałeś wylogowany.')
    return redirect('blog:post_list')

@login_required
def dashboard(request):
    user_posts = Post.objects.filter(author=request.user).order_by('-created_at')
    return render(request, 'users/dashboard.html', {
        'posts': user_posts,
        'user': request.user
    })
