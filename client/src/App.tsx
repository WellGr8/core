import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StartPage from "@/pages/start-page";
import QuizPage from "@/pages/quiz-page";
import ResultsPage from "@/pages/results-page";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StartPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/results/:sessionId" component={ResultsPage} />
      <Route component={StartPage} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Load SweetAlert2
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/sweetalert2@11"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <Router />
          </div>
        </div>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
