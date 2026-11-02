import { IndustryItem } from '../types';

export const industriesData: IndustryItem[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing & Smart Industry',
    tagline: 'Cyber-Physical Systems & Predictive Industrial Automation',
    description: 'Transforming industrial production floor operations with connected IIoT sensor telemetry, predictive asset maintenance, and autonomous quality inspection models.',
    impactMetrics: [
      'Sub-millisecond machine telemetry streaming',
      'Defect reduction via computer vision inspection',
      'Automated supply chain scheduling algorithms'
    ],
    techFocus: ['IIoT Architecture', 'Edge AI Vision', 'Digital Twin Modeling', 'Predictive Telemetry'],
    accentColor: '#168BFF'
  },
  {
    id: 'textile-retail',
    name: 'Textile & Omnichannel Retail',
    tagline: 'Precision Inventory, Demand Forecasting & Frictionless Commerce',
    description: 'Empowering textile manufacturers and retail ecosystems with end-to-end inventory traceability, AI-driven demand forecasting, and unified omnichannel architectures.',
    impactMetrics: [
      'Real-time fabric batch and yarn traceability',
      'Intelligent SKU allocation & stock rebalancing',
      'High-throughput checkout and fulfillment sync'
    ],
    techFocus: ['Supply Traceability', 'Predictive Demand Engines', 'Micro-Fulfillment', 'POS Mesh'],
    accentColor: '#D4AF37'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    tagline: 'HIPAA-Compliant Systems & Intelligent Clinical Decision Support',
    description: 'Building secure digital health infrastructures, patient triage workflows, and clinical data orchestration pipelines that safeguard sensitive records.',
    impactMetrics: [
      'Encrypted zero-trust patient data exchange',
      'AI assisted diagnostic imaging telemetry',
      'Automated administrative workflow orchestration'
    ],
    techFocus: ['HL7 / FHIR Protocols', 'Encrypted Data Lakes', 'Diagnostic AI', 'Zero-Trust Telehealth'],
    accentColor: '#00E5FF'
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    tagline: 'Adaptive Learning Platforms & Scalable Institutional Portals',
    description: 'Architecting next-generation learning management backbones, personalized student learning pathways, and intelligent campus administration systems.',
    impactMetrics: [
      'Dynamic knowledge graph curriculum mapping',
      'Concurrent multi-tenant examination engines',
      'Unified campus identity and asset governance'
    ],
    techFocus: ['Adaptive Learning AI', 'High-Concurrency Testing', 'Interactive Virtual Labs', 'Campus SIS Mesh'],
    accentColor: '#F0D98A'
  },
  {
    id: 'finance',
    name: 'Finance & Fintech',
    tagline: 'High-Frequency Processing, Algorithmic Fraud Defense & Compliance',
    description: 'Engineering ultra-low latency transaction processing, algorithmic anomaly detection, risk assessment engines, and automated regulatory reporting frameworks.',
    impactMetrics: [
      'Microsecond latency ledger reconciliations',
      'Continuous algorithmic fraud prevention sweeps',
      'Automated AML/KYC orchestration pipelines'
    ],
    techFocus: ['High-Frequency Engines', 'Algorithmic Risk Models', 'Distributed Ledgers', 'Automated Audit Rails'],
    accentColor: '#D4AF37'
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Global Conglomerates',
    tagline: 'Resilient Digital Backbones for Multi-Subsidiary Operations',
    description: 'Connecting distributed business units with centralized governance, unified enterprise resource planning, and autonomous business operations intelligence.',
    impactMetrics: [
      'Cross-organization unified data lakehouse',
      'Zero-latency corporate telemetry dashboards',
      'Dynamic cross-border compliance adherence'
    ],
    techFocus: ['Unified Lakehouse', 'Federated IAM', 'Autonomous ERP Sync', 'Enterprise Service Bus'],
    accentColor: '#168BFF'
  }
];
