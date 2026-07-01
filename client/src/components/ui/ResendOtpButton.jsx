import { useState, useEffect } from 'react';

const COOLDOWN_SECONDS = 30;

const ResendOtpButton = ({ onResend, disabled = false, className = '' }) => {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || sending || disabled) return;

    setSending(true);
    try {
      await onResend();
      setCooldown(COOLDOWN_SECONDS);
    } finally {
      setSending(false);
    }
  };

  const isDisabled = cooldown > 0 || sending || disabled;

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={isDisabled}
      className={`cursor-pointer text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-400 ${className}`}
    >
      {sending
        ? 'Sending OTP...'
        : cooldown > 0
          ? `Resend OTP in ${cooldown}s`
          : "Didn't receive OTP? Resend"}
    </button>
  );
};

export default ResendOtpButton;
