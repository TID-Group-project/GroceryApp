import { Routes, Route, Navigate } from "react-router-dom";
import Parse from "./services/backend";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import HomePage from "./screens/HomePage";
import ListPage from "./screens/ListPage";

// Only logged-in users may see the page; everyone else is sent to the login screen.
function RequireLogin({ children }) {
  return Parse.User.current() ? children : <Navigate to="/login" replace />;
}

// The theme and CssBaseline are set up in main.jsx.
// "/" is the home screen. Any unknown path goes back to "/".
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/lists/:listId" element={<ListPage />} />
      <Route
        path="/"
        element={
          <RequireLogin>
            <HomePage />
          </RequireLogin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
