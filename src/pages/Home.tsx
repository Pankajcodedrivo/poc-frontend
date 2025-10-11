import { useState } from 'react';
import '../assets/css/style.scss';
import Results from '../component/Results';
import TravelForm from '../component/TravelForm';
import FeedbackButton from '../component/FeedbackButton';
import { travelForm } from '../service/api.service';

interface TravelResult {
  visa: string;
  budget: {
    totalUSD: number;
    perDayUSD: number;
    breakdown: {
      accommodation: number;
      food: number;
      transportation: number;
      activities: number;
      miscellaneous: number;
    };
  };
  local: {
    destination: string;
    apps: {
      transportation: string[];
      lodging: string[];
      communication: string[];
      budgetTravel: string[];
      navigation: string[];
      utilities: string[];
    };
    eSIM: string[];
  }[];
  currencies: {
    destination: string;
    localCurrency: string;
    exchangeRate: number;
    exchangeTips: string[];
  }[];
  safety: {
    destination: string;
    generalSafety: string;
    scamsAndReviews:string;
    emergencyNumbers: {
      police: number;
      ambulanceFire: number;
    };
    travelInsurance: string;
  }[];
  mini: string[];
}

const Home = () => {
  const [resultsVisible, setResultsVisible] = useState(false);
  const [results, setResults] = useState<TravelResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData: {
    destination: string;
    passport: string;
    start_date: string;
    end_date: string;
    budget: string;
  }) => {
    setLoading(true);
    setResultsVisible(false);
    try {
      const res = await travelForm(formData);
      setResults(res.data);
      setResultsVisible(true);
    } catch (error) {
      console.error('API error', error);
      setResultsVisible(false);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-planner">
      <FeedbackButton />
      <div className="container">
        <TravelForm onSubmit={handleFormSubmit} />

        {resultsVisible && results && <Results data={results} />}
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
