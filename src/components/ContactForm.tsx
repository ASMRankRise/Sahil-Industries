"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Mail, Phone, User, MessageSquare, Check, X, Info } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface FieldState {
  value: string;
  error?: string;
  warning?: string;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
}

interface ContactFormProps {
  formType?: "contact" | "enquiry";
  onSuccess?: () => void;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const initialFieldState: FieldState = {
  value: "",
  isDirty: false,
  isTouched: false,
  isValidating: false,
};

const subjects = [
  { value: "general", label: "General Enquiry" },
  { value: "product", label: "Product Information" },
  { value: "quote", label: "Request a Quote" },
  { value: "support", label: "Technical Support" },
  { value: "career", label: "Career Opportunities" },
  { value: "other", label: "Other" },
];

// Validation rules types
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  asyncValidate?: boolean;
  format?: boolean;
}

interface ValidationRules {
  name: ValidationRule;
  email: ValidationRule;
  phone: ValidationRule;
  subject: ValidationRule;
  message: ValidationRule;
}

// Validation rules
const validationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-\.']+$/,
    patternMessage: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: "Please enter a valid email address",
    asyncValidate: true, // Simulate async validation
  },
  phone: {
    required: false,
    pattern: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,10}$/,
    patternMessage: "Please enter a valid phone number (e.g., +91 98765 43210)",
    format: true,
  },
  subject: {
    required: true,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
  },
};

export function ContactForm({ formType = "contact", onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fieldStates, setFieldStates] = useState<Record<keyof FormData, FieldState>>({
    name: initialFieldState,
    email: initialFieldState,
    phone: initialFieldState,
    subject: initialFieldState,
    message: initialFieldState,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());
  
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const asyncValidationCache = useRef<Record<string, boolean>>({});

  // Debounced validation
  const validateField = useCallback((name: keyof FormData, value: string, isBlur = false): Promise<{ error?: string; warning?: string }> => {
    const rules = validationRules[name];
    if (!rules) return Promise.resolve({});

    // Clear existing timeout
    if (validationTimeouts.current[name]) {
      clearTimeout(validationTimeouts.current[name]);
    }

    // For blur events, validate immediately
    // For change events, debounce
    const delay = isBlur ? 0 : 300;

    return new Promise<{ error?: string; warning?: string }>((resolve) => {
      validationTimeouts.current[name] = setTimeout(() => {
        let error: string | undefined;
        let warning: string | undefined;

        // Required validation
        if (rules.required && !value.trim()) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        // Min length
        else if (rules.minLength && value.trim().length > 0 && value.trim().length < rules.minLength) {
          error = `Must be at least ${rules.minLength} characters`;
        }
        // Max length
        else if (rules.maxLength && value.length > rules.maxLength) {
          error = `Must not exceed ${rules.maxLength} characters`;
        }
        // Pattern validation
        else if (rules.pattern && value.trim() && !rules.pattern.test(value)) {
          error = rules.patternMessage;
        }
        // Async validation simulation (e.g., check if email exists)
        else if (rules.asyncValidate && value.trim() && rules.pattern?.test(value)) {
          setFieldStates(prev => ({
            ...prev,
            [name]: { ...prev[name], isValidating: true }
          }));
          
          // Simulate API call
          setTimeout(() => {
            const isTaken = asyncValidationCache.current[value.toLowerCase()] || false;
            // For demo, mark common test emails as "taken"
            if (value.toLowerCase().includes('test@') || value.toLowerCase().includes('admin@')) {
              asyncValidationCache.current[value.toLowerCase()] = true;
              resolve({ warning: "This email is already registered. Did you mean to log in?" });
            } else {
              resolve({});
            }
            setFieldStates(prev => ({
              ...prev,
              [name]: { ...prev[name], isValidating: false }
            }));
          }, 500);
          return;
        }

        resolve({ error, warning });
      }, delay);
    });
  }, []);

  // Handle field change with real-time validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    // Format phone number as user types
    let formattedValue = value;
    if (fieldName === 'phone' && validationRules.phone.format) {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [fieldName]: formattedValue }));
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value: formattedValue, isDirty: true }
    }));

    // Real-time validation on change (debounced)
    validateField(fieldName, formattedValue).then(({ error, warning }) => {
      if (error || warning) {
        setFieldStates((prevState) => ({
          ...prevState,
          [fieldName]: { ...prevState[fieldName], error, warning }
        }));
      } else {
        // Check if field was touched using the current fieldStates
        setFieldStates((prevState) => {
          if (prevState[fieldName].isTouched) {
            // Clear error if field was touched and now valid
            return {
              ...prevState,
              [fieldName]: { ...prevState[fieldName], error: undefined, warning: undefined }
            };
          }
          return prevState;
        });
      }
    });
  }, []);

  // Handle field blur - validate immediately and mark as touched
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    setTouchedFields(prev => new Set(prev).add(fieldName));
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], isTouched: true }
    }));

    // Immediate validation on blur
    validateField(fieldName, value, true).then(({ error, warning }) => {
      setFieldStates(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], error, warning }
      }));
    });
  }, []);

  // Format phone number
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    
    // Indian phone number format: +91 XXXXX XXXXX
    if (digits.startsWith('91') && digits.length > 2) {
      const rest = digits.slice(2);
      if (rest.length <= 5) return `+91 ${rest}`;
      return `+91 ${rest.slice(0, 5)} ${rest.slice(5, 10)}`;
    }
    if (digits.length <= 10) {
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return `+${digits}`;
  };

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFieldStates = { ...fieldStates };

    (Object.keys(formData) as Array<keyof FormData>).forEach(fieldName => {
      const value = formData[fieldName];
      const rules = validationRules[fieldName];
      if (!rules) return;

      let error: string | undefined;
      
      if (rules.required && !value.trim()) {
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      } else if (rules.minLength && value.trim().length > 0 && value.trim().length < rules.minLength) {
        error = `Must be at least ${rules.minLength} characters`;
      } else if (rules.maxLength && value.length > rules.maxLength) {
        error = `Must not exceed ${rules.maxLength} characters`;
      } else if (rules.pattern && value.trim() && !rules.pattern.test(value)) {
        error = rules.patternMessage;
      }

      if (error) {
        isValid = false;
        newFieldStates[fieldName] = { ...newFieldStates[fieldName], error, isTouched: true };
      }
    });

    setFieldStates(newFieldStates);
    setTouchedFields(new Set(Object.keys(formData) as Array<keyof FormData>));
    return isValid;
  }, [formData, fieldStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData(initialFormData);
      setFieldStates({
        name: initialFieldState,
        email: initialFieldState,
        phone: initialFieldState,
        subject: initialFieldState,
        message: initialFieldState,
      });
      setTouchedFields(new Set());
      onSuccess?.();
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = useCallback(() => {
    return (
      formData.name.trim().length >= (validationRules.name.minLength ?? 2) &&
      validationRules.name.pattern?.test(formData.name.trim()) &&
      formData.email.trim().length > 0 &&
      validationRules.email.pattern?.test(formData.email) &&
      formData.subject &&
      formData.message.trim().length >= (validationRules.message.minLength ?? 10)
    );
  }, [formData]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const getFieldState = (name: keyof FormData) => {
    const state = fieldStates[name];
    const isTouched = touchedFields.has(name) || state.isTouched;
    const showValidation = isTouched || state.isDirty;
    
    return {
      ...state,
      isTouched,
      showValidation,
      isValid: showValidation && !state.error && !state.isValidating && state.value.trim().length > 0,
      isInvalid: showValidation && !!state.error,
      isWarning: showValidation && !!state.warning,
    };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AnimatePresence mode="wait">
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400"
            role="alert"
          >
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Message Sent Successfully!</p>
              <p className="text-sm opacity-90">We'll get back to you within 24 hours.</p>
            </div>
          </motion.div>
        )}
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
            role="alert"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Failed to Send Message</p>
              <p className="text-sm opacity-90">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          name="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("name")}
          isSubmitting={isSubmitting}
        />
        <Field
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          icon={Mail}
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("email")}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          icon={Phone}
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("phone")}
          isSubmitting={isSubmitting}
        />
        <SelectField
          name="subject"
          label="Subject"
          placeholder="Select a subject"
          icon={MessageSquare}
          required
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("subject")}
          isSubmitting={isSubmitting}
          options={subjects}
        />
      </div>

      <TextareaField
        name="message"
        label="Message"
        placeholder={`Describe your ${formType === "enquiry" ? "lifting requirement or project details" : "message or enquiry"}...`}
        required
        value={formData.message}
        onChange={handleChange}
        onBlur={handleBlur}
        fieldState={getFieldState("message")}
        isSubmitting={isSubmitting}
        maxLength={validationRules.message.maxLength ?? 5000}
      />

      <motion.button
        type="submit"
        disabled={isSubmitting || !isFormValid()}
        whileHover={{ scale: isFormValid() && !isSubmitting ? 1.02 : 1 }}
        whileTap={{ scale: isFormValid() && !isSubmitting ? 0.98 : 1 }}
        className={`flex items-center justify-center gap-3 w-full min-h-[54px] px-8 py-3 rounded-lg font-bold uppercase tracking-industrial text-ink transition-all duration-200 ${
          isSubmitting
            ? "bg-safety/50 cursor-not-allowed"
            : isFormValid()
            ? "bg-gradient-to-r from-safety to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-safety/25"
            : "bg-white/10 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Send {formType === "enquiry" ? "Enquiry" : "Message"}
          </>
        )}
      </motion.button>

      <p className="text-xs text-slate-400 text-center">
        By submitting this form, you agree to our{" "}
        <a href="/privacy" className="text-safety hover:underline">Privacy Policy</a>
        {" "}and{" "}
        <a href="/terms" className="text-safety hover:underline">Terms of Service</a>
      </p>
    </form>
  );
}

// Reusable Field Component
interface FieldStateType {
  value: string;
  error?: string;
  warning?: string;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  isValid: boolean;
  isInvalid: boolean;
  isWarning: boolean;
  showValidation: boolean;
}

interface FieldProps {
  name: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldState: FieldStateType;
  isSubmitting: boolean;
}

function Field({ name, label, type, placeholder, icon: Icon, required, autoComplete, value, onChange, onBlur, fieldState, isSubmitting }: FieldProps) {
  const { isValid, isInvalid, isWarning, isValidating, error, warning, showValidation } = fieldState;
  
  return (
    <div className="form-group space-y-2">
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-industrial text-ink flex items-center gap-1">
        {label} {required && <span className="text-safety">*</span>}
        {isValidating && <Loader2 className="w-3 h-3 text-safety animate-spin" title="Validating..." />}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-control min-h-[54px] w-full pl-12 pr-12 py-3 border border-ink/20 bg-white text-ink outline-none transition-all duration-200 ${
            isInvalid ? "border-red-500/50 focus:border-red-500 bg-red-500/5" :
            isValid ? "border-green-500/50 focus:border-green-500 bg-green-500/5" :
            isWarning ? "border-yellow-500/50 focus:border-yellow-500 bg-yellow-500/5" :
            "focus:border-safety/50 focus:bg-white focus:ring-2 focus:ring-safety/20"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          required={required}
          disabled={isSubmitting}
          autoComplete={autoComplete}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid || isWarning ? `${name}-message` : undefined}
        />
        {(isValid || isInvalid || isWarning) && !isValidating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isValid && <Check className="w-5 h-5 text-green-500" />}
            {isInvalid && <X className="w-5 h-5 text-red-500" />}
            {isWarning && <Info className="w-5 h-5 text-yellow-500" />}
          </div>
        )}
        {isValidating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-safety animate-spin" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {(isInvalid || isWarning) && showValidation && (
          <motion.p
            id={`${name}-message`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs flex items-center gap-1 ${isInvalid ? "text-red-500" : "text-yellow-500"}`}
          >
            {isInvalid && <AlertCircle className="w-3 h-3" />}
            {isWarning && <Info className="w-3 h-3" />}
            {error || warning}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Select Field Component
interface SelectFieldProps {
  name: keyof FormData;
  label: string;
  placeholder: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  fieldState: FieldStateType;
  isSubmitting: boolean;
  options: Array<{ value: string; label: string }>;
}

function SelectField({ name, label, placeholder, icon: Icon, required, value, onChange, onBlur, fieldState, isSubmitting, options }: SelectFieldProps) {
  const { isValid, isInvalid, isWarning, isValidating, error, warning, showValidation } = fieldState;
  
  return (
    <div className="form-group space-y-2">
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-industrial text-ink flex items-center gap-1">
        {label} {required && <span className="text-safety">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-control min-h-[54px] w-full pr-12 pl-4 py-3 border border-ink/20 bg-white text-ink outline-none transition-all duration-200 appearance-none ${
            isInvalid ? "border-red-500/50 focus:border-red-500 bg-red-500/5" :
            isValid ? "border-green-500/50 focus:border-green-500 bg-green-500/5" :
            isWarning ? "border-yellow-500/50 focus:border-yellow-500 bg-yellow-500/5" :
            "focus:border-safety/50 focus:bg-white focus:ring-2 focus:ring-safety/20"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          required={required}
          disabled={isSubmitting}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid || isWarning ? `${name}-message` : undefined}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        {(isValid || isInvalid || isWarning) && !isValidating && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isValid && <Check className="w-5 h-5 text-green-500" />}
            {isInvalid && <X className="w-5 h-5 text-red-500" />}
            {isWarning && <Info className="w-5 h-5 text-yellow-500" />}
          </div>
        )}
      </div>
      <AnimatePresence>
        {(isInvalid || isWarning) && showValidation && (
          <motion.p
            id={`${name}-message`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs flex items-center gap-1 ${isInvalid ? "text-red-500" : "text-yellow-500"}`}
          >
            {isInvalid && <AlertCircle className="w-3 h-3" />}
            {isWarning && <Info className="w-3 h-3" />}
            {error || warning}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Textarea Field Component
interface TextareaFieldProps {
  name: keyof FormData;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  fieldState: FieldStateType;
  isSubmitting: boolean;
  maxLength: number;
}

function TextareaField({ name, label, placeholder, required, value, onChange, onBlur, fieldState, isSubmitting, maxLength }: TextareaFieldProps) {
  const { isValid, isInvalid, isWarning, isValidating, error, warning, showValidation } = fieldState;
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;
  
  return (
    <div className="form-group space-y-2">
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-industrial text-ink flex items-center gap-1">
        {label} {required && <span className="text-safety">*</span>}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={5}
          maxLength={maxLength}
          className={`form-control min-h-[140px] w-full px-4 py-3 border border-ink/20 bg-white text-ink outline-none transition-all duration-200 resize-none ${
            isInvalid ? "border-red-500/50 focus:border-red-500 bg-red-500/5" :
            isValid ? "border-green-500/50 focus:border-green-500 bg-green-500/5" :
            isWarning ? "border-yellow-500/50 focus:border-yellow-500 bg-yellow-500/5" :
            "focus:border-safety/50 focus:bg-white focus:ring-2 focus:ring-safety/20"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          required={required}
          disabled={isSubmitting}
          aria-invalid={isInvalid}
          aria-describedby={`${name}-message ${name}-counter`}
        />
        {(isValid || isInvalid || isWarning) && !isValidating && (
          <div className="absolute right-4 top-4 flex items-center gap-1">
            {isValid && <Check className="w-5 h-5 text-green-500" />}
            {isInvalid && <X className="w-5 h-5 text-red-500" />}
            {isWarning && <Info className="w-5 h-5 text-yellow-500" />}
          </div>
        )}
      </div>
      <AnimatePresence>
        {(isInvalid || isWarning) && showValidation && (
          <motion.p
            id={`${name}-message`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs flex items-center gap-1 ${isInvalid ? "text-red-500" : "text-yellow-500"}`}
          >
            {isInvalid && <AlertCircle className="w-3 h-3" />}
            {isWarning && <Info className="w-3 h-3" />}
            {error || warning}
          </motion.p>
        )}
      </AnimatePresence>
      <p id={`${name}-counter`} className={`text-xs text-right transition-colors ${
        isOverLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-slate-400"
      }`}>
        {charCount}/{maxLength} characters
      </p>
    </div>
  );
}