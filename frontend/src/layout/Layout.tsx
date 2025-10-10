import { Toaster } from "sonner";
import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
