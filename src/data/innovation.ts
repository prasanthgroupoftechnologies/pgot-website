import { InnovationItem } from '../types';

export const innovationData: InnovationItem[] = [
  {
    id: 'ai-core',
    title: 'Autonomous Neural Intelligence Engine',
    subtitle: 'Self-governing machine intelligence models engineered for enterprise cognitive autonomy.',
    description: 'Our proprietary architectural blueprint integrates deep learning perception networks with real-time semantic graphs, allowing enterprise systems to reason, adapt, and orchestrate actions without human bottlenecks.',
    tag: 'Artificial Intelligence',
    stats: [
      { label: 'Inference Latency', value: '< 4.2ms' },
      { label: 'Context Window', value: '1M+ Tokens' },
      { label: 'Accuracy Tier', value: 'Enterprise grade' },
      { label: 'Autonomous Pipelines', value: '24/7 Continuous' }
    ],
    highlights: [
      'Multi-modal sensory comprehension (Vision, Speech, Unstructured Text)',
      'Self-healing neural weights calibrated for business domain data',
      'Explainable AI (XAI) auditing traces for mission-critical decisions'
    ]
  },
  {
    id: 'cloud-mesh',
    title: 'Distributed Cloud Mesh & Global Infrastructure',
    subtitle: 'Zero-latency edge topologies delivering unbroken computing availability worldwide.',
    description: 'Engineered upon immutable container backbones and multi-region distributed synchronizations, ensuring data integrity, millisecond routing, and automatic failover across planetary points of presence.',
    tag: 'Cloud Infrastructure',
    stats: [
      { label: 'Global Availability', value: '99.999% Design' },
      { label: 'Inter-Node Routing', value: 'Sub-10ms' },
      { label: 'Security Standard', value: 'Zero-Trust Core' },
      { label: 'Edge Nodes Capacity', value: 'Hyper-Distributed' }
    ],
    highlights: [
      'Anycast edge routing with instant multi-region packet steering',
      'Immutable state orchestration with distributed consensus protocols',
      'Automated geo-fenced data sovereignty compliance enforcement'
    ]
  },
  {
    id: 'robotics-automation',
    title: 'Cyber-Physical Automation & Robotics Telemetry',
    subtitle: 'Bridging physical robotic machinery with real-time digital intelligence and simulation.',
    description: 'Unifying hardware controllers, robotic arm precision, and automated guided vehicles with edge-computing micro-controllers to enable lights-out operations and zero-latency physical workflow synchronization.',
    tag: 'Robotics & Hardware',
    stats: [
      { label: 'Telemetry Frequency', value: '1,000 Hz' },
      { label: 'Kinematic Precision', value: 'Sub-millimeter' },
      { label: 'Simulation Engine', value: 'Physics-Based' },
      { label: 'Operational Uptime', value: 'Continuous Cycle' }
    ],
    highlights: [
      'Sub-millisecond kinematic feedback loops with deterministic ROS backbones',
      'Photorealistic digital twin simulation for rapid factory line retooling',
      'Autonomous collision avoidance with 3D LiDAR and stereo depth fusion'
    ]
  },
  {
    id: 'data-streams',
    title: 'Hyperscale Streaming & Event-Driven Backbone',
    subtitle: 'Real-time event processing capable of handling billions of operational signals.',
    description: 'High-throughput stream processing frameworks that convert raw enterprise signals into instantaneous operational insight, empowering reactive workflows that trigger before disruptions occur.',
    tag: 'Data Architecture',
    stats: [
      { label: 'Throughput Volume', value: '10M+ Events/s' },
      { label: 'Processing Lag', value: 'Real-Time' },
      { label: 'Data Retention', value: 'Immutable Tier' },
      { label: 'Protocol Support', value: 'Kafka/gRPC/MQTT' }
    ],
    highlights: [
      'Stateless event processors with automatic horizontal auto-scaling',
      'In-memory temporal aggregation for instant algorithmic alerting',
      'Unified enterprise telemetry lakehouse with zero data fragmentation'
    ]
  }
];
