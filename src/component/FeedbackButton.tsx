import { useState } from 'react';
import { X } from 'lucide-react';
import '../assets/css/FeedbackButton.scss';
import { FeedbackForm } from '../service/api.service';

const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors: { message?: string } = {};
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSuccess('');
    try {
      await FeedbackForm({message});
      setSuccess('Thank you for your feedback!');
      setMessage('');
    } catch (error) {
      console.error(error);
      setSuccess('Something went wrong. Please try again later.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="feedback-btn" onClick={() => setOpen(true)}>
        Feedback
      </button>

      {open && (
        <div className="feedback-modal-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-header">
              <h2>Feedback</h2>
              <button className="close-btn" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {success && <p className="success-text">{success}</p>}

            <div className="form-group">
              <textarea
                placeholder="Write your feedback here..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

          
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
