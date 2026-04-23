import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import AuthorsListPage from "./pages/authors/AuthorsListPage";
import AuthorCreatePage from "./pages/authors/AuthorCreatePage";
import BooksListPage from "./pages/books/BooksListPage";
import BookCreatePage from "./pages/books/BookCreatePage";
import ReviewsListPage from "./pages/reviews/ReviewsListPage";
import ReviewCreatePage from "./pages/reviews/ReviewCreatePage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />} />
      <Route index element={<HomePage />} />

      <Route path="authors">
        <Route index element={<AuthorsListPage />} />
        <Route path="new" element={<AuthorCreatePage />} />
      </Route>

      <Route path="books">
        <Route index element={<BooksListPage />} />
        <Route path="new" element={<BookCreatePage />} />
      </Route>

      <Route path="reviews">
        <Route index element={<ReviewsListPage />} />
        <Route path="new" element={<ReviewCreatePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
