import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import Layout from "./layout/Layout";
import { Routes, Route } from "react-router";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import SellerListingsPage from "./pages/SellerListingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import SearchPage from "./pages/SearchPage";
import UserProfilePage from "./pages/UserProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import MyListingsPage from "./pages/MyListingsPage";

export default function App() {
  const { isInitialized, checkUser, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) checkUser();
  }, [isInitialized]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route path="seller/:id/listings" element={<SellerListingsPage />} />
        <Route path="login" element={user ? <HomePage /> : <LoginPage />} />
        <Route path="register" element={user ? <HomePage /> : <RegisterPage />} />
        <Route path="profile" element={user ? <UserProfilePage /> : <RegisterPage />} />
        <Route path="favorites" element={user ? <FavoritesPage /> : <RegisterPage />} />
        <Route path="my-listings" element={user ? <MyListingsPage /> : <RegisterPage />} />
        <Route path="create-listing" element={user ? <CreateListingPage /> : <HomePage />} />
        <Route path="listings/:id/edit" element={user ? <CreateListingPage /> : <HomePage />} />
        <Route path="subscription">
          <Route index element={user ? <SubscriptionPage /> : <HomePage />} />
          <Route path="success" index element={user ? <SuccessPage /> : <HomePage />} />
          <Route path="cancel" element={user ? <CancelPage /> : <HomePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
