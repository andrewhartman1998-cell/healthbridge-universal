import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import Landing from './pages/Landing';
import BenefitsFinder from './pages/BenefitsFinder';
import EligibilityCheck from './pages/EligibilityCheck';
import DisabilityAccess from './pages/DisabilityAccess';
import EmergencyRelief from './pages/EmergencyRelief';
import ApplyWizard from './pages/ApplyWizard';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename="/healthbridge-universal/govbridge">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/finder" element={<BenefitsFinder />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/disability" element={<DisabilityAccess />} />
          <Route path="/emergency" element={<EmergencyRelief />} />
          <Route path="/apply" element={<ApplyWizard />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
