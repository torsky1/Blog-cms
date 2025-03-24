import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Navbar from "./components/layout/Navbar";
import PostList from "./pages/blog/PostList";
import PostDetail from "./pages/blog/PostDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import NewPost from "./pages/admin/NewPost";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Publiczne ścieżki */}
              <Route path="/" element={<PostList />} />
              <Route path="/post/:slug" element={<PostDetail />} />

              {/* Ścieżki wymagające autoryzacji */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/new-post"
                element={
                  <PrivateRoute>
                    <NewPost />
                  </PrivateRoute>
                }
              />

              {/* Ścieżki dostępne tylko dla niezalogowanych */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
