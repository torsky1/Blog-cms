import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PostFormData {
  title: string;
  content: string;
  published: boolean;
  image: File | null;
}

const NewPostForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    published: false,
    image: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("published", formData.published.toString());
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Nie udało się utworzyć posta");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas tworzenia posta"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Dostęp zabroniony</h3>
        <p className="mt-2 text-sm text-gray-500">
          Musisz być zalogowany, aby utworzyć nowy post.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Nowy post</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <strong className="font-bold">Błąd!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Tytuł
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Treść
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={10}
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Obrazek
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Podgląd"
                className="h-32 w-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Opublikuj od razu
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Zapisywanie..." : "Zapisz post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
