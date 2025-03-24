import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../types/post";

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/posts/${slug}/`
        );
        if (!response.ok) {
          throw new Error("Nie udało się pobrać postu");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Błąd!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Nie znaleziono postu
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Post o podanym adresie nie istnieje.
        </p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>
        </header>

        <div className="prose max-w-none">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {post.excerpt && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skrót</h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostDetail;
