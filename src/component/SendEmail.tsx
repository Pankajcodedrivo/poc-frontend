import { useState } from 'react';
import { X } from 'lucide-react';
import '../assets/css/FeedbackButton.scss';
import { sendEmail } from '../service/api.service';
interface SendEmailProps {
  data: any;
  setOpen: (value: boolean) => void;
}
const SendEmail = ({ data,setOpen }: SendEmailProps) => {
 
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors: { email?: string; message?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
      if (!validate()) return;
      setLoading(true);
      setSuccess('');
      try {
        await sendEmail({email,data});
        setSuccess('Plan details have been sent to your email.');
        setEmail('');
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
        <div className="feedback-modal-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-header">
              <h2>Plan Details</h2>
              <button className="close-btn" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {success && <p className="success-text">{success}</p>}
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

           
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
    </>
  );
};

export default SendEmail;
