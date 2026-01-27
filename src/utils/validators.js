/**
 * Checks if a phone number string consists of exactly 10 digits.
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    // Regex for exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};
