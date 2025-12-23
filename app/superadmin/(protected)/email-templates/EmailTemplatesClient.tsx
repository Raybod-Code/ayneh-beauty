"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  Save,
  X,
  Code,
  Smartphone,
  Monitor,
  Sparkles,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTemplates,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
} from "./actions";

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  subject: string;
  body_html: string;
  body_text?: string;
  category: string;
  available_variables: string[];
  is_active: boolean;
  is_default: boolean;
  preview_data: Record<string, string>;
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: "all", label: "همه", color: "brand-gold" },
  { value: "system", label: "سیستمی", color: "blue-500" },
  { value: "booking", label: "رزرو", color: "green-500" },
  { value: "customer", label: "مشتری", color: "purple-500" },
  { value: "staff", label: "کارمند", color: "orange-500" },
  { value: "payment", label: "پرداخت", color: "emerald-500" },
  { value: "marketing", label: "بازاریابی", color: "pink-500" },
];

export default function EmailTemplatesClient() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const result = await getTemplates();
    if (result.success && result.data) {
      setTemplates(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("آیا از حذف این قالب اطمینان دارید؟")) return;

    const result = await deleteTemplate(templateId);
    if (result.success) {
      toast.success("قالب حذف شد");
      loadTemplates();
    } else {
      toast.error("خطا در حذف قالب");
    }
  };

  const handleDuplicate = async (templateId: string) => {
    const result = await duplicateTemplate(templateId);
    if (result.success) {
      toast.success("قالب کپی شد");
      loadTemplates();
    } else {
      toast.error("خطا در کپی قالب");
    }
  };

  const filteredTemplates = templates
    .filter(
      (t) => selectedCategory === "all" || t.category === selectedCategory
    )
    .filter((t) => {
      if (!searchQuery) return true;
      return (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.value === category)?.color || "gray-500";
  };

  const renderPreview = (html: string, previewData: Record<string, string>) => {
    let rendered = html;
    Object.keys(previewData).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, previewData[key]);
    });
    return rendered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/20 to-yellow-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">
                    همه قالب‌ها
                  </div>
                  <div className="text-3xl font-black text-white">
                    {templates.length}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">فعال</div>
                  <div className="text-3xl font-black text-white">
                    {templates.filter((t) => t.is_active).length}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Sparkles
                    className="w-6 h-6 text-green-400"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">دسته‌بندی</div>
                  <div className="text-3xl font-black text-white">
                    {new Set(templates.map((t) => t.category)).size}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Filter
                    className="w-6 h-6 text-purple-400"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">پیش‌فرض</div>
                  <div className="text-3xl font-black text-white">
                    {templates.filter((t) => t.is_default).length}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-400" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray"
                strokeWidth={2.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در قالب‌ها..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all
                    ${
                      selectedCategory === cat.value
                        ? `bg-${cat.color}/20 text-${cat.color} border border-${cat.color}/30`
                        : "bg-white/[0.02] text-brand-gray hover:text-white border border-white/10"
                    }
                  `}
                >
                  {cat.label}
                  {cat.value !== "all" && (
                    <span className="mr-2 text-xs opacity-70">
                      (
                      {templates.filter((t) => t.category === cat.value).length}
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r from-${getCategoryColor(
                    template.category
                  )}/20 to-${getCategoryColor(
                    template.category
                  )}/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300`}
                />

                <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white mb-1 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-brand-gray line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex gap-2">
                      {template.is_default && (
                        <div className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <span className="text-[10px] font-bold text-blue-400">
                            پیش‌فرض
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-2 py-1 rounded-lg ${
                          template.is_active
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-red-500/10 border border-red-500/20"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold ${
                            template.is_active
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {template.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-2 h-2 rounded-full bg-${getCategoryColor(
                        template.category
                      )}`}
                    />
                    <span className="text-xs text-brand-gray">
                      {
                        categories.find((c) => c.value === template.category)
                          ?.label
                      }
                    </span>
                  </div>

                  {/* Subject Preview */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 mb-4 flex-1">
                    <div className="text-xs text-brand-gray mb-1">موضوع:</div>
                    <div className="text-sm text-white line-clamp-2">
                      {template.subject}
                    </div>
                  </div>

                  {/* Variables */}
                  <div className="mb-4">
                    <div className="text-xs text-brand-gray mb-2">متغیرها:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.available_variables
                        .slice(0, 3)
                        .map((variable, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-1 rounded-lg font-mono"
                          >
                            {variable}
                          </span>
                        ))}
                      {template.available_variables.length > 3 && (
                        <span className="text-[10px] text-brand-gray px-2 py-1">
                          +{template.available_variables.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl px-3 py-2 text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
                      پیش‌نمایش
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 text-brand-gold rounded-xl px-3 py-2 text-xs font-bold transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
                      ویرایش
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDuplicate(template.id)}
                      className="flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(template.id)}
                      className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl px-3 py-2 text-xs font-bold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTemplates.length === 0 && (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Mail
                    className="w-10 h-10 text-brand-gold"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  قالبی یافت نشد
                </h3>
                <p className="text-brand-gray text-sm">
                  {searchQuery
                    ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                    : "هنوز قالبی ایجاد نشده است"}
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewTemplate && (
            <PreviewModal
              template={previewTemplate}
              onClose={() => setPreviewTemplate(null)}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              renderPreview={renderPreview}
            />
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingTemplate && (
            <EditModal
              template={editingTemplate}
              onClose={() => setEditingTemplate(null)}
              onSave={loadTemplates}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Preview Modal Component
function PreviewModal({
  template,
  onClose,
  previewMode,
  setPreviewMode,
  renderPreview,
}: {
  template: EmailTemplate;
  onClose: () => void;
  previewMode: "desktop" | "mobile";
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  renderPreview: (html: string, data: Record<string, string>) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-black text-white">{template.name}</h2>
            <p className="text-sm text-brand-gray mt-1">{template.subject}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/[0.02] border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`
                  px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                  ${
                    previewMode === "desktop"
                      ? "bg-brand-gold text-black"
                      : "text-brand-gray hover:text-white"
                  }
                `}
              >
                <Monitor className="w-4 h-4" strokeWidth={2.5} />
                دسکتاپ
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`
                  px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                  ${
                    previewMode === "mobile"
                      ? "bg-brand-gold text-black"
                      : "text-brand-gray hover:text-white"
                  }
                `}
              >
                <Smartphone className="w-4 h-4" strokeWidth={2.5} />
                موبایل
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-[#0a0a0a] p-8">
          <div className="flex justify-center">
            <div
              className={`
                bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300
                ${previewMode === "mobile" ? "max-w-[375px]" : "max-w-[600px]"}
              `}
            >
              <iframe
                srcDoc={renderPreview(
                  template.body_html,
                  template.preview_data
                )}
                className="w-full h-[600px] border-0"
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// // Edit Modal Component (بعداً می‌سازیم)
// function EditModal({
//   template,
//   onClose,
//   onSave,
// }: {
//   template: EmailTemplate;
//   onClose: () => void;
//   onSave: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//       className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//         className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
//       >
//         <div className="p-6">
//           <h2 className="text-2xl font-black text-white mb-4">ویرایش قالب</h2>
//           <p className="text-brand-gray">در حال توسعه...</p>
//           <button
//             onClick={onClose}
//             className="mt-4 bg-brand-gold text-black rounded-2xl px-6 py-3 font-bold"
//           >
//             بستن
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }
// Edit Modal Component (Full Version)
function EditModal({
  template,
  onClose,
  onSave,
}: {
  template: EmailTemplate;
  onClose: () => void;
  onSave: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: template.name,
    subject: template.subject,
    body_html: template.body_html,
    is_active: template.is_active,
  });

  const handleSave = async () => {
    setLoading(true);
    const result = await updateTemplate(template.id, formData);
    setLoading(false);

    if (result.success) {
      toast.success("✅ قالب با موفقیت بروزرسانی شد");
      onSave();
      onClose();
    } else {
      toast.error("❌ خطا در بروزرسانی قالب");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-black text-white">ویرایش قالب</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              نام قالب
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              موضوع ایمیل
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
            />
          </div>

          {/* Body HTML */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              محتوای HTML
            </label>
            <textarea
              value={formData.body_html}
              onChange={(e) =>
                setFormData({ ...formData, body_html: e.target.value })
              }
              rows={15}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all resize-none font-mono text-sm"
            />
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-white/20 checked:bg-brand-gold checked:border-brand-gold"
              />
              <span className="text-sm font-bold text-white">فعال</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white rounded-2xl px-6 py-3 font-bold transition-colors"
          >
            انصراف
          </button>

          <motion.button
            onClick={handleSave}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-black rounded-2xl px-6 py-3 font-bold shadow-lg shadow-brand-gold/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" strokeWidth={2.5} />
                ذخیره تغییرات
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
