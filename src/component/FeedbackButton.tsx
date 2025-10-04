import { useState } from 'react';
import { X } from 'lucide-react';
import '../assets/css/FeedbackButton.scss';

const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors: { email?: string; message?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

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
      // API call (replace with your API endpoint)
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setSuccess('Thank you for your feedback!');
        setEmail('');
        setMessage('');
      } else {
        setSuccess('Failed to submit feedback. Try again.');
      }
    } catch (error) {
      console.error(error);
      setSuccess('Something went wrong. Please try again later.');
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

            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

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

            {success && <p className="success-text">{success}</p>}

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
