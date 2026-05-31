import Link from 'next/link';
import { ArrowRight, Terminal, Server, Cpu, Database, Cloud, Zap, CheckCircle2, Bot, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="noise-overlay overflow-hidden min-h-screen bg-background selection:bg-primary selection:text-white font-sans text-foreground">
      {/* GLOBAL BACKGROUND MESH */}
      <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between md:px-10">
          <Link href="/" className="flex items-center gap-2 group">
            {/* AV Logo Placeholder - The user wants to keep their existing AV logo, so this is a placeholder */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-glow">
              <span className="font-display font-bold text-white text-lg tracking-tight">AV</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
              AVACODE
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#services" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Services</Link>
            <Link href="#infrastructure" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Infrastructure</Link>
            <Link href="#ai" className="text-sm font-medium text-white/70 hover:text-white transition-colors">AI & Auto</Link>
            <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/contact">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 transition-all duration-300 shadow-glow font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-16">
        
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:px-10 flex flex-col items-center text-center">
          <div className="animate-fade-in space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Enterprise-Grade Technology Partner</span>
            </div>
            
            <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-white leading-[1.1] animate-slide-up">
              Build Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple">
                Scale Faster.
              </span>
            </h1>
            
            <p className="max-w-2xl text-lg md:text-xl text-white/60 font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Automation, AI, and custom software solutions for modern businesses. We design, deploy, and manage your critical infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/contact">
                <Button className="h-14 px-8 text-base bg-primary hover:bg-primary/90 rounded-full shadow-glow text-white font-medium transition-all duration-300 hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" className="h-14 px-8 text-base rounded-full border-white/20 hover:bg-white/5 font-medium backdrop-blur-md text-white transition-all duration-300">
                  View Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. FEATURES */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="features">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Cpu, title: 'Intelligent', desc: 'AI-driven architectures that learn and adapt.' },
              { icon: Zap, title: 'Fast', desc: 'Optimized performance for minimal latency.' },
              { icon: ShieldCheck, title: 'Reliable', desc: '99.99% uptime guaranteed infrastructure.' },
              { icon: Terminal, title: 'Technical', desc: 'Built by engineers, for demanding workloads.' },
            ].map((feature, i) => (
              <div key={feature.title} className="glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SERVICES */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10" id="services">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Core Competencies</h2>
            <p className="text-white/60 text-lg">Comprehensive technology solutions designed to accelerate your business growth through superior engineering.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Custom Development', icon: Code, desc: 'Bespoke software tailored exactly to your business logic, built on modern, scalable stacks.' },
              { title: 'Backend Engineering', icon: Database, desc: 'Robust API design, microservices, and high-performance database architectures.' },
              { title: 'Business Automation', icon: Zap, desc: 'Streamlining repetitive tasks into automated, error-free digital workflows.' },
            ].map((service) => (
              <div key={service.title} className="relative rounded-[2.5rem] p-1 bg-gradient-to-br from-white/10 to-transparent overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative h-full bg-[#08111F] rounded-[2.3rem] p-10 flex flex-col items-start z-10 border border-white/5">
                  <service.icon className="w-10 h-10 text-primary mb-8" />
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-white/60 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. INFRASTRUCTURE */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="infrastructure">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                Enterprise VPS & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue">Cloud Infrastructure</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Deploy with confidence on AVACODE's highly available cloud architecture. We provide dedicated VPS systems, containerized environments, and real-time monitoring tailored to your exact resource needs.
              </p>
              <ul className="space-y-4">
                {['High-performance NVMe Storage', 'DDoS Protection & Firewall', 'Automated Daily Backups'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* VPS Monitoring Component Mockup */}
              <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-glow relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-display font-bold text-white">Server Status: NODE-A1</h4>
                  <span className="flex items-center gap-2 text-xs font-bold text-accent-green bg-accent-green/10 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" /> ONLINE
                  </span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-white/60">CPU Usage</span><span className="text-white font-mono">24%</span></div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary w-[24%]" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-white/60">RAM (32GB)</span><span className="text-white font-mono">18.4GB</span></div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple w-[58%]" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Network IN</p>
                      <p className="text-lg font-mono text-white">1.2 Gbps</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Uptime</p>
                      <p className="text-lg font-mono text-white">99.99%</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Ping</p>
                      <p className="text-lg font-mono text-white">4ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AUTOMATION SOLUTIONS */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10" id="automation">
          <div className="glass-panel rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="order-2 lg:order-1">
                {/* Automation Flow Diagram Mockup */}
                <div className="bg-[#08111F] rounded-2xl p-6 border border-white/5 font-mono text-sm space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Cloud className="text-purple w-5 h-5" /> <span>Incoming Webhook</span>
                  </div>
                  <div className="w-0.5 h-6 bg-white/20 mx-auto" />
                  <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <Bot className="text-primary w-5 h-5" /> <span>Data Processor (Serverless)</span>
                  </div>
                  <div className="w-0.5 h-6 bg-white/20 mx-auto" />
                  <div className="flex gap-4">
                    <div className="flex-1 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <Database className="text-accent-blue w-5 h-5" /> <span>Update DB</span>
                    </div>
                    <div className="flex-1 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <Mail className="text-accent-green w-5 h-5" /> <span>Send Email</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Hyper-Automation Pipelines</h2>
                <p className="text-white/60 leading-relaxed">
                  Eliminate manual workflows. AVACODE designs sophisticated automation pipelines connecting your CRMs, databases, and third-party APIs. We turn complex, multi-step processes into seamless, instantaneous background operations.
                </p>
                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/5">
                  Explore Automations
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AI INTEGRATION & MASCOT */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5" id="ai">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 px-4 py-2 text-xs font-bold tracking-widest text-purple uppercase">
                Meet AV-01
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                AI Assistants & <br /> Cognitive Systems
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                AV-01 represents our commitment to intelligent systems. From customer-facing AI agents to predictive backend analytics, we integrate cutting-edge LLMs and machine learning directly into your business infrastructure.
              </p>
              
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-purple shadow-glow-purple">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple/20 flex flex-shrink-0 items-center justify-center">
                    <Bot className="text-purple w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">AV-01 Assistant</h4>
                    <p className="text-sm text-white/70 font-mono">"System anomalies detected and resolved automatically at 02:41 UTC. Infrastructure running at 100% efficiency."</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple/30 blur-[100px] rounded-full" />
              <img 
                src="/av_01_mascot.png" 
                alt="AV-01 AI Engineer Mascot" 
                className="w-full max-w-md relative z-10 drop-shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-pulse-slow object-contain"
              />
            </div>
          </div>
        </section>

        {/* 7. PRICING */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10" id="pricing">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Transparent Scaling</h2>
            <p className="text-white/60 text-lg">Predictable pricing for premium infrastructure and development services.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '$499', period: '/mo', desc: 'Essential automation and managed VPS for small businesses.', features: ['1x Managed VPS (4GB RAM)', 'Basic API Integrations', 'Email Support', '99.9% Uptime'] },
              { name: 'Business', price: '$1,299', period: '/mo', desc: 'Advanced automation and custom development hours.', features: ['3x Managed VPS Cluster', 'Complex Automation Flows', '20hr Custom Dev/mo', 'Priority Support', 'Daily Backups'], popular: true },
              { name: 'Enterprise', price: 'Custom', period: '', desc: 'Dedicated AI engineers and massive scale infrastructure.', features: ['Dedicated Server Fleet', 'Custom AI LLM Integration', 'Full-stack Dev Team', '24/7 SLA (99.99%)', 'On-premise deployment'] },
            ].map(plan => (
              <div key={plan.name} className={`glass-panel rounded-3xl p-8 relative flex flex-col ${plan.popular ? 'border-primary shadow-glow scale-105 z-10' : 'border-white/10'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest">Most Popular</div>}
                <h3 className="text-xl font-display font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50 mb-6 min-h-[40px]">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full rounded-full h-12 font-bold ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  Select {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">Trusted by <br/>Industry Leaders</h2>
              <p className="text-white/60 text-lg">See how AVACODE transforms technology overhead into competitive advantage.</p>
            </div>
            <div className="space-y-6">
              {[
                { quote: "AVACODE completely rebuilt our backend infrastructure. The speed is phenomenal, and the AI integrations saved us 40 hours of manual work a week.", author: "Sarah Jenkins", role: "CTO, FinTech Startup" },
                { quote: "Their VPS management is truly set-and-forget. We haven't had a single second of downtime since migrating to their enterprise cluster.", author: "Michael Chang", role: "Director of Ops, E-Commerce Hub" },
              ].map(test => (
                <div key={test.author} className="glass-panel rounded-3xl p-8 border border-white/10">
                  <p className="text-lg text-white/80 italic mb-6">"{test.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{test.author}</p>
                    <p className="text-sm text-primary">{test.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-24 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Do you handle the migration of existing infrastructure?', a: 'Yes. Our engineering team handles complete, zero-downtime migrations from AWS, GCP, DigitalOcean, or on-premise servers to our optimized infrastructure.' },
              { q: 'How does custom AI integration work?', a: 'We analyze your data flows and integrate specialized LLMs via API or deploy local models on dedicated GPU instances to automate decision-making or create smart assistants like AV-01.' },
              { q: 'Is there a minimum contract for custom development?', a: 'We typically engage in minimum 3-month retainers for custom development to ensure architectural integrity and proper deployment cycles.' }
            ].map(faq => (
              <div key={faq.q} className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-2 text-lg">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. CONTACT */}
        <section className="mx-auto max-w-5xl px-6 py-24 md:px-10" id="contact">
          <div className="glass-panel rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-glow text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to Scale?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
              Discuss your project requirements with our lead engineers. We'll outline a custom architecture and deployment plan within 24 hours.
            </p>
            <form className="max-w-md mx-auto space-y-4">
              <input type="email" placeholder="Work Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors" />
              <Button className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-glow">
                Request Consultation
              </Button>
            </form>
          </div>
        </section>

      </div>

      {/* 11. FOOTER */}
      <footer className="border-t border-white/5 bg-[#050A14] relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">AV</span>
                </div>
                <span className="font-display font-bold text-white tracking-tight">AVACODE</span>
              </div>
              <p className="text-white/50 max-w-sm">Premium automation, infrastructure, and AI engineering for the modern enterprise.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="#" className="hover:text-primary transition-colors">Managed VPS</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Backend Engineering</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">AI Assistants</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Custom Automation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@avacode.id</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>© {new Date().getFullYear()} AVACODE. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
