export const FormValidationMessages = {
  email: {
    REQUIRED: 'Email is required',
    INVALID: 'Must be valid email',
  },
  password: {
    PATTERN: /^\S+$/,
    SPACE_NOT_ALLOWED: 'Password must not include space',
    REQUIRED: 'Password is required',
    MIN_LEN_6: 'Password must be at least 6 characters',
  },
  title: {
    REQUIRED: 'Title is required',
  },
  year: {
    REQUIRED: 'Year is required',
  }
}