/**
 * ProjectForm Component
 * 
 * Example form component for managing project data.
 * Demonstrates validation of multiple fields including arrays.
 */

'use client';

import { useState } from 'react';
import { useFormValidation } from '@/lib/useFormValidation';
import { projectSchema, type ProjectInput } from '@/lib/validation';
import { FormField, TextAreaField, SelectField, Button, FormGroup } from '@/components/ui';
import { FormError, FormSuccess } from '@/components/ui';
import { uploadImageApi } from '@/lib/upload-utils';

interface ProjectFormProps {
  initialData?: ProjectInput;
  onSubmit: (data: ProjectInput) => Promise<void>;
  isLoading?: boolean;
}

const defaultValues: ProjectInput = {
  title: '',
  description: '',
  category: '',
  imageUrl: '',
  technologies: [],
  githubLink: '',
  liveLink: '',
  demoLink: '',
  displayOrder: 0,
};

const categoryOptions = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'desktop', label: 'Desktop Application' },
  { value: 'library', label: 'Library/Package' },
  { value: 'other', label: 'Other' },
];

export function ProjectForm({
  initialData = defaultValues,
  onSubmit,
  isLoading = false,
}: ProjectFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size exceeds maximum of 5MB');
      return;
    }

    // Validate format
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setSubmitError('Only JPG, PNG, WebP, and SVG images are allowed');
      return;
    }

    setIsUploadingImage(true);
    setSubmitError(null);
    try {
      const result = await uploadImageApi(file, { folder: 'projects' });
      form.setFieldValue('imageUrl', result.url);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const form = useFormValidation({
    initialValues: initialData,
    schema: projectSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        await onSubmit(values);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
  });

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      const newTechs = [...form.values.technologies, techInput.trim()];
      form.setFieldValue('technologies', newTechs);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    const newTechs = form.values.technologies.filter((_, i) => i !== index);
    form.setFieldValue('technologies', newTechs);
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {submitError && <FormError message={submitError} />}

      {/* Success Alert */}
      {submitSuccess && (
        <FormSuccess message="Project saved successfully!" />
      )}

      {/* Form Fields */}
      <FormGroup>
        <FormField
          label="Project Title"
          name="title"
          type="text"
          placeholder="Enter project title"
          value={form.values.title}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.title}
          touched={form.touched.title}
          required
          variant="admin"
          disabled={isLoading || form.isSubmitting}
        />

        <TextAreaField
          label="Description"
          name="description"
          placeholder="Describe your project"
          value={form.values.description}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.description}
          touched={form.touched.description}
          required
          variant="admin"
          disabled={isLoading || form.isSubmitting}
        />

        <SelectField
          label="Category"
          name="category"
          value={form.values.category}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.category}
          touched={form.touched.category}
          options={categoryOptions}
          placeholder="Select a category"
          required
          variant="admin"
          disabled={isLoading || form.isSubmitting}
        />

        {/* Project Preview Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Gambar Preview Proyek
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              placeholder={isUploadingImage ? "Mengunggah gambar..." : "Belum ada gambar terpilih"}
              value={form.values.imageUrl || ''}
              className="flex-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:outline-none text-sm cursor-not-allowed opacity-80"
            />
            <input
              type="file"
              id="project-image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading || form.isSubmitting || isUploadingImage}
            />
            <button
              type="button"
              onClick={() => document.getElementById('project-image-upload')?.click()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
              disabled={isLoading || form.isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? 'Mengunggah...' : 'Pilih Gambar'}
            </button>
          </div>
          
          {form.values.imageUrl && (
            <div className="flex items-center gap-3 mt-2 p-2 border border-[var(--border)] rounded-lg">
              <div className="relative w-12 h-12 rounded overflow-hidden border border-[var(--border)] flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                <img
                  src={form.values.imageUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--muted)] truncate">{form.values.imageUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => form.setFieldValue('imageUrl', '')}
                className="text-xs text-red-500 hover:text-red-400 font-semibold px-2 py-1"
                disabled={isLoading || form.isSubmitting || isUploadingImage}
              >
                Hapus
              </button>
            </div>
          )}
          
          {form.errors.imageUrl && form.touched.imageUrl && (
            <p className="text-sm text-red-400">{form.errors.imageUrl}</p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Technologies <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTechnology();
                }
              }}
              placeholder="Add technology (e.g., React)"
              className="flex-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              disabled={isLoading || form.isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTechnology}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading || form.isSubmitting || !techInput.trim()}
            >
              Add
            </button>
          </div>
          {form.errors.technologies && form.touched.technologies && (
            <p className="text-sm text-red-400">{form.errors.technologies}</p>
          )}
          {form.values.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.values.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full"
                >
                  <span className="text-sm text-blue-400">{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(index)}
                    className="text-blue-400 hover:text-blue-300 font-bold"
                    disabled={isLoading || form.isSubmitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          label="GitHub Link"
          name="githubLink"
          type="url"
          placeholder="https://github.com/..."
          value={form.values.githubLink || ''}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.githubLink}
          touched={form.touched.githubLink}
          variant="admin"
          disabled={isLoading || form.isSubmitting}
          helperText="Optional: Link to GitHub repository"
        />

        <FormField
          label="Live Link"
          name="liveLink"
          type="url"
          placeholder="https://example.com"
          value={form.values.liveLink || ''}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.liveLink}
          touched={form.touched.liveLink}
          variant="admin"
          disabled={isLoading || form.isSubmitting}
          helperText="Optional: Link to live project"
        />

        <FormField
          label="Demo Link"
          name="demoLink"
          type="url"
          placeholder="https://demo.example.com"
          value={form.values.demoLink || ''}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.demoLink}
          touched={form.touched.demoLink}
          variant="admin"
          disabled={isLoading || form.isSubmitting}
          helperText="Optional: Link to project demo"
        />
      </FormGroup>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || form.isSubmitting || !form.isValid}
          className="flex-1"
        >
          {form.isSubmitting ? 'Saving...' : 'Save Project'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={form.resetForm}
          disabled={isLoading || form.isSubmitting}
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
