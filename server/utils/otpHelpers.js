const normalizeOtp = (otp) => String(otp || '').replace(/\D/g, '').trim();

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

module.exports = {
  normalizeOtp,
  normalizeEmail,
};
