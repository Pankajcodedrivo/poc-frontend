interface InputFieldProps {
  icon: any;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  fullWidth?: boolean;
  error?: string; // new prop for error message
}

const InputField = ({ icon: Icon, placeholder, type = 'text', value, onChange, fullWidth, error }: InputFieldProps) => (
  <div className={`input-group ${fullWidth ? 'full-width' : ''}`}>
    <Icon className="icon" size={20} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? 'input-error' : ''}
    />
    {error && <span className="error-text">{error}</span>}
  </div>
);

export default InputField;