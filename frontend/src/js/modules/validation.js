/**
 * Validation Module - Validações client-side
 */

class Validator {
  static email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static password(password) {
    return password && password.length >= 6;
  }

  static required(value) {
    return value && value.trim().length > 0;
  }

  static minLength(value, min) {
    return value && value.length >= min;
  }

  static maxLength(value, max) {
    return value && value.length <= max;
  }

  static number(value) {
    return !isNaN(value) && value >= 0;
  }

  static phone(phone) {
    const regex = /^[\d\s\-\(\)\+]*$/;
    return regex.test(phone);
  }

  static date(date) {
    return !isNaN(Date.parse(date));
  }

  static url(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validação em lote
  static validate(rules) {
    const errors = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = fieldRules.value;

      for (const rule of fieldRules.rules) {
        const [ruleName, ...args] = rule.split(':');

        let isValid = true;
        switch (ruleName) {
          case 'required':
            isValid = this.required(value);
            break;
          case 'email':
            isValid = this.email(value);
            break;
          case 'password':
            isValid = this.password(value);
            break;
          case 'minLength':
            isValid = this.minLength(value, parseInt(args[0]));
            break;
          case 'maxLength':
            isValid = this.maxLength(value, parseInt(args[0]));
            break;
          case 'number':
            isValid = this.number(value);
            break;
          case 'phone':
            isValid = this.phone(value);
            break;
          case 'date':
            isValid = this.date(value);
            break;
          case 'url':
            isValid = this.url(value);
            break;
        }

        if (!isValid) {
          errors[field] = fieldRules.message || `Campo ${field} é inválido`;
          break;
        }
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }
}
