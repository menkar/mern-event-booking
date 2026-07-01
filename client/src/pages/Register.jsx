import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import AuthCard from '../components/ui/AuthCard';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ResendOtpButton from '../components/ui/ResendOtpButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP, resendAccountOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOTP(email, otp);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    try {
      await resendAccountOTP(email, password);
      setInfo('A new OTP has been sent to your email.');
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Failed to resend OTP');
      throw err;
    }
  };

  return (
    <PageContainer hideHeader>
      <AuthCard
        title="Create Account"
        subtitle="Join Swap Events Hub Client today"
        footer={
          !showOTP && (
            <>
              Already have an account?{' '}
              <Link to="/login" className="cursor-pointer font-semibold text-indigo-600 hover:underline">
                Sign in
              </Link>
            </>
          )
        }
      >
        {error && <Alert className="mb-5">{error}</Alert>}
        {info && (
          <Alert type="info" className="mb-5">
            {info}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!showOTP ? (
            <>
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
              />
            </>
          ) : (
            <>
              <Alert type="success">
                An OTP has been sent to <strong>{email}</strong>. Verify your
                account to continue.
              </Alert>
              <Input
                label="Verification Code (OTP)"
                type="text"
                required
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                inputMode="numeric"
                className="text-center text-lg font-bold tracking-[0.4em]"
              />
              <div className="text-center">
                <ResendOtpButton onResend={handleResendOtp} disabled={loading} />
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Processing...'
              : showOTP
                ? 'Verify & Complete Registration'
                : 'Create Account'}
          </Button>
        </form>
      </AuthCard>
    </PageContainer>
  );
};

export default Register;
