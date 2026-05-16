const securityHeaders = (req, res, next) => {
  // Previne clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Previne MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Ativa proteção XSS do navegador
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Política de segurança de conteúdo
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

module.exports = { securityHeaders };
