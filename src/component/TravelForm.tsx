import { useState } from 'react';
import { Plane, Globe, Calendar, DollarSign } from 'lucide-react';
import InputField from './InputField';

interface FormProps {
  onSubmit: (formData: {
    destination: string;
    passport: string;
    start_date: string;
    end_date: string;
    budget: string;
  }) => void;
}

const TravelForm = ({ onSubmit }: FormProps) => {
  const [destination, setDestination] = useState('');
  const [passport, setPassport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({}); // key-value for each input

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};

    if (!destination.trim()) validationErrors.destination = 'Destination is required.';
    if (!passport.trim()) validationErrors.passport = 'Passport / Citizenship is required.';
    if (!startDate) validationErrors.startDate = 'Start date is required.';
    if (!endDate) validationErrors.endDate = 'End date is required.';
    if (!budget || Number(budget) <= 0) validationErrors.budget = 'Budget must be greater than 0.';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      validationErrors.startDate = 'Start date cannot be after end date.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
       onSubmit({ 
        destination, 
        passport, 
        start_date: startDate, 
        end_date: endDate, 
        budget 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="planner-form">
      <div className="text-center mb-4">
          <h2>Poc</h2>
      </div>
      <div className="input-grid">
        <InputField
          icon={Plane}
          placeholder="Destination"
          value={destination}
          onChange={setDestination}
          error={errors.destination}
        />
        <InputField
          icon={Globe}
          placeholder="Passport Number"
          value={passport}
          onChange={setPassport}
          error={errors.passport}
        />
        <InputField
          icon={Calendar}
          type="date"
          value={startDate}
          onChange={setStartDate}
          error={errors.startDate}
        />
        <InputField
          icon={Calendar}
          type="date"
          value={endDate}
          onChange={setEndDate}
          error={errors.endDate}
        />
        <InputField
          icon={DollarSign}
          placeholder="Budget ($)"
          type="number"
          value={budget}
          onChange={setBudget}
          fullWidth
          error={errors.budget}
        />
      </div>
      <button type="submit" className="generate-btn">Generate Plan</button>
    </form>
  );
};

export default TravelForm;
