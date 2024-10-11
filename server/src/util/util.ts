/* eslint-disable import/prefer-default-export */
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

// Create a matcher using the English preset
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Utility function to filter objectionable content
export const filterObjectionableContent = (text: string): boolean => matcher
  .hasMatch(text); // Check if the text contains any profanities

// Utility function to sanitize text
export const sanitizeText = (text: string): string => {
  const matches = matcher.getAllMatches(text);
  let sanitizedText = text;

  // Replace each match with asterisks
  matches.forEach((match) => {
    const replacement = '*'.repeat(match.endIndex - match.startIndex);
    sanitizedText = sanitizedText.substring(0, match.startIndex)
      + replacement + sanitizedText.substring(match.endIndex);
  });

  return sanitizedText;
};

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
