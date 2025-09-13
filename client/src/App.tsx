import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import SignUpPage from "@/pages/signup";
import SignInPage from "@/pages/signin";
import ProfileSetupPage from "@/pages/profile-setup";
import DashboardPage from "@/pages/dashboard";
import LessonPage from "./pages/lesson";
import QuizPage from "./pages/quiz";
import ChallengeSubmissionPage from "./pages/challenge-submission";
import ChallengesPage from "./pages/challenges";
import AdminPage from "./pages/admin";
import AdminLoginPage from "./pages/admin-login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/profile-setup" component={ProfileSetupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/lesson/:moduleId" component={LessonPage} />
      <Route path="/lesson/:moduleId/section/:sectionId" component={LessonPage} />
      <Route path="/quiz/:moduleId" component={QuizPage} />
      <Route path="/challenges" component={ChallengesPage} />
      <Route path="/challenges/:challengeId" component={ChallengeSubmissionPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;