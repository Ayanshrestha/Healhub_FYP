import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow pt-24 pb-10 px-4">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
