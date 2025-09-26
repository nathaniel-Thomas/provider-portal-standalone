import { Switch, Route } from "wouter";
import { QueryClientProvider, queryClient } from "./lib/queryClient";
import { JobProvider } from "./contexts/JobContext";
import { JobWorkflowProvider, useJobWorkflow } from "./contexts/JobWorkflowContext";
import { Toaster } from "./components/ui/toaster";
import MobileFrame from "./components/MobileFrame";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Finance from "./pages/Finance";
import Profile from "./pages/Profile";
import PersonalInformation from "./pages/PersonalInformation";
import BankingPayouts from "./pages/BankingPayouts";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/not-found";
import JobWorkflowManager from "./components/job-workflow/JobWorkflowManager";

function AppContent() {
  const { isWorkflowActive } = useJobWorkflow();

  return (
    <MobileFrame>
      {isWorkflowActive ? (
        <JobWorkflowManager />
      ) : (
        <Switch>
          <Route path="/"><Home /></Route>
          <Route path="/calendar"><Calendar /></Route>
          <Route path="/earnings"><Finance /></Route>
          <Route path="/profile"><Profile /></Route>
          <Route path="/profile/personal-information"><PersonalInformation /></Route>
          <Route path="/profile/banking-payouts"><BankingPayouts /></Route>
          <Route path="/profile/help-support"><HelpSupport /></Route>
          <Route><NotFound /></Route>
        </Switch>
      )}
    </MobileFrame>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JobProvider>
        <JobWorkflowProvider>
          <AppContent />
          <Toaster />
        </JobWorkflowProvider>
      </JobProvider>
    </QueryClientProvider>
  );
}

export default App;