# Blog CMS

A modern blog content management system built with Django.

## Features

- User authentication (registration, login, logout)
- User dashboard for managing posts
- Create, edit, and delete blog posts
- Image upload support for posts
- Comments system
- Responsive design
- Clean and modern UI

## Requirements

- Python 3.8+
- Django 5.0+
- Pillow (for image handling)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blog-cms.git
cd blog-cms
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply database migrations:

```bash
python manage.py migrate
```

5. Create a superuser:

```bash
python manage.py createsuperuser
```

6. Run the development server:

```bash
python manage.py runserver
```

7. Visit http://127.0.0.1:8000/ in your browser

## Project Structure

- `blog/` - Main blog application

  - `models.py` - Post and Comment models
  - `views.py` - View logic
  - `urls.py` - URL routing
  - `templates/` - HTML templates

- `users/` - User management application
  - `models.py` - User model
  - `views.py` - Authentication views
  - `urls.py` - User-related URLs
  - `templates/` - User templates

## Usage

1. Register a new account or log in
2. Access your dashboard to manage posts
3. Create new posts with images
4. Edit or delete your existing posts
5. View and comment on other users' posts

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
