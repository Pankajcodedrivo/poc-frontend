import { useState } from 'react';
import { X } from 'lucide-react';
import '../assets/css/FeedbackButton.scss';
import { FeedbackForm } from '../service/api.service';

// Define the form state type
interface FeedbackFormState {
  q1: string; q2: string; q3: string; q4: string; q5: string; q6: string;
  q7: string; q8: string; q9: string; q10: string; q11: string; q12: string; q13: string;
}

// Radio question options
const questions: Record<string, string[]> = {
  q1: ['Rarely', 'Once or twice a year', 'A few times a year', 'Frequently / Digital Nomad'],
  q2: ['Solo traveler', 'Couple traveler', 'Family traveler', 'Group traveler', 'Backpacker / Budget traveler'],
  q3: ['Very easy', 'Somewhat easy', 'Confusing', 'I still don’t understand it'],
  q4: ['Very smooth', 'Somewhat smooth', 'Average', 'Frustrating'],
  q6: ['Yes, definitely', 'Maybe', 'Not really', 'No'],
  q12: ['Yes!', 'Maybe later', 'Not right now'],
  q13: ['Sure', 'No thanks'],
};

const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormState, string>>>({});

  const [form, setForm] = useState<FeedbackFormState>({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '',
    q8: '', q9: '', q10: '', q11: '', q12: '', q13: '',
  });

  // Handle form input changes
  const handleChange = (key: keyof FeedbackFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // Form validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FeedbackFormState, string>> = {};
    const requiredRadios: (keyof FeedbackFormState)[] = ['q1', 'q2', 'q3', 'q4', 'q6', 'q12', 'q13'];
    const minTextLen = 10;

    requiredRadios.forEach(key => {
      if (!form[key]) newErrors[key] = 'This question is required.';
    });


    const textFields: (keyof FeedbackFormState)[] = ['q5', 'q7', 'q8', 'q10'];

    textFields.forEach(key => {
      if (form[key] && form[key].trim().length < minTextLen) {
        newErrors[key] = `Please write at least ${minTextLen} characters.`;
      }
    });

    if (!form.q9) newErrors.q9 = 'Please rate from 1 to 10.';
    else if (isNaN(Number(form.q9)) || Number(form.q9) < 1 || Number(form.q9) > 10)
      newErrors.q9 = 'Rating must be between 1 and 10.';

    if (!form.q11.trim()) newErrors.q11 = 'Please describe your experience in one word.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit feedback
  const handleSubmit = async () => {
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await FeedbackForm(form);
      setSuccess('✅ Thank you for your feedback!');
      setForm({
        q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '',
        q8: '', q9: '', q10: '', q11: '', q12: '', q13: '',
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setSuccess('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render a radio question inline
  const renderRadioQuestion = (label: string, key: keyof FeedbackFormState, options: string[]) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="radio-group">
        {options.map(opt => (
          <label key={opt} className="radio-label">
            <input
              type="radio"
              name={key}
              checked={form[key] === opt}
              onChange={() => handleChange(key, opt)}
            />
            <span className="checkmark"></span>
            {opt}
          </label>
        ))}
      </div>
      {errors[key] && <p className="error-text">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <button className="feedback-btn" onClick={() => setOpen(true)}>
        Feedback
      </button>

      {open && (
        <div className="feedback-modal-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal large-width" onClick={e => e.stopPropagation()}>
            <div className="feedback-header">
              <h2>Feedback</h2>
              <button className="close-btn" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {success && <p className="success-text">{success}</p>}

            <div className="form-scroll">
              {renderRadioQuestion('1. How often do you travel?', 'q1', questions.q1)}
              {renderRadioQuestion('2. What type of traveler best describes you?', 'q2', questions.q2)}
              {renderRadioQuestion('3. How easy was it to understand what the app does?', 'q3', questions.q3)}
              {renderRadioQuestion('4. How smooth was your experience using the app?', 'q4', questions.q4)}

              <div className="form-group">
                <label>5. What was your first impression after using it?</label>
                <textarea
                  rows={3}
                  value={form.q5}
                  onChange={e => handleChange('q5', e.target.value)}
                  className={errors.q5 ? 'input-error' : ''}
                />
                {errors.q5 && <p className="error-text">{errors.q5}</p>}
              </div>

              {renderRadioQuestion('6. Did the app give you information you’d actually use?', 'q6', questions.q6)}

              <div className="form-group">
                <label>7. Which features did you find most helpful?</label>
                <textarea
                  rows={3}
                  value={form.q7}
                  onChange={e => handleChange('q7', e.target.value)}
                  className={errors.q7 ? 'input-error' : ''}
                />
                {errors.q7 && <p className="error-text">{errors.q7}</p>}
              </div>

              <div className="form-group">
                <label>8. Which features were least helpful or confusing?</label>
                <textarea
                  rows={3}
                  value={form.q8}
                  onChange={e => handleChange('q8', e.target.value)}
                  className={errors.q8 ? 'input-error' : ''}
                />
                {errors.q8 && <p className="error-text">{errors.q8}</p>}
              </div>

              <div className="form-group">
                <label>9. On a scale of 1–10, how likely are you to use this app again?</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.q9}
                  onChange={e => handleChange('q9', e.target.value)}
                  className={errors.q9 ? 'input-error' : ''}
                />
                {errors.q9 && <p className="error-text">{errors.q9}</p>}
              </div>

              <div className="form-group">
                <label>10. What’s one thing you would improve or add?</label>
                <textarea
                  rows={3}
                  value={form.q10}
                  onChange={e => handleChange('q10', e.target.value)}
                  className={errors.q10 ? 'input-error' : ''}
                />
                {errors.q10 && <p className="error-text">{errors.q10}</p>}
              </div>

              <div className="form-group">
                <label>11. If you could describe your experience in one word, what would it be?</label>
                <input
                  type="text"
                  value={form.q11}
                  onChange={e => handleChange('q11', e.target.value)}
                  className={errors.q11 ? 'input-error' : ''}
                />
                {errors.q11 && <p className="error-text">{errors.q11}</p>}
              </div>

              {renderRadioQuestion('12. Would you like to be part of early access for the MVP next year?', 'q12', questions.q12)}
              {renderRadioQuestion('13. Would you be okay if we quoted your feedback (first name only)?', 'q13', questions.q13)}

              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;