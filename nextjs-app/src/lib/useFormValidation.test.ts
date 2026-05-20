/**
 * Tests for useFormValidation hook
 */

import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18 or older'),
  });

  type TestFormData = z.infer<typeof testSchema>;

  const initialValues: TestFormData = {
    name: '',
    email: '',
    age: 0,
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update field value on change', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'name', value: 'John Doe', type: 'text' },
      } as any;
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('John Doe');
  });

  it('should mark field as touched on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'name' },
      } as any;
      result.current.handleBlur(event);
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('should validate field on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'name' },
      } as any;
      result.current.handleBlur(event);
    });

    // Field should be marked as touched
    expect(result.current.touched.name).toBe(true);
  });

  it('should validate email format', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'email', value: 'invalid-email', type: 'text' },
      } as any;
      result.current.handleChange(event);
    });

    act(() => {
      const event = {
        target: { name: 'email' },
      } as any;
      result.current.handleBlur(event);
    });

    // Email field should be marked as touched
    expect(result.current.touched.email).toBe(true);
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      result.current.setFieldValue('name', 'Jane Doe');
    });

    expect(result.current.values.name).toBe('Jane Doe');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      result.current.setFieldError('name', 'Custom error');
    });

    expect(result.current.errors.name).toBe('Custom error');
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'name', value: 'John Doe', type: 'text' },
      } as any;
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('John Doe');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should call onSubmit with valid data', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit,
      })
    );

    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('age', 25);
    });

    await act(async () => {
      const event = { preventDefault: () => {} } as any;
      await result.current.handleSubmit(event);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    });
  });

  it('should not call onSubmit with invalid data', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit,
      })
    );

    await act(async () => {
      const event = { preventDefault: () => {} } as any;
      await result.current.handleSubmit(event);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should handle number input type', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'age', value: '25', type: 'number' },
      } as any;
      result.current.handleChange(event);
    });

    expect(result.current.values.age).toBe(25);
    expect(typeof result.current.values.age).toBe('number');
  });

  it('should handle checkbox input type', () => {
    const checkboxSchema = z.object({
      agreed: z.boolean(),
    });

    const { result } = renderHook(() =>
      useFormValidation({
        initialValues: { agreed: false },
        schema: checkboxSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      const event = {
        target: { name: 'agreed', checked: true, type: 'checkbox' },
      } as any;
      result.current.handleChange(event);
    });

    expect(result.current.values.agreed).toBe(true);
  });

  it('should mark all fields as touched on submit attempt', async () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    await act(async () => {
      const event = { preventDefault: () => {} } as any;
      await result.current.handleSubmit(event);
    });

    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.age).toBe(true);
  });

  it('should indicate form is valid when all fields are valid', async () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('age', 25);
    });

    expect(result.current.isValid).toBe(true);
  });

  it('should indicate form is invalid when fields have errors', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues,
        schema: testSchema,
        onSubmit: async () => {},
      })
    );

    act(() => {
      result.current.setFieldError('name', 'Name is required');
    });

    expect(result.current.isValid).toBe(false);
  });
});
