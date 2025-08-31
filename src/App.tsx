import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";

import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Stories from "./pages/Stories";
import Upload from "./pages/Upload";
import About from "./pages/About";
import Genre from "./pages/Genre";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import DMCA from "./pages/DMCA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// Keep Favorites if you still use it
import Favorites from "./pages/Favorites";

// NEW sections
import Music from "./pages/Music";
import Talent from "./pages/Talent";
import Challenges from "./pages/Challenges";
import Live from "./pages/Live";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Core content */}
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/shows" element={<TVShows />} /> {/* alias for navbar */}
            <Route path="/stories" element={<Stories />} />

            {/* NEW sections */}
            <Route path="/music" element={<Music />} />
            <Route path="/talent" element={<Talent />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/live" element={<Live />} />

            {/* Favorites (optional) */}
            <Route path="/favorites" element={<Favorites />} />

            {/* Upload / Create */}
            <Route path="/upload" element={<Upload />} />
            <Route path="/create" element={<Upload />} /> {/* alias for "Create" button */}

            {/* Misc */}
            <Route path="/about" element={<About />} />
            <Route path="/genre/:genreName" element={<Genre />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* Legacy redirect */}
            <Route path="/browse" element={<Movies />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
