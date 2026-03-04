import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Instagram, Mail, Phone, ExternalLink, 
  ChevronRight, ArrowRight, Download, Camera, 
  Layers, Palette, Settings, Trash2, Plus, Save,
  Copy, Check, Play, Upload
} from 'lucide-react';
import { PortfolioData, ProjectData, EquipmentData, ProjectVideo } from './types';

// --- Components ---

const Navbar = ({ activeSection, setActiveSection, isAdmin, setIsAdmin }: { 
  activeSection: string, 
  setActiveSection: (s: string) => void,
  isAdmin: boolean,
  setIsAdmin: (b: boolean) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'equipment', label: 'EQUIPMENT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button 
          onClick={() => setActiveSection('home')}
          className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
        >
          PORTFOLIO<span className="text-white/40">.</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-xs font-medium tracking-widest transition-colors hover:text-white ${
                activeSection === item.id ? 'text-white' : 'text-white/40'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => setActiveSection('admin')}
            className={`p-2 rounded-full transition-colors ${activeSection === 'admin' ? 'bg-white text-dark' : 'text-white/40 hover:text-white'}`}
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-dark border-b border-white/10 p-6 flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`text-sm font-medium tracking-widest text-left ${
                  activeSection === item.id ? 'text-white' : 'text-white/40'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => {
                setActiveSection('admin');
                setIsOpen(false);
              }}
              className="text-sm font-medium tracking-widest text-left text-white/40"
            >
              ADMIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = ({ data, onNavigate }: { data: PortfolioData, onNavigate: (s: string, p?: ProjectData) => void }) => {
  const featuredProjects = data.projects.filter(p => p.is_featured).slice(0, 6);
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase mb-4 block">
            {data.home.job_title}
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tighter">
            {data.home.name}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
            {data.home.intro}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('projects')}
              className="px-8 py-4 bg-white text-dark font-medium rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors"
            >
              PROJECTS <ArrowRight size={18} />
            </button>
            <a 
              href={data.home.resume_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 text-white font-medium rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              RESUME <Download size={18} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-serif italic">Featured Works</h2>
          <button 
            onClick={() => onNavigate('projects')}
            className="text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2"
          >
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onNavigate('project-detail', project)}
              className="group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden rounded-lg mb-4 relative">
                <img 
                  src={project.thumbnail || `https://picsum.photos/seed/${project.id}/800/450`} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white fill-white" size={48} />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{project.role}</p>
                </div>
                <span className="text-xs font-mono text-white/20">{project.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <p className="text-white/40 font-serif italic text-lg">
            “촬영, 조명, 룩 설계, 색보정 협업을 통한 최상의 시각적 경험을 제공합니다.”
          </p>
        </div>
      </section>
    </div>
  );
};

const AboutPage = ({ data }: { data: PortfolioData }) => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        <div className="lg:col-span-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden glass p-1">
            <img 
              src={data.about.profile_image || "https://picsum.photos/seed/photographer/600/800"} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="lg:col-span-8 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-8">Director of Photography</h2>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
            {data.about.bio}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <div className="p-8 glass rounded-2xl">
          <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-6 flex items-center gap-2">
            <Camera size={16} /> Scope of Work
          </h3>
          <ul className="space-y-4 text-white/80">
            {data.about.scope.split('\n').map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-8 glass rounded-2xl">
          <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-6 flex items-center gap-2">
            <Layers size={16} /> Experience
          </h3>
          <div className="space-y-4 text-white/80 whitespace-pre-wrap">
            {data.about.career}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 glass rounded-2xl">
          <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-8 flex items-center gap-2">
            <Palette size={16} /> Strengths
          </h3>
          <ul className="space-y-4 text-white/80">
            {data.about.strengths.split('\n').map((s, i) => (
              <li key={i} className="font-medium italic font-serif text-lg">“{s}”</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = ({ data, onNavigate }: { data: PortfolioData, onNavigate: (s: string, p: ProjectData) => void }) => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24">
      <h2 className="text-5xl font-serif italic mb-16">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {data.projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => onNavigate('project-detail', project)}
            className="group cursor-pointer"
          >
            <div className="aspect-video overflow-hidden rounded-lg mb-6 relative">
              <img 
                src={project.thumbnail || `https://picsum.photos/seed/${project.id}/800/450`} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-dark/80 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase rounded-full border border-white/10">
                  {project.category}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium mb-2 group-hover:text-white/70 transition-colors">{project.title}</h3>
                <p className="text-sm text-white/40">{project.summary}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">{project.role}</span>
                </div>
              </div>
              <span className="text-sm font-mono text-white/20">{project.year}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProjectDetailPage = ({ project }: { project: ProjectData }) => {
  // Helper to get YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24">
      <div className="mb-16">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">{project.category} / {project.year}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">{project.title}</h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">{project.summary}</p>
      </div>

      {/* Videos Section */}
      <div className="space-y-16 mb-24">
        {project.videos.map((video, i) => (
          <div key={i} className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden glass">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(video.youtube_url)}`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">{video.title}</h3>
              <p className="text-white/50">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {[
          { label: 'Camera', value: project.camera },
          { label: 'Lens', value: project.lens },
          { label: 'Lighting', value: project.lighting },
          { label: 'Color', value: project.color },
        ].map((tech, i) => (
          <div key={i} className="p-6 glass rounded-xl">
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-2">{tech.label}</span>
            <p className="font-medium">{tech.value || '-'}</p>
          </div>
        ))}
      </div>

      {/* Contribution */}
      <div className="p-12 glass rounded-3xl border-white/5">
        <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-8">Role & Contribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <p className="text-2xl font-serif italic">{project.role}</p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
              {project.contribution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EquipmentPage = ({ data }: { data: PortfolioData }) => {
  const categories = ['Camera', 'Lens', 'Lighting', 'Color'];
  
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24">
      <h2 className="text-5xl font-serif italic mb-16">Equipment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <div key={cat} className="space-y-6">
            <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase border-b border-white/10 pb-4">{cat}</h3>
            <div className="space-y-4">
              {data.equipment.filter(e => e.category === cat).map((item) => (
                <div key={item.id} className="p-6 glass rounded-xl group hover:bg-white/10 transition-colors">
                  <h4 className="font-medium text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-white/40 italic">{item.context}</p>
                </div>
              ))}
              {data.equipment.filter(e => e.category === cat).length === 0 && (
                <p className="text-white/20 text-sm italic">No items listed.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = ({ data }: { data: PortfolioData }) => {
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(data.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(data.contact.phone);
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24 min-h-[90vh] flex flex-col justify-center">
      <h2 className="text-6xl md:text-8xl font-sans font-bold mb-16 tracking-tighter">CONTACT</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-white/40 uppercase block">Email</span>
          <div className="flex items-center gap-4 group">
            <a href={`mailto:${data.contact.email}`} className="text-2xl md:text-3xl font-light hover:text-white/70 transition-colors">
              {data.contact.email}
            </a>
            <button onClick={copyEmail} className="p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-white/40 uppercase block">Instagram</span>
          <a 
            href={data.contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl md:text-3xl font-light flex items-center gap-3 hover:text-white/70 transition-colors"
          >
            {data.contact.instagram_text} <ExternalLink size={20} className="text-white/20" />
          </a>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-white/40 uppercase block">Phone</span>
          <div className="flex items-center gap-4 group">
            <a href={`tel:${data.contact.phone}`} className="text-2xl md:text-3xl font-light hover:text-white/70 transition-colors">
              {data.contact.phone}
            </a>
            <button onClick={copyPhone} className="p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity relative">
              {phoneCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {phoneCopied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-dark text-[10px] font-mono rounded whitespace-nowrap shadow-xl">
                  Phone number copied.
                </span>
              )}
            </button>
          </div>
        </div>

        {data.home.resume_url && data.home.resume_url !== '#' && (
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-white/40 uppercase block">Resume</span>
            <div>
              <a 
                href={data.home.resume_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-dark text-sm font-medium rounded-full inline-flex items-center gap-2 hover:bg-white/90 transition-colors"
              >
                Resume Download <Download size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin Section ---

const AdminPanel = ({ data, onUpdate }: { data: PortfolioData, onUpdate: () => void }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Form States
  const [homeForm, setHomeForm] = useState(data.home);
  const [aboutForm, setAboutForm] = useState(data.about);
  const [contactForm, setContactForm] = useState(data.contact);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentData | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': '0901' },
        body: formData
      });
      const json = await res.json();
      return json.url;
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLogin = () => {
    if (password === '0901') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  const saveHome = async () => {
    const res = await fetch('/api/admin/home', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': '0901' },
      body: JSON.stringify(homeForm)
    });
    if (res.ok) { alert('Saved!'); onUpdate(); }
  };

  const saveAbout = async () => {
    const res = await fetch('/api/admin/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': '0901' },
      body: JSON.stringify(aboutForm)
    });
    if (res.ok) { alert('Saved!'); onUpdate(); }
  };

  const saveContact = async () => {
    const res = await fetch('/api/admin/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': '0901' },
      body: JSON.stringify(contactForm)
    });
    if (res.ok) { alert('Saved!'); onUpdate(); }
  };

  const saveProject = async (project: ProjectData) => {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': '0901' },
      body: JSON.stringify(project)
    });
    if (res.ok) { 
      alert('Project Saved!'); 
      setEditingProject(null);
      onUpdate(); 
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': '0901' }
    });
    if (res.ok) onUpdate();
  };

  const saveEquipment = async (eq: EquipmentData) => {
    const res = await fetch('/api/admin/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': '0901' },
      body: JSON.stringify(eq)
    });
    if (res.ok) { 
      alert('Equipment Saved!'); 
      setEditingEquipment(null);
      onUpdate(); 
    }
  };

  const deleteEquipment = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/admin/equipment/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': '0901' }
    });
    if (res.ok) onUpdate();
  };

  if (!isAuthorized) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center px-6">
        <div className="glass p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-serif italic mb-6">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-white/30"
          />
          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-white text-dark font-medium rounded-lg hover:bg-white/90 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-24">
      <div className="flex flex-wrap gap-4 mb-12 border-b border-white/10 pb-6">
        {['home', 'about', 'projects', 'equipment', 'contact'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-full transition-colors ${
              activeTab === tab ? 'bg-white text-dark' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'home' && (
        <div className="glass p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Name</label>
              <input 
                value={homeForm.name} 
                onChange={e => setHomeForm({...homeForm, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Job Title</label>
              <input 
                value={homeForm.job_title} 
                onChange={e => setHomeForm({...homeForm, job_title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Intro</label>
            <textarea 
              value={homeForm.intro} 
              onChange={e => setHomeForm({...homeForm, intro: e.target.value})}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Resume Download Link (Google Drive)</label>
            <input 
              value={homeForm.resume_url} 
              onChange={e => setHomeForm({...homeForm, resume_url: e.target.value})}
              placeholder="https://drive.google.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
            />
          </div>
          <button onClick={saveHome} className="px-6 py-2 bg-white text-dark rounded-lg flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="glass p-8 rounded-2xl space-y-6">
          <div>
            <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Profile Image</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file);
                    if (url) setAboutForm({...aboutForm, profile_image: url});
                  }
                }}
                className="hidden" 
                id="profile-upload"
              />
              <label 
                htmlFor="profile-upload" 
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 flex items-center gap-2 text-sm"
              >
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Choose File'}
              </label>
              {aboutForm.profile_image && (
                <img src={aboutForm.profile_image} alt="Preview" className="w-10 h-10 object-cover rounded border border-white/10" referrerPolicy="no-referrer" />
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Bio</label>
            <textarea 
              value={aboutForm.bio} 
              onChange={e => setAboutForm({...aboutForm, bio: e.target.value})}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Scope of Work (one per line)</label>
              <textarea 
                value={aboutForm.scope} 
                onChange={e => setAboutForm({...aboutForm, scope: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Career</label>
              <textarea 
                value={aboutForm.career} 
                onChange={e => setAboutForm({...aboutForm, career: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Strengths (one per line)</label>
              <textarea 
                value={aboutForm.strengths} 
                onChange={e => setAboutForm({...aboutForm, strengths: e.target.value})}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <button onClick={saveAbout} className="px-6 py-2 bg-white text-dark rounded-lg flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-8">
          <button 
            onClick={() => setEditingProject({
              title: '', year: '', category: '', role: '', summary: '', thumbnail: '',
              camera: '', lens: '', lighting: '', color: '', contribution: '', is_featured: false,
              videos: []
            })}
            className="px-6 py-3 border border-white/20 rounded-lg flex items-center gap-2 hover:bg-white/5"
          >
            <Plus size={18} /> Add New Project
          </button>

          {editingProject && (
            <div className="glass p-8 rounded-2xl space-y-6 border-white/20">
              <h3 className="text-xl font-serif italic">{editingProject.id ? 'Edit' : 'New'} Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input placeholder="Title" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <input placeholder="Year" value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <input placeholder="Category" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Role" value={editingProject.role} onChange={e => setEditingProject({...editingProject, role: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) setEditingProject({...editingProject, thumbnail: url});
                      }
                    }}
                    className="hidden" 
                    id="thumbnail-upload"
                  />
                  <label 
                    htmlFor="thumbnail-upload" 
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 flex items-center gap-2 text-sm h-[42px]"
                  >
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Thumbnail Image'}
                  </label>
                  {editingProject.thumbnail && (
                    <img src={editingProject.thumbnail} alt="Preview" className="w-10 h-10 object-cover rounded border border-white/10" referrerPolicy="no-referrer" />
                  )}
                </div>
              </div>
              <textarea placeholder="Summary" value={editingProject.summary} onChange={e => setEditingProject({...editingProject, summary: e.target.value})} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input placeholder="Camera" value={editingProject.camera} onChange={e => setEditingProject({...editingProject, camera: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <input placeholder="Lens" value={editingProject.lens} onChange={e => setEditingProject({...editingProject, lens: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <input placeholder="Lighting" value={editingProject.lighting} onChange={e => setEditingProject({...editingProject, lighting: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
                <input placeholder="Color" value={editingProject.color} onChange={e => setEditingProject({...editingProject, color: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              </div>
              
              <textarea placeholder="Contribution" value={editingProject.contribution} onChange={e => setEditingProject({...editingProject, contribution: e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editingProject.is_featured} onChange={e => setEditingProject({...editingProject, is_featured: e.target.checked})} />
                <span className="text-sm">Featured on Home</span>
              </label>

              <div className="space-y-4">
                <h4 className="text-xs font-mono text-white/40 uppercase">Videos</h4>
                {editingProject.videos.map((v, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg space-y-3 relative">
                    <button onClick={() => {
                      const newVideos = [...editingProject.videos];
                      newVideos.splice(idx, 1);
                      setEditingProject({...editingProject, videos: newVideos});
                    }} className="absolute top-2 right-2 text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
                    <input placeholder="Video Title" value={v.title} onChange={e => {
                      const newVideos = [...editingProject.videos];
                      newVideos[idx].title = e.target.value;
                      setEditingProject({...editingProject, videos: newVideos});
                    }} className="w-full bg-dark/50 border border-white/10 rounded px-3 py-1 text-sm" />
                    <input placeholder="YouTube URL" value={v.youtube_url} onChange={e => {
                      const newVideos = [...editingProject.videos];
                      newVideos[idx].youtube_url = e.target.value;
                      setEditingProject({...editingProject, videos: newVideos});
                    }} className="w-full bg-dark/50 border border-white/10 rounded px-3 py-1 text-sm" />
                    <textarea placeholder="Description" value={v.description} onChange={e => {
                      const newVideos = [...editingProject.videos];
                      newVideos[idx].description = e.target.value;
                      setEditingProject({...editingProject, videos: newVideos});
                    }} rows={1} className="w-full bg-dark/50 border border-white/10 rounded px-3 py-1 text-sm" />
                  </div>
                ))}
                <button 
                  onClick={() => setEditingProject({...editingProject, videos: [...editingProject.videos, { title: '', description: '', youtube_url: '' }]})}
                  className="text-xs font-mono text-white/40 hover:text-white flex items-center gap-2"
                >
                  <Plus size={14} /> Add Video
                </button>
              </div>

              <div className="flex gap-4">
                <button onClick={() => saveProject(editingProject)} className="px-6 py-2 bg-white text-dark rounded-lg">Save Project</button>
                <button onClick={() => setEditingProject(null)} className="px-6 py-2 border border-white/20 rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {data.projects.map(p => (
              <div key={p.id} className="glass p-6 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{p.title} <span className="text-white/20 ml-2">{p.year}</span></h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{p.category} | {p.role}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Settings size={18} /></button>
                  <button onClick={() => deleteProject(p.id!)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="space-y-8">
          <button 
            onClick={() => setEditingEquipment({ category: 'Camera', name: '', context: '' })}
            className="px-6 py-3 border border-white/20 rounded-lg flex items-center gap-2 hover:bg-white/5"
          >
            <Plus size={18} /> Add Equipment
          </button>

          {editingEquipment && (
            <div className="glass p-8 rounded-2xl space-y-6 border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select 
                  value={editingEquipment.category} 
                  onChange={e => setEditingEquipment({...editingEquipment, category: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                >
                  <option value="Camera" className="bg-dark">Camera</option>
                  <option value="Lens" className="bg-dark">Lens</option>
                  <option value="Lighting" className="bg-dark">Lighting</option>
                  <option value="Color" className="bg-dark">Color</option>
                </select>
                <input placeholder="Name" value={editingEquipment.name} onChange={e => setEditingEquipment({...editingEquipment, name: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              </div>
              <input placeholder="Context (e.g. 런앤건 운용)" value={editingEquipment.context} onChange={e => setEditingEquipment({...editingEquipment, context: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              <div className="flex gap-4">
                <button onClick={() => saveEquipment(editingEquipment)} className="px-6 py-2 bg-white text-dark rounded-lg">Save Item</button>
                <button onClick={() => setEditingEquipment(null)} className="px-6 py-2 border border-white/20 rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {data.equipment.map(e => (
              <div key={e.id} className="glass p-6 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block mb-1">{e.category}</span>
                  <h4 className="font-medium">{e.name}</h4>
                  <p className="text-xs text-white/40 italic">{e.context}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingEquipment(e)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Settings size={18} /></button>
                  <button onClick={() => deleteEquipment(e.id!)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="glass p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Email</label>
              <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Phone</label>
              <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Instagram URL</label>
              <input value={contactForm.instagram} onChange={e => setContactForm({...contactForm, instagram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Instagram Display Text</label>
              <input value={contactForm.instagram_text} onChange={e => setContactForm({...contactForm, instagram_text: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" placeholder="@username" />
            </div>
          </div>
          <button onClick={saveContact} className="px-6 py-2 bg-white text-dark rounded-lg flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (section: string, project?: ProjectData) => {
    if (project) setSelectedProject(project);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-xs font-mono tracking-[0.5em] text-white/40"
        >
          LOADING
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark selection:bg-white selection:text-dark">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection + (selectedProject?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {activeSection === 'home' && <HomePage data={data} onNavigate={handleNavigate} />}
            {activeSection === 'about' && <AboutPage data={data} />}
            {activeSection === 'projects' && <ProjectsPage data={data} onNavigate={handleNavigate} />}
            {activeSection === 'project-detail' && selectedProject && <ProjectDetailPage project={selectedProject} />}
            {activeSection === 'equipment' && <EquipmentPage data={data} />}
            {activeSection === 'contact' && <ContactPage data={data} />}
            {activeSection === 'admin' && <AdminPanel data={data} onUpdate={fetchData} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
          © {new Date().getFullYear()} {data.home.name}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
