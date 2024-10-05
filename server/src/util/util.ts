/* eslint-disable import/prefer-default-export */
export const validateUsername = (username: string): { isValid: boolean, errorMessage?: string } => {
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  const reservedUsernames = ['admin', 'root', 'system', 'tabafit', 'moderator', 'null', 'undefined', 'anonymous',
    'support', 'help', 'info', 'contact', 'test', 'user', 'guest', 'administrator', 'mod', 'superuser',
    'moderator', 'null', 'undefined', 'anonymous', 'support', 'help', 'info', 'contact', 'test', 'user',
    'guest', 'administrator', 'mod', 'superuser', 'official', 'verified', 'staff', 'team',
    'service', 'bot', 'system', 'security', 'privacy', 'legal', 'terms', 'policy',
    'account', 'profile', 'settings', 'notifications', 'messages', 'inbox', 'feedback',
    'report', 'abuse', 'copyright', 'trademark', 'api', 'developer', 'partner',
    'affiliate', 'sponsor', 'advertiser', 'marketing', 'sales', 'billing', 'payment',
    'subscription', 'premium', 'vip', 'pro', 'business', 'enterprise', 'corporate',
    'commercial', 'tabafit_official', 'tabafit_support', 'tabafit_team', 'tabafit_app',
    'it',
  ];

  if (username.length < 3) {
    return { isValid: false, errorMessage: 'Username must be at least 3 characters long.' };
  }

  if (!usernameRegex.test(username)) {
    return { isValid: false, errorMessage: 'Invalid username. Only alphanumeric characters, underscores, and dots are allowed.' };
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    return { isValid: false, errorMessage: 'Username already claimed.' };
  }

  return { isValid: true };
};
