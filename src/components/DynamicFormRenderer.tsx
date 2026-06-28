import React, { useState } from 'react';
import { DynamicForm, DynamicField } from '../types';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface DynamicFormRendererProps {
  form: DynamicForm;
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function DynamicFormRenderer({
  form,
  onSubmit,
  submitLabel = "إرسال الطلب وحجز مقعدك",
  isSubmitting = false
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `حقل "${field.label}" مطلوب ويجب ملؤه`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-right">
      <div className="text-right border-b border-slate-100 pb-4 mb-4">
        <h3 className="text-xl font-bold text-[#0F172A] flex items-center justify-start gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {form.title}
        </h3>
        {form.description && (
          <p className="text-sm text-slate-500 mt-1">
            {form.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {form.fields.map((field) => {
          const isError = !!errors[field.id];
          return (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center justify-start gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-colors text-right relative ${
                    isError ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">-- اختر من القائمة --</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  rows={4}
                  placeholder={`اكتب ${field.label}...`}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-colors text-right resize-none ${
                    isError ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              ) : (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={`اكتب ${field.label}...`}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-colors text-right ${
                    isError ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              )}

              {isError && (
                <p className="text-xs text-red-500 font-semibold mt-0.5">
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-3.5 px-6 font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-sm active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
