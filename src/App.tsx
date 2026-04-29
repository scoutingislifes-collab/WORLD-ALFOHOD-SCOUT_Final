import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/authContext";
import { CartProvider } from "@/components/store/cartContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FloatingSignLanguageButton } from "@/components/accessibility/FloatingSignLanguageButton";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";
import { SeoHead } from "@/components/layout/SeoHead";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import { usePreferencesSync } from "@/hooks/usePreferencesSync";

import NotFound from "@/pages/not-found";
import { LandingPage } from "@/components/landing/LandingPage";

import About from "@/pages/About";
import WhatWeDo from "@/pages/WhatWeDo";
import ProgrammeDetail from "@/pages/ProgrammeDetail";
import News from "@/pages/News";
import ArticleDetail from "@/pages/ArticleDetail";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Regions from "@/pages/Regions";
import RegionDetail from "@/pages/RegionDetail";
import Resources from "@/pages/Resources";
import Videos from "@/pages/Videos";
import Store from "@/pages/Store";
import StoreCollection from "@/pages/StoreCollection";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import GetInvolved from "@/pages/GetInvolved";
import JoinRole from "@/pages/JoinRole";
import Donate from "@/pages/Donate";
import Contact from "@/pages/Contact";
import Search from "@/pages/Search";
import Games from "@/pages/Games";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Account from "@/pages/Account";
import Academy from "@/pages/Academy";
import AcademyCourse from "@/pages/AcademyCourse";
import AcademyLearn from "@/pages/AcademyLearn";
import InstructorDashboard from "@/pages/InstructorDashboard";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={About} />
      <Route path="/what-we-do" component={WhatWeDo} />
      <Route path="/programmes/:slug" component={ProgrammeDetail} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={ArticleDetail} />
      <Route path="/events" component={Events} />
      <Route path="/events/:slug" component={EventDetail} />
      <Route path="/regions" component={Regions} />
      <Route path="/regions/:slug" component={RegionDetail} />
      <Route path="/resources" component={Resources} />
      <Route path="/videos" component={Videos} />
      <Route path="/store" component={Store} />
      <Route path="/store/c/:slug" component={StoreCollection} />
      <Route path="/store/p/:slug" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/academy" component={Academy} />
      <Route path="/academy/c/:slug" component={AcademyCourse} />
      <Route path="/academy/learn/:slug" component={AcademyLearn} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/join/:role" component={JoinRole} />
      <Route path="/donate" component={Donate} />
      <Route path="/contact" component={Contact} />
      <Route path="/search" component={Search} />
      <Route path="/games" component={Games} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/account" component={Account} />
      <Route path="/instructor" component={InstructorDashboard} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PreferencesBridge() {
  usePreferencesSync();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <CartProvider>
                <SeoHead />
                <PreferencesBridge />
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                  <FloatingSignLanguageButton />
                  <PWAInstallPrompt />
                  <ConnectionStatus />
                </WouterRouter>
              </CartProvider>
            </AuthProvider>
            <Toaster />
          </AccessibilityProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
