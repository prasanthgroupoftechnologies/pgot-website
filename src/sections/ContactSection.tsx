import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  Building,
  User,
  Briefcase,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactFormData } from '../types';

const serviceOptions = [
  'AI & Automation',
  'SaaS Product Development',
  'Cloud Computing',
  'Custom Software Development',
  'Enterprise Technology',
  'Business Process Automation',
  'General Technical Consultation',
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    service: 'AI & Automation',
    subject: '',
    message: '',
    bot_trap: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactFormData, string>> = {};

    // 1. Full Name (compulsory)
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is compulsory';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters';
    }

    // 2. Company Name (compulsory)
    if (!formData.companyName.trim()) {
      errs.companyName = 'Company Name is compulsory';
    } else if (formData.companyName.trim().length < 2) {
      errs.companyName = 'Company Name must be at least 2 characters';
    }

    // 3. Email Address (compulsory)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is compulsory';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format';
    }

    // 4. Phone Number (compulsory)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is compulsory';
    } else if (phoneDigits.length < 8) {
      errs.phone = 'Please enter a valid telephone / mobile number (minimum 8 digits)';
    }

    // 5. Message (compulsory)
    if (!formData.message.trim()) {
      errs.message = 'Enquiry Message is compulsory';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters detailing your enquiry';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Resolve API endpoint: uses VITE_API_BASE_URL if configured, or relative /api/enquiry for local proxy
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
      const apiUrl = `${apiBaseUrl}/api/enquiry`;

      let response: Response;
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (networkErr: any) {
        throw new Error(
          'Unable to connect to the enquiry service. Please check your network connection or contact us directly at prasanthgroupoftechnologies@gmail.com.'
        );
      }

      // Safely inspect response Content-Type before parsing to avoid "Unexpected token '<'" JSON errors
      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.error('Failed to parse response JSON:', jsonErr);
        }
      } else {
        // Read as text to avoid HTML <!DOCTYPE syntax errors
        const textResponse = await response.text();
        console.warn('Non-JSON response from server:', textResponse.slice(0, 150));
      }

      // Handle non-2xx HTTP responses gracefully
      if (!response.ok) {
        let errorMessage = data?.error || data?.message;

        if (!errorMessage) {
          if (response.status === 404) {
            errorMessage =
              'The enquiry API endpoint was not found (404). If this website is hosted on Netlify, please deploy the backend server and configure the VITE_API_BASE_URL environment variable in Netlify Site Settings.';
          } else if (response.status === 502 || response.status === 503) {
            errorMessage =
              'The enquiry service is temporarily unavailable (502/503). Please try again in a few moments or contact us directly.';
          } else {
            errorMessage = `Server responded with status ${response.status} (${response.statusText || 'Request failed'}).`;
          }
        }

        throw new Error(errorMessage);
      }

      // Ensure backend explicitly confirmed success
      if (!data || data.success !== true) {
        throw new Error(
          data?.error || 'Enquiry registration could not be verified by the backend. Please try again.'
        );
      }

      // Success confirmed by backend
      setIsSubmitted(true);
      setSubmittedReference(data.referenceCode || 'PGOT-ENQ-CONFIRMED');
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        service: 'AI & Automation',
        subject: '',
        message: '',
        bot_trap: '',
      });
      setErrors({});
    } catch (err: any) {
      console.error('Submission failed:', err);
      setServerError(
        err.message || 'Unable to register your enquiry. Please reach us directly via email or telephone below.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#061426] overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#168BFF]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Direct Engagement"
          badgeVariant="gold"
          title="Initiate Technological"
          highlightedTitle="Dialogue"
          description="Submit your enterprise requirements directly to our senior engineering and solutions advisory team."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
          
          {/* Left Column: Corporate Channel Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Branding Card */}
            <div className="rounded-2xl bg-[#0A1B33]/80 border border-[#D4AF37]/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <span className="text-xs uppercase font-tech tracking-widest text-[#D4AF37] font-semibold">
                Communications Hub
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-2 leading-snug">
                PRASANTH GROUP OF TECHNOLOGIES
              </h3>
              <p className="text-xs font-tech text-[#F0D98A] tracking-wider uppercase mt-1">
                THINK BEYOND. BUILD BEYOND.
              </p>
              <p className="text-sm text-gray-300 font-light leading-relaxed mt-4">
                We engage in enterprise technology design, system architecture discussions, and strategic digital transformations. Every submitted enquiry is reviewed directly by our leadership and engineering team.
              </p>

              {/* Official Corporate Contact Channels */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 text-xs">
                {/* 1. Official Company Email */}
                <div className="flex items-start gap-3.5 text-gray-300 group">
                  <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#061426] transition-all duration-300 shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-tech text-gray-400 uppercase tracking-wider block text-[11px]">
                      Official Company Email
                    </span>
                    <a
                      href="mailto:prasanthgroupoftechnologies@gmail.com"
                      className="text-white hover:text-[#F0D98A] font-medium text-xs sm:text-sm transition-colors break-all inline-block mt-0.5 focus:outline-none focus:underline"
                      title="Send email to Prasanth Group of Technologies"
                    >
                      prasanthgroupoftechnologies@gmail.com
                    </a>
                  </div>
                </div>

                {/* 2. Official Contact Number */}
                <div className="flex items-start gap-3.5 text-gray-300 group">
                  <div className="p-2.5 rounded-xl bg-[#168BFF]/10 border border-[#168BFF]/30 text-[#168BFF] group-hover:bg-[#168BFF] group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-tech text-gray-400 uppercase tracking-wider block text-[11px]">
                      Official Contact Number
                    </span>
                    <a
                      href="tel:6369727736"
                      className="text-white hover:text-[#F0D98A] font-medium text-xs sm:text-sm font-tech tracking-wide transition-colors inline-block mt-0.5 focus:outline-none focus:underline"
                      title="Call Prasanth Group of Technologies"
                    >
                      6369727736
                    </a>
                  </div>
                </div>

                {/* 3. Company Location */}
                <div className="flex items-start gap-3.5 text-gray-300 group">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-[#061426] transition-all duration-300 shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-tech text-gray-400 uppercase tracking-wider block text-[11px]">
                      Company Location
                    </span>
                    <a
                      href="https://maps.google.com/?q=Coimbatore,+TamilNadu,+India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#F0D98A] font-medium text-xs sm:text-sm transition-colors inline-block mt-0.5 focus:outline-none focus:underline"
                      title="View Coimbatore, TamilNadu, India on Google Maps"
                    >
                      Coimbatore,TamilNadu,India.
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Customer Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl bg-[#0A1B33]/85 border border-[#D4AF37]/35 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              
              {/* Gold gradient top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Customer Business Enquiry
                </h3>
                <span className="text-[11px] font-tech text-[#D4AF37] tracking-wider uppercase hidden sm:inline">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-8 font-light">
                Please complete all compulsory fields. Your enquiry will be logged in our enterprise database and routed immediately to our leadership inbox.
              </p>

              {/* Server Error Notification */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-medium mb-0.5">Transmission Alert</strong>
                      <span>{serverError}</span>
                      <div className="mt-2 text-[11px] text-gray-300">
                        You can also contact us directly at{' '}
                        <a href="mailto:prasanthgroupoftechnologies@gmail.com" className="text-[#F0D98A] underline">
                          prasanthgroupoftechnologies@gmail.com
                        </a>{' '}
                        or call{' '}
                        <a href="tel:6369727736" className="text-[#F0D98A] underline">
                          6369727736
                        </a>.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Notification */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-5 rounded-2xl bg-[#061426] border border-[#D4AF37] text-white flex items-start gap-4 shadow-gold-glow"
                  >
                    <CheckCircle className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="text-base font-bold text-[#F0D98A]">
                        Enquiry Successfully Registered
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Thank you for reaching out. Your enquiry has been saved under Reference Code{' '}
                        <span className="font-tech font-bold text-white bg-[#0A1B33] px-2 py-0.5 rounded border border-[#D4AF37]/40">
                          {submittedReference}
                        </span>{' '}
                        and transmitted to <strong className="text-white">prasanthgroupoftechnologies@gmail.com</strong>.
                      </p>
                      <p className="text-xs text-gray-400 pt-1">
                        Our engineering leadership will review your requirements and respond promptly to your provided email address.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#F0D98A] font-semibold underline pt-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Submit Another Enquiry</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Honeypot Spam Trap (Hidden from real users) */}
                <input
                  type="text"
                  name="bot_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.bot_trap || ''}
                  onChange={(e) => setFormData({ ...formData, bot_trap: e.target.value })}
                  className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
                  aria-hidden="true"
                />

                {/* 1. Full Name & Company Name Row (Both Compulsory) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Full Name <span className="text-[#D4AF37] font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Elena Vance"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-[#061426]/90 border text-white placeholder-gray-500 text-sm focus:outline-none transition-all ${
                          errors.fullName
                            ? 'border-red-500/80 focus:border-red-400'
                            : 'border-white/10 focus:border-[#D4AF37] focus:shadow-gold-glow'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Company Name <span className="text-[#D4AF37] font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Apex Global Industries"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-[#061426]/90 border text-white placeholder-gray-500 text-sm focus:outline-none transition-all ${
                          errors.companyName
                            ? 'border-red-500/80 focus:border-red-400'
                            : 'border-white/10 focus:border-[#D4AF37] focus:shadow-gold-glow'
                        }`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.companyName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Email Address & Phone Number Row (Both Compulsory) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Email Address <span className="text-[#D4AF37] font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. elena@apex-industries.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-[#061426]/90 border text-white placeholder-gray-500 text-sm focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-[#D4AF37] focus:shadow-gold-glow'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Phone Number <span className="text-[#D4AF37] font-bold">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-[#061426]/90 border text-white placeholder-gray-500 text-sm focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-[#D4AF37] focus:shadow-gold-glow'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Service / Business Enquiry Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Service / Business Focus
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#061426]/90 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:shadow-gold-glow transition-all"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0A1B33] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Strategic Autonomous Automation Pipeline"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#061426]/90 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:shadow-gold-glow transition-all"
                    />
                  </div>
                </div>

                {/* 4. Message (Compulsory) */}
                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-gray-300 mb-2">
                    Message / Technical Objectives <span className="text-[#D4AF37] font-bold">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your technical requirements, architectural scale, or timeline expectations..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#061426]/90 border text-white placeholder-gray-500 text-sm focus:outline-none transition-all resize-none ${
                      errors.message
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-white/10 focus:border-[#D4AF37] focus:shadow-gold-glow'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F0D98A] to-[#D4AF37] text-[#061426] font-extrabold text-sm uppercase tracking-wider hover:brightness-110 shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#061426] border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Enquiry to PGOT...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Customer Enquiry</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2.5">
                    Transmissions are encrypted and recorded permanently in our enterprise database.
                  </p>
                </div>

              </form>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
