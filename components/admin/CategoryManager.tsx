'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Category } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react'

interface CategoryManagerProps {
  initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  })

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', is_active: true })
    setEditingId(null)
    setIsAdding(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active,
    })
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const slug = formData.slug || generateSlug(formData.name)
      
      const categoryData = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
        is_active: formData.is_active,
      }

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            ...categoryData,
            display_order: categories.length,
          })

        if (error) throw error
      }

      router.refresh()
      resetForm()
    } catch (err: any) {
      console.error('Save error:', err)
      alert(err.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Items in this category will become uncategorized.`)) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('categories').delete().eq('id', id)
      
      if (error) throw error
      
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete category')
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentState })
        .eq('id', id)

      if (error) throw error
      
      router.refresh()
    } catch (err) {
      console.error('Toggle error:', err)
      alert('Failed to update category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      {!isAdding && !editingId && (
        <button
          onClick={() => {
            setIsAdding(true)
            resetForm()
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          Add Category
        </button>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="admin-card">
          <h2 className="font-display text-xl text-gold-200 mb-6">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="input-label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  setFormData({ 
                    ...formData, 
                    name,
                    slug: editingId ? formData.slug : generateSlug(name),
                  })
                }}
                className="input-luxury"
                placeholder="e.g., Watches & Timepieces"
              />
            </div>
            
            <div>
              <label className="input-label">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input-luxury"
                placeholder="watches-timepieces"
              />
              <p className="text-xs text-stone-600 mt-1">URL-friendly name (auto-generated)</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="input-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-luxury min-h-[80px]"
              placeholder="Brief description of this category..."
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 bg-dgw-charcoal border border-gold-400/30 text-gold-400"
              />
              <span className="text-sm text-stone-300">Active (visible on site)</span>
            </label>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSubmitting || !formData.name.trim()}
              className="btn-primary"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </button>
            <button onClick={resetForm} className="btn-outline">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Category</th>
              <th>Slug</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="text-stone-600">
                  <GripVertical size={16} />
                </td>
                <td>
                  <div>
                    <p className="text-stone-200 font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-stone-500 truncate max-w-[300px]">
                        {category.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="text-stone-500 font-mono text-sm">
                  {category.slug}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleActive(category.id, category.is_active)}
                    className={`status-badge cursor-pointer ${
                      category.is_active ? 'status-new' : 'status-closed'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-stone-500 hover:text-gold-400 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 text-stone-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-center text-stone-500 py-8">
            No categories yet. Add your first category above.
          </p>
        )}
      </div>
    </div>
  )
}
