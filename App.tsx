import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ChessGame from "@/pages/ChessGame";
import Rankings from "@/pages/Rankings";
import NotFound from "@/pages/not-found";
import { Trophy } from "lucide-react";

function Router() {
  return (
    <div>
      <nav className="w-full bg-card border-b border-border">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Xadrez Online
          </Link>
          <Link href="/rankings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Trophy className="h-4 w-4" />
            Rankings
          </Link>
        </div>
      </nav>

      <Switch>
        <Route path="/" component={ChessGame} />
        <Route path="/rankings" component={Rankings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;