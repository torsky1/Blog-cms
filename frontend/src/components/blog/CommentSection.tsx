import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface CommentSectionProps {
  postId: number;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/posts/${postId}/comments/`
      );

      if (!response.ok) {
        throw new Error("Nie udało się pobrać komentarzy");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas pobierania komentarzy"
      );
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Musisz być zalogowany, aby dodać komentarz");
      }

      const response = await fetch(
        `http://localhost:8000/api/posts/${postId}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się dodać komentarza");
      }

      const data = await response.json();
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas dodawania komentarza"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Komentarze</h3>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Błąd!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Dodaj komentarz
            </label>
            <div className="mt-1">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Napisz komentarz..."
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Dodawanie..." : "Dodaj komentarz"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-600">
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Zaloguj się
            </a>{" "}
            lub{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              zarejestruj
            </a>{" "}
            aby dodać komentarz.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Brak komentarzy. Bądź pierwszy!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {comment.author}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
