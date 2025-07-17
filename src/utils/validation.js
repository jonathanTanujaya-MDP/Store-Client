export const validationRules = {
  product: {
    name: {
      required: 'Product name is required',
      minLength: { value: 2, message: 'Minimum 2 characters' },
      maxLength: { value: 100, message: 'Maximum 100 characters' }
    },
    price: {
      required: 'Price is required',
      min: { value: 0.01, message: 'Price must be greater than 0' },
      pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price format' }
    },
    stock: {
      required: 'Stock is required',
      min: { value: 0, message: 'Stock cannot be negative' },
      pattern: { value: /^\d+$/, message: 'Stock must be a whole number' }
    }
  },
  transaction: {
    customer: {
      required: 'Customer name is required',
      minLength: { value: 2, message: 'Minimum 2 characters' }
    },
    quantity: {
      required: 'Quantity is required',
      min: { value: 1, message: 'Minimum quantity is 1' }
    }
  }
};

export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  return error?.message || 'Invalid input';
};
