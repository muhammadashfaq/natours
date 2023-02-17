const crypto = require('crypto');

exports.createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const passwordResetToken = String(
    crypto.createHash('sha256').update(resetToken).digest('hex')
  );

  const passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return { passwordResetExpires, passwordResetToken };
};
