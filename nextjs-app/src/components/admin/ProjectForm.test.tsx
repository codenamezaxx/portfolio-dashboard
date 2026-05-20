/**
 * ProjectForm Component Tests
 * 
 * Tests for the project form component including:
 * - Form field rendering and validation
 * - Technology tags management (add/remove)
 * - URL validation for project links
 * - Image URL validation
 * - Form submission and error handling
 * - Loading states
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from './ProjectForm';
import type { ProjectInput } from '@/lib/validation';

// Mock UI components
jest.mock('@/components/ui', () => ({
  FormField: ({ label, name, value, onChange, error, touched, disabled, helperText, ...props }: any) => (
    <div data-testid={`field-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        data-testid={`input-${name}`}
        {...props}
      />
      {touched && error && <p data-testid={`error-${name}`}>{error}</p>}
      {helperText && <p data-testid={`helper-${name}`}>{helperText}</p>}
    </div>
  ),
  TextAreaField: ({ label, name, value, onChange, error, touched, disabled, ...props }: any) => (
    <div data-testid={`field-${name}`}>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        data-testid={`textarea-${name}`}
        {...props}
      />
      {touched && error && <p data-testid={`error-${name}`}>{error}</p>}
    </div>
  ),
  SelectField: ({ label, name, value, onChange, options, error, touched, disabled, ...props }: any) => (
    <div data-testid={`field-${name}`}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        data-testid={`select-${name}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {touched && error && <p data-testid={`error-${name}`}>{error}</p>}
    </div>
  ),
  Button: ({ children, type, disabled, variant, onClick, ...props }: any) => (
    <button type={type} disabled={disabled} onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
  FormGroup: ({ children }: any) => <div data-testid="form-group">{children}</div>,
  FormError: ({ message }: any) => <div data-testid="form-error">{message}</div>,
  FormSuccess: ({ message }: any) => <div data-testid="form-success">{message}</div>,
}));

// Mock useFormValidation hook
jest.mock('@/lib/useFormValidation', () => ({
  useFormValidation: ({ initialValues, schema, onSubmit }: any) => {
    const [values, setValues] = React.useState(initialValues);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await schema.parseAsync(values);
        await onSubmit(values);
      } catch (error: any) {
        if (error.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(error.fieldErrors).forEach(([key, messages]: [string, any]) => {
            fieldErrors[key] = messages[0];
          });
          setErrors(fieldErrors);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    const resetForm = () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    };

    const setFieldValue = (name: string, value: any) => {
      setValues((prev: any) => ({ ...prev, [name]: value }));
    };

    return {
      values,
      errors,
      touched,
      isSubmitting,
      isValid: Object.keys(errors).length === 0,
      handleChange,
      handleBlur,
      handleSubmit,
      resetForm,
      setFieldValue,
    };
  },
}));

describe('ProjectForm Component', () => {
  const mockOnSubmit = jest.fn();

  const defaultInitialData: ProjectInput = {
    title: 'Test Project',
    description: 'Test Description',
    category: 'web',
    imageUrl: 'https://example.com/image.jpg',
    technologies: ['React', 'TypeScript'],
    githubLink: 'https://github.com/test',
    liveLink: 'https://example.com',
    demoLink: '',
    displayOrder: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('field-title')).toBeInTheDocument();
      expect(screen.getByTestId('field-description')).toBeInTheDocument();
      expect(screen.getByTestId('field-category')).toBeInTheDocument();
      expect(screen.getByTestId('field-imageUrl')).toBeInTheDocument();
      expect(screen.getByTestId('field-githubLink')).toBeInTheDocument();
      expect(screen.getByTestId('field-liveLink')).toBeInTheDocument();
      expect(screen.getByTestId('field-demoLink')).toBeInTheDocument();
    });

    it('should render form labels', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Project Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Project Image URL')).toBeInTheDocument();
      expect(screen.getByText('Technologies')).toBeInTheDocument();
      expect(screen.getByText('GitHub Link')).toBeInTheDocument();
      expect(screen.getByText('Live Link')).toBeInTheDocument();
      expect(screen.getByText('Demo Link')).toBeInTheDocument();
    });

    it('should render category options', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const categorySelect = screen.getByTestId('select-category');
      expect(categorySelect).toBeInTheDocument();
      expect(screen.getByText('Web Application')).toBeInTheDocument();
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
      expect(screen.getByText('Desktop Application')).toBeInTheDocument();
      expect(screen.getByText('Library/Package')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('should render submit and reset buttons', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('Save Project')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('should populate form with initial data', () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      expect((screen.getByTestId('input-title') as HTMLInputElement).value).toBe('Test Project');
      expect((screen.getByTestId('textarea-description') as HTMLTextAreaElement).value).toBe('Test Description');
      expect((screen.getByTestId('select-category') as HTMLSelectElement).value).toBe('web');
    });
  });

  describe('Technology Tags Management', () => {
    it('should display existing technologies as tags', () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should add technology when Add button is clicked', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const techInput = screen.getByPlaceholderText('Add technology (e.g., React)');
      const addButton = screen.getByText('Add');

      await userEvent.type(techInput, 'Vue.js');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Vue.js')).toBeInTheDocument();
      });
    });

    it('should add technology when Enter key is pressed', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const techInput = screen.getByPlaceholderText('Add technology (e.g., React)');

      await userEvent.type(techInput, 'Node.js{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Node.js')).toBeInTheDocument();
      });
    });

    it('should remove technology when X button is clicked', () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const removeButtons = screen.getAllByText('×');
      fireEvent.click(removeButtons[0]);

      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should not add empty technology', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const addButton = screen.getByText('Add');
      fireEvent.click(addButton);

      // Button should be disabled when input is empty, so nothing should be added
      expect(addButton).toBeDisabled();
    });

    it('should trim whitespace from technology input', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const techInput = screen.getByPlaceholderText('Add technology (e.g., React)');
      const addButton = screen.getByText('Add');

      await userEvent.type(techInput, '  Python  ');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Python')).toBeInTheDocument();
      });
    });

    it('should disable Add button when input is empty', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const addButton = screen.getByText('Add');
      expect(addButton).toBeDisabled();
    });

    it('should enable Add button when input has text', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const techInput = screen.getByPlaceholderText('Add technology (e.g., React)');
      const addButton = screen.getByText('Add');

      await userEvent.type(techInput, 'Go');

      expect(addButton).not.toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should render all required field indicators', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });

    it('should have required attributes on form fields', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('input-title')).toHaveAttribute('required');
      expect(screen.getByTestId('textarea-description')).toHaveAttribute('required');
      expect(screen.getByTestId('select-category')).toHaveAttribute('required');
    });

    it('should accept valid form data', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should accept empty optional URL fields', async () => {
      const dataWithoutUrls: ProjectInput = {
        ...defaultInitialData,
        imageUrl: '',
        githubLink: '',
        liveLink: '',
        demoLink: '',
      };

      render(<ProjectForm initialData={dataWithoutUrls} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should display success message after submission', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
        expect(screen.getByText('Project saved successfully!')).toBeInTheDocument();
      });
    });

    it('should display error message on submission failure', async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error('Save failed'));

      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
      });
    });

    it('should disable submit button while submitting', async () => {
      mockOnSubmit.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeDisabled();
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial values', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByTestId('input-title') as HTMLInputElement;
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'New Title');

      expect(titleInput.value).toBe('New Title');

      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(titleInput.value).toBe('Test Project');
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form fields while loading', () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} isLoading={true} />);

      expect(screen.getByTestId('input-title')).toBeDisabled();
      expect(screen.getByTestId('textarea-description')).toBeDisabled();
      expect(screen.getByTestId('select-category')).toBeDisabled();
    });

    it('should disable submit button while loading', () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} isLoading={true} />);

      const submitButton = screen.getByText('Save Project');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text for optional fields', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('helper-imageUrl')).toHaveTextContent('Optional: URL to project image');
      expect(screen.getByTestId('helper-githubLink')).toHaveTextContent('Optional: Link to GitHub repository');
      expect(screen.getByTestId('helper-liveLink')).toHaveTextContent('Optional: Link to live project');
      expect(screen.getByTestId('helper-demoLink')).toHaveTextContent('Optional: Link to project demo');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByTestId('input-title');
      expect(titleInput).toHaveAttribute('id', 'title');
    });

    it('should mark required fields', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      const labels = screen.getAllByText(/\*/);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should have proper form structure', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('form-group')).toBeInTheDocument();
    });
  });

  describe('URL Validation', () => {
    it('should accept valid GitHub URLs', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should accept valid live URLs', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should accept empty optional URL fields', async () => {
      render(<ProjectForm initialData={defaultInitialData} onSubmit={mockOnSubmit} />);

      const demoInput = screen.getByTestId('input-demoLink');
      await userEvent.clear(demoInput);

      const submitButton = screen.getByText('Save Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
});
