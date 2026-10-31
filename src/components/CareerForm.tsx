"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Mail, Phone, User, MessageSquare, Check, X, Info, Upload, FileText } from "lucide-react";

interface CareerFormData {
  fullname: string;
  email: string;
  mobile: string;
  city: string;
  message: string;
  resume: File | null;
  captcha: string;
}

interface CareerFormErrors {
  fullname?: string;
  email?: string;
  mobile?: string;
  city?: string;
  message?: string;
  resume?: string;
  captcha?: string;
}

interface CareerFieldState {
  value: string;
  error?: string;
  warning?: string;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
}

interface CareerFormProps {
  onSuccess?: () => void;
}

const initialFormData: CareerFormData = {
  fullname: "",
  email: "",
  mobile: "",
  city: "",
  message: "",
  resume: null,
  captcha: "",
};

const initialFieldState: CareerFieldState = {
  value: "",
  isDirty: false,
  isTouched: false,
  isValidating: false,
};

// Validation rules
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
  fullname: ValidationRule;
  email: ValidationRule;
  mobile: ValidationRule;
  city: ValidationRule;
  message: ValidationRule;
  resume: ValidationRule;
  captcha: ValidationRule;
}

const validationRules: ValidationRules = {
  fullname: {
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
    asyncValidate: true,
  },
  mobile: {
    required: true,
    pattern: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,10}$/,
    patternMessage: "Please enter a valid phone number (e.g., +91 98765 43210)",
    format: true,
  },
  city: {
    required: false,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-\.']+$/,
    patternMessage: "City name can only contain letters, spaces, hyphens, apostrophes, and periods",
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  resume: {
    required: true,
  },
  captcha: {
    required: true,
    minLength: 4,
    maxLength: 10,
  },
};

export function CareerForm({ onSuccess }: CareerFormProps) {
  const [formData, setFormData] = useState<CareerFormData>(initialFormData);
  const [fieldStates, setFieldStates] = useState<Record<keyof CareerFormData, CareerFieldState>>({
    fullname: initialFieldState,
    email: initialFieldState,
    mobile: initialFieldState,
    city: initialFieldState,
    message: initialFieldState,
    resume: initialFieldState,
    captcha: initialFieldState,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState<Set<keyof CareerFormData>>(new Set());
  
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const asyncValidationCache = useRef<Record<string, boolean>>({});

  // Debounced validation
  const validateField = useCallback((name: keyof CareerFormData, value: string, isBlur = false): Promise<{ error?: string; warning?: string }> => {
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
        else if (rules.minLength && value.trim().length > 0 && value.trim().length < (rules.minLength ?? 0)) {
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
          setFieldStates(prevState => ({
            ...prevState,
            [name]: { ...prevState[name], isValidating: true }
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
            setFieldStates(prevState => ({
              ...prevState,
              [name]: { ...prevState[name], isValidating: false }
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
    const fieldName = name as keyof CareerFormData;
    
    // Format phone number as user types
    let formattedValue = value;
    if (fieldName === 'mobile' && validationRules.mobile.format) {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [fieldName]: formattedValue }));
    setFieldStates((prevState) => ({
      ...prevState,
      [fieldName]: { ...prevState[fieldName], value: formattedValue, isDirty: true }
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

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFieldStates(prev => ({
          ...prev,
          resume: { ...prev.resume, error: "Please upload a PDF, DOC, or DOCX file" }
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldStates(prev => ({
          ...prev,
          resume: { ...prev.resume, error: "File size must be less than 5MB" }
        }));
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setFieldStates(prev => ({
        ...prev,
        resume: { ...prev.resume, value: file.name, isDirty: true, error: undefined }
      }));
    }
  }, []);

  // Handle field blur - validate immediately and mark as touched
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof CareerFormData;
    
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

    (Object.keys(formData) as Array<keyof CareerFormData>).forEach(fieldName => {
      const value = fieldName === 'resume' ? (formData[fieldName] as File)?.name || '' : formData[fieldName] as string;
      const rules = validationRules[fieldName];
      if (!rules) return;

      let error: string | undefined;
      
      if (rules.required && !value.trim()) {
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      } else if (rules.minLength && value.trim().length > 0 && value.trim().length < (rules.minLength ?? 0)) {
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
    setTouchedFields(new Set(Object.keys(formData) as Array<keyof CareerFormData>));
    return isValid;
  }, [formData, fieldStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('fullname', formData.fullname);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('mobile', formData.mobile);
      formDataToSubmit.append('city', formData.city);
      formDataToSubmit.append('message', formData.message);
      formDataToSubmit.append('captcha', formData.captcha);
      
      if (formData.resume) {
        formDataToSubmit.append('uploaded_file', formData.resume);
      }

      // Add hidden values
      const hiddenValues = [
        ["a", "NjY1K3VPSys4VTBmM2gzelpaeUN1T0NMVlBrU0haTU8yZ1NqNmsyL0xtNlowcU52UWdSZzZHYXI0bzRQeE5YTg=="],
        ["b", "Y1YrTnRUbDBaejVObXNlaFFEZEpteDhZa25WUXpRcFBoZG04Y1M3akp5Zz0="],
        ["c", "QnZTN1RyT0RWM09QaHZqUzlJSUkxZz09"],
        ["d", "WnZPREw0QlJmVG00MllmcHNxL0J0SVFKT3FuWk1wT3kyZ1F6SFVENGhpST0="],
        ["e", "UldVWTJiSmM2MzhjRGtVWHZ1YXBYZz09"],
        ["f", "Y29mWHExN3VNc1dRdFhaZGJ5Y1lSdz09"],
        ["g", "ZzdXc3B3YUt4TGpLejRQaHJJM0lmUDN4TTBkdXlwYU5PZGdDSmhWNkJPdz0="],
        ["i", "OW9MMk9GaHlBTGMvdERtZkQ5ZU5yVFF1bGNNRnpicHA0R0o0bHBScmdDVHRnZ1BHd3ZFZjRjc0VlTnJ3SEptUndDeGl1Q29EWW1nZjdWM0lOcUNkNmRtRVk0b3ZWVVQvV1FkZlU4WWlZTHpnMGlnOGZ0Q2VhdFg0VUMxUmZkTmE4S0p6dWoxVEdKMk56TzNqY0VSK0xxazVCbGcremtkM1VCQVJ3QjlFajVJTjN0VitWZUpsNmcxMEsxVEJzekVkRG9MZ0Fodkl4S2kwbDduTTdvS3hnZDltek5qRmt6aXZ0aTZQbFcvZjRIaz0="],
      ];
      
      hiddenValues.forEach(([name, value]) => {
        formDataToSubmit.append(name, value);
      });

      const response = await fetch("https://www.agnisdesigners.co.in/phpmailer/agnis_email_post.php", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitStatus("success");
      setFormData(initialFormData);
      setFieldStates({
        fullname: initialFieldState,
        email: initialFieldState,
        mobile: initialFieldState,
        city: initialFieldState,
        message: initialFieldState,
        resume: initialFieldState,
        captcha: initialFieldState,
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
      formData.fullname.trim().length >= (validationRules.fullname.minLength ?? 2) &&
      validationRules.fullname.pattern?.test(formData.fullname.trim()) &&
      formData.email.trim().length > 0 &&
      validationRules.email.pattern?.test(formData.email) &&
      formData.mobile.trim().length > 0 &&
      validationRules.mobile.pattern?.test(formData.mobile) &&
      formData.message.trim().length >= (validationRules.message.minLength ?? 10) &&
      formData.resume !== null &&
      formData.captcha.trim().length >= (validationRules.captcha.minLength ?? 4)
    );
  }, [formData]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const getFieldState = (name: keyof CareerFormData) => {
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
              <p className="font-semibold">Application Submitted Successfully!</p>
              <p className="text-sm opacity-90">We'll review your application and get back to you soon.</p>
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
              <p className="font-semibold">Failed to Submit Application</p>
              <p className="text-sm opacity-90">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CareerField
          name="fullname"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          required
          autoComplete="name"
          value={formData.fullname}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("fullname")}
          isSubmitting={isSubmitting}
        />
        <CareerField
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
        <CareerField
          name="mobile"
          label="Mobile Number"
          type="tel"
          placeholder="Enter your mobile number"
          icon={Phone}
          required
          autoComplete="tel"
          value={formData.mobile}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("mobile")}
          isSubmitting={isSubmitting}
        />
        <CareerField
          name="city"
          label="City"
          type="text"
          placeholder="Enter your city"
          icon={MessageSquare}
          autoComplete="address-level2"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={getFieldState("city")}
          isSubmitting={isSubmitting}
        />
      </div>

      <CareerTextareaField
        name="message"
        label="Message / Cover Letter"
        placeholder="Tell us about yourself and why you want to join Sahil Industries..."
        required
        value={formData.message}
        onChange={handleChange}
        onBlur={handleBlur}
        fieldState={getFieldState("message")}
        isSubmitting={isSubmitting}
        maxLength={validationRules.message.maxLength ?? 500}
      />

      <CareerFileField
        name="resume"
        label="Upload Resume"
        placeholder="Upload your resume (PDF, DOC, DOCX - Max 5MB)"
        required
        value={formData.resume?.name || ""}
        onChange={handleFileChange}
        onBlur={handleBlur}
        fieldState={getFieldState("resume")}
        isSubmitting={isSubmitting}
      />

      <CareerField
        name="captcha"
        label="Security Verification"
        type="text"
        placeholder="Enter the captcha code"
        icon={FileText}
        required
        autoComplete="off"
        value={formData.captcha}
        onChange={handleChange}
        onBlur={handleBlur}
        fieldState={getFieldState("captcha")}
        isSubmitting={isSubmitting}
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
            Submitting...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Submit Application
          </>
        )}
      </motion.button>

      <p className="text-xs text-slate-400 text-center">
        By submitting this application, you agree to our{" "}
        <a href="/privacy" className="text-safety hover:underline">Privacy Policy</a>
        {" "}and{" "}
        <a href="/terms" className="text-safety hover:underline">Terms of Service</a>
      </p>
    </form>
  );
}

// Reusable Field Component
interface CareerFieldStateType {
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

interface CareerFieldProps {
  name: keyof CareerFormData;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldState: CareerFieldStateType;
  isSubmitting: boolean;
}

function CareerField({ name, label, type, placeholder, icon: Icon, required, autoComplete, value, onChange, onBlur, fieldState, isSubmitting }: CareerFieldProps) {
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

// Reusable Textarea Field Component
interface CareerTextareaFieldProps {
  name: keyof CareerFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  fieldState: CareerFieldStateType;
  isSubmitting: boolean;
  maxLength: number;
}

function CareerTextareaField({ name, label, placeholder, required, value, onChange, onBlur, fieldState, isSubmitting, maxLength }: CareerTextareaFieldProps) {
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

// Reusable File Field Component
interface CareerFileFieldProps {
  name: keyof CareerFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldState: CareerFieldStateType;
  isSubmitting: boolean;
}

function CareerFileField({ name, label, placeholder, required, value, onChange, onBlur, fieldState, isSubmitting }: CareerFileFieldProps) {
  const { isValid, isInvalid, isWarning, isValidating, error, warning, showValidation } = fieldState;
  const hasFile = value.length > 0;
  
  return (
    <div className="form-group space-y-2">
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-industrial text-ink flex items-center gap-1">
        {label} {required && <span className="text-safety">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors">
          <FileText className="w-5 h-5" />
        </div>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-control min-h-[54px] w-full pl-12 pr-12 py-3 border border-ink/20 bg-white text-ink outline-none transition-all duration-200 ${
            isInvalid ? "border-red-500/50 focus:border-red-500 bg-red-500/5" :
            isValid || hasFile ? "border-green-500/50 focus:border-green-500 bg-green-500/5" :
            isWarning ? "border-yellow-500/50 focus:border-yellow-500 bg-yellow-500/5" :
            "focus:border-safety/50 focus:bg-white focus:ring-2 focus:ring-safety/20"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          accept=".pdf,.doc,.docx"
          required={required}
          disabled={isSubmitting}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid || isWarning ? `${name}-message` : undefined}
        />
        {(isValid || isInvalid || isWarning || hasFile) && !isValidating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {(isValid || hasFile) && <Check className="w-5 h-5 text-green-500" />}
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
      {hasFile && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <Check className="w-3 h-3" />
          {value}
        </p>
      )}
    </div>
  );
}