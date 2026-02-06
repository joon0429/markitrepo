// form validation utilities

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export function validateForm(
  values: { [key: string]: string },
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const rule = rules[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
      return;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      return;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
      return;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
      return;
    }
  });

  return errors;
}

// common validation rules
export const emailRule: ValidationRule = {
  required: true,
};

export const passwordRule: ValidationRule = {
  required: true,
};

export const displayNameRule: ValidationRule = {
  required: true,
  minLength: 1,
  maxLength: 50,
};

export const usernameRule: ValidationRule = {
  required: true,
  minLength: 3,
  maxLength: 20,
  pattern: /^[a-z0-9_]+$/,
  message: 'username must be lowercase letters, numbers, or underscores',
};
