"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTemplates() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Get templates error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTemplateById(templateId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Get template by id error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTemplateBySlug(slug: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Get template by slug error:", error);
    return { success: false, error: error.message };
  }
}

export async function createTemplate(data: {
  name: string;
  slug: string;
  description?: string;
  subject: string;
  body_html: string;
  body_text?: string;
  category: string;
  available_variables: string[];
  is_active?: boolean;
  is_default?: boolean;
  preview_data?: Record<string, string>;
}) {
  try {
    const supabase = await createClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("email_templates")
      .select("id")
      .eq("slug", data.slug)
      .single();

    if (existing) {
      return { success: false, error: "این slug قبلاً استفاده شده است" };
    }

    const { error } = await supabase.from("email_templates").insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Create template error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTemplate(
  templateId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    subject?: string;
    body_html?: string;
    body_text?: string;
    category?: string;
    available_variables?: string[];
    is_active?: boolean;
    is_default?: boolean;
    preview_data?: Record<string, string>;
  }
) {
  try {
    const supabase = await createClient();

    // If slug is being changed, check if new slug exists
    if (data.slug) {
      const { data: existing } = await supabase
        .from("email_templates")
        .select("id")
        .eq("slug", data.slug)
        .neq("id", templateId)
        .single();

      if (existing) {
        return { success: false, error: "این slug قبلاً استفاده شده است" };
      }
    }

    const { error } = await supabase
      .from("email_templates")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", templateId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update template error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    const supabase = await createClient();

    // Check if it's a default template
    const { data: template } = await supabase
      .from("email_templates")
      .select("is_default, slug")
      .eq("id", templateId)
      .single();

    if (template?.is_default) {
      return {
        success: false,
        error: "قالب‌های پیش‌فرض قابل حذف نیستند",
      };
    }

    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", templateId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Delete template error:", error);
    return { success: false, error: error.message };
  }
}

export async function duplicateTemplate(templateId: string) {
  try {
    const supabase = await createClient();

    // Get original template
    const { data: original, error: fetchError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (fetchError) throw fetchError;

    if (!original) {
      return { success: false, error: "قالب یافت نشد" };
    }

    // Generate unique slug
    const timestamp = Date.now();
    const newSlug = `${original.slug}-copy-${timestamp}`;

    // Create duplicate
    const { error: insertError } = await supabase.from("email_templates").insert({
      name: `${original.name} (کپی)`,
      slug: newSlug,
      description: original.description,
      subject: original.subject,
      body_html: original.body_html,
      body_text: original.body_text,
      category: original.category,
      available_variables: original.available_variables,
      is_active: false, // Deactivate by default
      is_default: false, // Never default
      preview_data: original.preview_data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;

    return { success: true };
  } catch (error: any) {
    console.error("Duplicate template error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleTemplateStatus(templateId: string) {
  try {
    const supabase = await createClient();

    // Get current status
    const { data: template } = await supabase
      .from("email_templates")
      .select("is_active")
      .eq("id", templateId)
      .single();

    if (!template) {
      return { success: false, error: "قالب یافت نشد" };
    }

    // Toggle status
    const { error } = await supabase
      .from("email_templates")
      .update({
        is_active: !template.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", templateId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Toggle template status error:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to render template with variables
export async function renderTemplate(
  slug: string,
  variables: Record<string, string>
) {
  try {
    const result = await getTemplateBySlug(slug);

    if (!result.success || !result.data) {
      return { success: false, error: "قالب یافت نشد" };
    }

    const template = result.data;

    // Replace variables in subject
    let renderedSubject = template.subject;
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedSubject = renderedSubject.replace(regex, variables[key]);
    });

    // Replace variables in body
    let renderedBody = template.body_html;
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedBody = renderedBody.replace(regex, variables[key]);
    });

    return {
      success: true,
      data: {
        subject: renderedSubject,
        body_html: renderedBody,
        body_text: template.body_text,
      },
    };
  } catch (error: any) {
    console.error("Render template error:", error);
    return { success: false, error: error.message };
  }
}

// Function to send email using template
export async function sendEmailFromTemplate(data: {
  slug: string;
  to: string;
  variables: Record<string, string>;
}) {
  try {
    // Render template
    const renderResult = await renderTemplate(data.slug, data.variables);

    if (!renderResult.success || !renderResult.data) {
      return { success: false, error: "خطا در رندر قالب" };
    }

    // TODO: Integrate with email service (e.g., SendGrid, AWS SES, etc.)
    // For now, we'll just log it
    console.log("Sending email:", {
      to: data.to,
      subject: renderResult.data.subject,
      html: renderResult.data.body_html,
    });

    // Simulate sending
    return { success: true, message: "ایمیل با موفقیت ارسال شد" };
  } catch (error: any) {
    console.error("Send email error:", error);
    return { success: false, error: error.message };
  }
}
