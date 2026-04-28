import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "../landing/Header";
import { Footer } from "../landing/Footer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-secondary selection:text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
