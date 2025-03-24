import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../types/post";

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/posts/");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać postów");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Brak postów</h3>
        <p className="mt-2 text-sm text-gray-500">
          Nie ma jeszcze żadnych postów do wyświetlenia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              <Link
                to={`/post/${post.slug}`}
                className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <span>{post.author}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostList;
