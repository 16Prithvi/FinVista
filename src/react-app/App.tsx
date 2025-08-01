import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "@/react-app/components/Layout";
import SipCalculator from "@/react-app/pages/SipCalculator";
import LumpsumCalculator from "@/react-app/pages/LumpsumCalculator";
import GoalPlanner from "@/react-app/pages/GoalPlanner";
import FundExplorer from "@/react-app/pages/FundExplorer";
import RetirementPlanner from "@/react-app/pages/RetirementPlanner";
import FdVsSip from "@/react-app/pages/FdVsSip";
import CompoundingPower from "@/react-app/pages/CompoundingPower";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SipCalculator />} />
          <Route path="/lumpsum" element={<LumpsumCalculator />} />
          <Route path="/goal-planner" element={<GoalPlanner />} />
          <Route path="/mutual-funds" element={<FundExplorer />} />
          <Route path="/retirement" element={<RetirementPlanner />} />
          <Route path="/fd-vs-sip" element={<FdVsSip />} />
          <Route path="/compounding" element={<CompoundingPower />} />
        </Routes>
      </Layout>
    </Router>
  );
}
