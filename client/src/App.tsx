import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from 'react-hot-toast';
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScheduleProvider>
        <HotToaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--primary-foreground))',
              },
            },
          }}
        />
        <Router />
      </ScheduleProvider>
    </QueryClientProvider>
  );
}

export default App;
