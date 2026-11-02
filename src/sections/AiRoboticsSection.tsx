import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Maximize2,
  Terminal,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { GlowBadge } from '../components/common/GlowBadge';

export const AiRoboticsSection: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural Network Synapse Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Nodes
    const nodeCount = 38;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      layer: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI,
        layer: Math.floor(Math.random() * 3),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle =
              nodes[i].layer === 0
                ? `rgba(212, 175, 55, ${alpha})`
                : `rgba(22, 139, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Occasional neural impulse spark
            if (Math.random() < 0.003) {
              const sparkX = nodes[i].x + (nodes[j].x - nodes[i].x) * Math.random();
              const sparkY = nodes[i].y + (nodes[j].y - nodes[i].y) * Math.random();
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#F0D98A';
              ctx.shadowColor = '#D4AF37';
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle =
          n.layer === 0 ? '#D4AF37' : n.layer === 1 ? '#168BFF' : '#00E5FF';
        ctx.shadowColor = n.layer === 0 ? '#D4AF37' : '#168BFF';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const systems = [
    {
      id: 'cortex',
      title: 'Neuromorphic Reasoning Cortex',
      badge: 'Cognitive Engine',
      desc: 'Deep multi-modal perception pipelines that process environmental context, sensory feedback, and real-time operational commands with microsecond latency.',
      icon: Cpu,
      telemetry: [
        { label: 'Inference Precision', val: 'FP16 Tensor Core' },
        { label: 'Synaptic Latency', val: '1.8 ms' },
        { label: 'Attention Density', val: 'Multi-Head Dynamic' },
        { label: 'Safety Triangulation', val: 'Fail-Safe Monitored' },
      ],
      color: '#D4AF37',
    },
    {
      id: 'perception',
      title: 'Spatial SLAM & LiDAR Vision Core',
      badge: 'Perception Matrix',
      desc: '3D point cloud environmental mapping with stereoscopic neural vision, enabling autonomous robotic navigation across unstructured enterprise grounds.',
      icon: Eye,
      telemetry: [
        { label: 'Point Cloud Depth', val: '120m Omnidirectional' },
        { label: 'Visual Odometry', val: '60 FPS Real-Time' },
        { label: 'Object Segmentation', val: '99.4% Confidence' },
        { label: 'Obstacle Prediction', val: 'Continuous 4D' },
      ],
      color: '#168BFF',
    },
    {
      id: 'kinematics',
      title: 'Kinematic Actuation & Motor Telemetry',
      badge: 'Robotic Motion',
      desc: 'Harmonic robotic joints, force-torque sensing feedback, and sub-millimeter trajectory control engineered for industrial precision and safe human co-presence.',
      icon: Activity,
      telemetry: [
        { label: 'Degrees of Freedom', val: '7-DoF Articulation' },
        { label: 'Repeatability', val: '±0.02 mm' },
        { label: 'Torque Bandwidth', val: '1 kHz Closed-Loop' },
        { label: 'Power Efficiency', val: 'Regenerative Braking' },
      ],
      color: '#00E5FF',
    },
    {
      id: 'telemetry',
      title: 'Autonomous Swarm & Fleet Mesh',
      badge: 'Distributed Mesh',
      desc: 'Decentralized peer-to-peer communication protocols synchronizing multi-agent robotic fleets across logistics hubs and production facilities.',
      icon: Layers,
      telemetry: [
        { label: 'Inter-Agent Latency', val: '< 5 ms' },
        { label: 'Consensus Protocol', val: 'Zero-Collision Mesh' },
        { label: 'Data Encryption', val: 'AES-256 Quantum-Ready' },
        { label: 'Heartbeat Check', val: 'Continuous Telemetry' },
      ],
      color: '#F0D98A',
    },
  ];

  return (
    <section id="ai-robotics" className="relative py-24 sm:py-32 bg-[#061426] overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-[#168BFF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Frontier Technology"
          badgeVariant="blue"
          title="Futuristic AI &"
          highlightedTitle="Robotics Intelligence"
          description="Bridging advanced cognitive neural models with physical kinematic robotics, crafting resilient autonomous systems for high-stakes environments."
          align="center"
        />

        {/* Central Interactive HUD Interface */}
        <div className="mt-12 rounded-3xl bg-[#0A1B33]/70 border border-[#D4AF37]/25 backdrop-blur-xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_35px_rgba(22,139,255,0.15)]">
          
          {/* Top HUD Bar */}
          <div className="px-6 py-4 bg-[#061426]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#168BFF] animate-pulse" />
              <span className="font-tech text-xs tracking-wider text-gray-300 uppercase">
                SYSTEM TELEMETRY HUD // PGOT NEURAL CORE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-tech text-[#D4AF37] px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                ACTIVE COHERENCE: 99.8%
              </span>
              <span className="text-[11px] font-tech text-cyan-400 px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/20">
                STATUS: OPTIMAL
              </span>
            </div>
          </div>

          {/* Interactive Layout: Left Selector, Right Live Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            
            {/* System Selector Sidebar */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-tech uppercase tracking-widest text-gray-400 block mb-3">
                  Select Architectural Subsystem:
                </span>
                {systems.map((sys, idx) => {
                  const Icon = sys.icon;
                  const isSelected = activeSystem === idx;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setActiveSystem(idx)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-start gap-4 border ${
                        isSelected
                          ? 'bg-[#061426] border-[#D4AF37]/60 shadow-gold-glow'
                          : 'bg-[#061426]/40 border-white/5 hover:border-white/20 text-gray-400'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#061426]'
                            : 'bg-white/5 text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-display text-sm font-bold ${
                              isSelected ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {sys.title}
                          </h4>
                          {isSelected && (
                            <Zap className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] font-tech text-[#D4AF37]/80 block mt-0.5">
                          {sys.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-system quick indicator */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-tech">
                <span>SIMULATION FEED</span>
                <span className="text-[#60A5FA]">QUANTUM PARALLEL</span>
              </div>
            </div>

            {/* Right Live Simulation View */}
            <div className="lg:col-span-7 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              
              {/* Neural Synapse Canvas Layer in Background */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              />

              {/* Floating Holographic Content */}
              <div className="relative z-10 space-y-6">
                <div>
                  <GlowBadge variant="gold" pulse>
                    {systems[activeSystem].badge}
                  </GlowBadge>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-3">
                    {systems[activeSystem].title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-300 font-light leading-relaxed max-w-xl">
                    {systems[activeSystem].desc}
                  </p>
                </div>

                {/* Telemetry Metric Matrix */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {systems[activeSystem].telemetry.map((t) => (
                    <div
                      key={t.label}
                      className="p-3.5 rounded-xl bg-[#061426]/80 border border-white/10 backdrop-blur-md"
                    >
                      <div className="text-[11px] font-tech text-gray-400 uppercase tracking-wider">
                        {t.label}
                      </div>
                      <div className="text-base sm:text-lg font-tech font-bold text-[#F0D98A] mt-1">
                        {t.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Holographic HUD Terminal Banner */}
              <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-tech text-gray-400">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Terminal className="w-4 h-4" />
                  <span>AUTONOMOUS FEED: STABLE</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>PGOT REASONING MATRIX v3.2</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
