import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import Layout from "./layout/Layout";
import { Routes, Route } from "react-router";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListingPage from "./pages/CreateListingPage";

export default function App() {
  const { isInitialized, checkUser, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) checkUser();
  }, [isInitialized]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={user ? <HomePage /> : <LoginPage />} />
        <Route path="register" element={user ? <HomePage /> : <RegisterPage />} />
        <Route path="create-listing" element={user ? <CreateListingPage /> : <HomePage />} />
      </Route>
    </Routes>
  );
}
