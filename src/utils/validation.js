/**
 * Form validation utilities for the Hospital Website
 * Requirements: 7.2, 7.3, 7.4
 */

/**
 * Validates if a field has a value (is not empty)
 * @param {string} value - The field value to validate
 * @returns {boolean} - True if field has a value, false otherwise
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  return String(value).trim().length > 0;
};

/**
 * Validates email address format
 * Requirement 7.2: Validate email addresses conform to standard email format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Standard email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates phone number format
 * Requirement 7.3: Validate phone numbers contain only digits and acceptable formatting characters
 * Accepts digits and common formatting characters: spaces, hyphens, parentheses, plus sign
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone is valid, false otherwise
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Allow digits and formatting characters: spaces, hyphens, parentheses, plus sign
  const phoneRegex = /^[\d\s\-()+]+$/;
  const trimmedPhone = phone.trim();
  
  // Must contain at least some digits
  const hasDigits = /\d/.test(trimmedPhone);
  
  return phoneRegex.test(trimmedPhone) && hasDigits;
};
