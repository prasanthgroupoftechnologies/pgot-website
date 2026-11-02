import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'ai-automation',
    number: '01',
    title: 'AI & Automation',
    shortDesc: 'Harness the cognitive power of neural architectures, autonomous agents, and predictive machine learning to transform workflows.',
    iconName: 'Cpu',
    features: [
      'Autonomous Decision Agents',
      'Cognitive Workflow Automation',
      'Predictive Analytics & ML Models',
      'Generative AI & LLM Integration'
    ],
    capabilities: [
      'Self-optimizing algorithmic pipelines',
      'Real-time anomaly detection & telemetry',
      'Enterprise retrieval-augmented generation'
    ]
  },
  {
    id: 'saas-development',
    number: '02',
    title: 'SaaS Product Development',
    shortDesc: 'Engineering multi-tenant, cloud-native platforms designed for hyperscale, high availability, and seamless user experiences.',
    iconName: 'Layers',
    features: [
      'Multi-Tenant Cloud Architectures',
      'Modern High-Velocity UI/UX',
      'Frictionless API & Event Streaming',
      'Billing & Subscription Infrastructure'
    ],
    capabilities: [
      'Zero-downtime micro-deployments',
      'Fine-grained RBAC & enterprise tenancy',
      'Elastic multi-region database sharding'
    ]
  },
  {
    id: 'cloud-computing',
    number: '03',
    title: 'Cloud Computing',
    shortDesc: 'Architecting resilient, secure, and distributed cloud ecosystems across hybrid and multi-cloud enterprise landscapes.',
    iconName: 'Cloud',
    features: [
      'Multi-Cloud Strategy & Mesh',
      'Kubernetes & Container Orchestration',
      'Serverless Micro-Architectures',
      'Zero-Trust Cloud Security Protocols'
    ],
    capabilities: [
      'Automated disaster recovery matrices',
      'Edge CDN acceleration & caching',
      'Infrastructure as Code (IaC) governance'
    ]
  },
  {
    id: 'custom-software',
    number: '04',
    title: 'Custom Software Development',
    shortDesc: 'Tailor-engineered software systems designed to solve mission-critical challenges and drive operational dominance.',
    iconName: 'Code2',
    features: [
      'Domain-Driven Software Engineering',
      'High-Concurrency Processing Engines',
      'Legacy Modernization Pipelines',
      'Next-Gen Web & Mobile Platforms'
    ],
    capabilities: [
      'Ultra-low latency transaction pipelines',
      'Comprehensive automated QA & test matrices',
      'Modular microservices with gRPC & GraphQL'
    ]
  },
  {
    id: 'enterprise-technology',
    number: '05',
    title: 'Enterprise Technology',
    shortDesc: 'Modernizing core enterprise backbones with resilient integrations, master data synchronicity, and unified oversight.',
    iconName: 'Boxes',
    features: [
      'Enterprise Systems Integration (ERP/CRM)',
      'Master Data Management & Sync',
      'Distributed Messaging & Event Buses',
      'Governance, Risk & Compliance Frameworks'
    ],
    capabilities: [
      'Unified enterprise telemetry & observability',
      'Immutable audit logging & compliance hooks',
      'Cross-departmental federated identity'
    ]
  },
  {
    id: 'process-automation',
    number: '06',
    title: 'Business Process Automation',
    shortDesc: 'Eliminating friction across mission-critical operations with intelligent robotic process pipelines and adaptive triggers.',
    iconName: 'Workflow',
    features: [
      'Intelligent Document & Data Processing',
      'Robotic Process Automation (RPA)',
      'Cross-Platform Process Orchestration',
      'Real-Time Operational Cockpits'
    ],
    capabilities: [
      'Autonomous exception routing & triaging',
      'Interactive approval workflows & audit trails',
      'Deep ERP/legacy terminal synchronizations'
    ]
  }
];
