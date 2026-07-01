/**
 * Journey Editor Component
 * 
 * Allows admins to manage journey timeline items:
 * - View list of items sorted by display order
 * - Add/Edit/Delete journey items
 * - Drag-and-drop reordering
 */

'use client';

import { useState, useEffect } from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { TextArea } from '@/components/ui/TextArea';
import { FormError } from '@/components/ui/FormError';
import { FormSuccess } from '@/components/ui/FormSuccess';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { JourneyItem } from '@/types';
import { journeyItemSchema } from '@/lib/validation';
import { z } from 'zod';
import { 
  Rocket, 
  Calendar, 
  GripVertical, 
  Edit2, 
  Trash2, 
  Plus,
  History
} from 'lucide-react';

type JourneyFormData = z.infer<typeof journeyItemSchema>;

export function JourneyEditor() {
  const toast = useToast();
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(JourneyFormData & { id?: string | number }) | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState<JourneyItem | null>(null);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<string | number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('/api/content/journey');
      if (!response.ok) throw new Error('Failed to fetch journey items');
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to load journey items.');
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (data: JourneyFormData): boolean => {
    try {
      journeyItemSchema.parse(data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>;
        if (fieldErrors.year) newErrors.year = fieldErrors.year[0];
        if (fieldErrors.title) newErrors.title = fieldErrors.title[0];
        if (fieldErrors.description) newErrors.description = fieldErrors.description[0];
        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const handleAddNew = () => {
    setEditingItem({ year: '', title: '', description: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (item: JourneyItem) => {
    setEditingItem({
      id: item.id,
      year: item.year,
      title: item.title,
      description: item.description,
      displayOrder: item.displayOrder,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm(editingItem)) return;

    setIsLoading(true);
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const response = await fetch('/api/content/journey', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!response.ok) throw new Error('Failed to save item');
      
      const successMsg = `Journey item ${editingItem.id ? 'updated' : 'added'} successfully!`;
      setSuccessMessage(successMsg);
      toast.success(successMsg);
      setIsFormOpen(false);
      fetchItems();
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetch('/api/revalidate', { method: 'POST', credentials: 'include' }).catch(() => {});
    } catch (error) {
      const msg = 'Failed to save journey item.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content/journey?id=${deleteConfirm.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      const deleteMsg = 'Journey item deleted.';
      setSuccessMessage(deleteMsg);
      toast.success(deleteMsg);
      setDeleteConfirm(null);
      fetchItems();
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetch('/api/revalidate', { method: 'POST', credentials: 'include' }).catch(() => {});
    } catch (error) {
      const msg = 'Failed to delete item.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (id: string | number) => setDraggedItem(id);
  const handleDragOver = (e: React.DragEvent, id: string | number) => {
    e.preventDefault();
    setDragOverItem(id);
  };
  const handleDrop = async (e: React.DragEvent, targetId: string | number) => {
    e.preventDefault();
    setDragOverItem(null);
    if (!draggedItem || draggedItem === targetId) return;

    const newItems = [...items];
    const draggedIdx = newItems.findIndex(i => i.id === draggedItem);
    const targetIdx = newItems.findIndex(i => i.id === targetId);
    const [removed] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, removed);

    const reordered = newItems.map((item, idx) => ({ ...item, displayOrder: idx }));
    setItems(reordered);

    try {
      await fetch('/api/content/journey', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reordered.map(i => ({ id: i.id, displayOrder: i.displayOrder }))),
      });
      toast.success('Journey order updated!');
    } catch (error) {
      const msg = 'Failed to save new order.';
      setErrorMessage(msg);
      toast.error(msg);
      fetchItems();
    }
  };

  if (isFetching) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10">
            <History className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Journey Manager</h1>
            <p className="text-body font-medium mt-1">Manage your professional career timeline</p>
          </div>
        </div>
        <button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Milestone
        </button>
      </div>

      {successMessage && <FormSuccess message={successMessage} />}
      {errorMessage && <FormError message={errorMessage} />}

      <div className="relative space-y-4">
        {/* Timeline track line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent ml-[3px] hidden md:block" />

        {items.length === 0 ? (
          <div className="bg-surface-card border-2 border-dashed border-line p-12 text-center">
            <p className="text-mute font-medium">No journey milestones yet.</p>
            <button onClick={handleAddNew} className="mt-4">Create your first milestone</button>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`relative flex items-start gap-4 md:gap-8 group cursor-move
                  ${dragOverItem === item.id ? 'translate-y-2' : ''} 
                  ${draggedItem === item.id ? 'opacity-50 grayscale' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:flex flex-shrink-0 w-8 h-8 bg-surface-card border-4 border-primary/20 items-center justify-center relative z-10">
                  <div className="w-2 h-2 bg-primary" />
                </div>

                {/* Milestone Card */}
                <div className="flex-1 bg-primary/5 dark:bg-white/5 border border-primary/10 border-line p-5 md:p-6 hover:border-primary/30">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary font-black px-4 py-1 text-xs uppercase tracking-[0.1em]">
                          {item.year}
                        </span>
                        <div className="p-1 opacity-0">
                          <GripVertical className="w-4 h-4 text-mute" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-ink dark:text-ink group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-body dark:text-body/80 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end md:self-start">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline hover:border-primary hover:text-primary transition-all shadow-sm"
                        title="Edit milestone"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(item)}
                        className="p-2 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline hover:border-accent-red hover:text-accent-red transition-all shadow-sm"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingItem?.id ? 'Edit Milestone' : 'Add New Milestone'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <TextInput 
            label="Year / Period" 
            name="year"
            placeholder="e.g. 2023 or 2021 - Present" 
            value={editingItem?.year || ''} 
            onChange={e => setEditingItem(prev => prev ? { ...prev, year: e.target.value } : null)}
            error={formErrors.year}
            disabled={isLoading}
            className="h-11 focus:ring-primary/50 focus:border-primary"
          />
          <TextInput 
            label="Title" 
            name="title"
            placeholder="e.g. Software Engineer at Google" 
            value={editingItem?.title || ''} 
            onChange={e => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
            error={formErrors.title}
            disabled={isLoading}
            className="h-11 focus:ring-primary/50 focus:border-primary"
          />
          <TextArea 
            label="Description" 
            name="description"
            placeholder="Describe your achievements or responsibilities" 
            value={editingItem?.description || ''} 
            onChange={e => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
            error={formErrors.description}
            rows={5}
            disabled={isLoading}
            className="focus:ring-primary/50 focus:border-primary min-h-[150px]"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
            <Button variant="ghost" onClick={() => setIsFormOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="px-8 shadow-lg shadow-primary/20">
              <Rocket className="w-4 h-4 mr-2" /> Save Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-body">Are you sure you want to delete milestone <strong>{deleteConfirm?.title}</strong>?</p>
          <p className="text-xs text-accent-red font-bold uppercase tracking-wider">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
