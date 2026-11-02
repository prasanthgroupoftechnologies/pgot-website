import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  iconName: string;
  features: string[];
  capabilities: string[];
}

export interface IndustryItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  impactMetrics: string[];
  techFocus: string[];
  accentColor: string;
}

export interface InnovationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export interface PrincipleItem {
  id: string;
  title: string;
  statement: string;
  details: string;
  icon: string;
}

export interface ContactFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  bot_trap?: string;
}
