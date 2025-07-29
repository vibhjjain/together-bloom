import { useState } from "react";
import { Layout } from "@/components/Layout";
import { AuthForm } from "@/components/AuthForm";
import { HomePage } from "@/components/HomePage";
import { MemoriesGallery } from "@/components/MemoriesGallery";
import { LoveLetters } from "@/components/LoveLetters";
import { DailyCheckins } from "@/components/DailyCheckins";
import { AffirmationsFeed } from "@/components/AffirmationsFeed";
import { LocationSharing } from "@/components/LocationSharing";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: Connect to Supabase
  const [currentPage, setCurrentPage] = useState("home");

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage onNavigate={setCurrentPage} />;
      case "memories": return <MemoriesGallery />;
      case "letters": return <LoveLetters />;
      case "checkins": return <DailyCheckins />;
      case "affirmations": return <AffirmationsFeed />;
      case "location": return <LocationSharing />;
      case "settings": return <div className="text-center py-12">Settings coming soon!</div>;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
