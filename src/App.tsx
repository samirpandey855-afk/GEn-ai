import React, { useState, useMemo } from 'react';
import { GEN_AI_MODULES, ModuleData, SectionItem } from './data/notesData';
import { Header } from './components/Header';
import { HandwrittenDiagram } from './components/HandwrittenDiagrams';
import { InteractiveAttentionLab } from './components/InteractiveAttentionLab';
import { InteractiveSamplerLab } from './components/InteractiveSamplerLab';
import { InteractiveActivationLab } from './components/InteractiveActivationLab';
import { QuizDeck } from './components/QuizDeck';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { PersonalNotesDrawer } from './components/PersonalNotesDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'attention-lab' | 'sampler-lab' | 'quiz'>('curriculum');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(GEN_AI_MODULES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [paperTheme, setPaperTheme] = useState('moleskine');
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Active module object
  const activeModule: ModuleData = useMemo(() => {
    return GEN_AI_MODULES.find(m => m.id === selectedModuleId) || GEN_AI_MODULES[0];
  }, [selectedModuleId]);

  // Search filtering across all modules and sections
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return GEN_AI_MODULES;
    const q = searchQuery.toLowerCase();
    return GEN_AI_MODULES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.sections.some(s =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.coreConcepts.some(c => c.toLowerCase().includes(q)) ||
        s.explanation.some(e => e.toLowerCase().includes(q)) ||
        (s.interviewTrap && s.interviewTrap.toLowerCase().includes(q))
      )
    );
  }, [searchQuery]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1800);
  };

  const getPaperBgClass = () => {
    switch (paperTheme) {
      case 'grid': return 'paper-grid';
      case 'ruled': return 'paper-ruled';
      case 'blueprint': return 'paper-blueprint text-sky-100';
      case 'chalkboard': return 'paper-chalkboard text-emerald-100';
      case 'moleskine':
      default:
        return 'paper-moleskine';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f2e9] text-slate-800">
      {/* Top Bar (adheres strictly to Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenFormulaSheet={() => setIsFormulaSheetOpen(true)}
        paperTheme={paperTheme}
        onChangePaperTheme={setPaperTheme}
      />

      {/* Hero / Cover Section */}
      <section className="bg-[#f0ece0] border-b border-slate-200/80 px-6 py-10 md:py-14 no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            {/* Clean unboxed metadata (anti-slop rule) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-800 font-sans font-medium">
              <span>The Complete Handwritten Codex</span>
              <span aria-hidden="true">·</span>
              <span>7 Modules</span>
              <span aria-hidden="true">·</span>
              <span>Foundations to Production Systems</span>
              <span aria-hidden="true">·</span>
              <span>Updated 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              Handwritten Notes for Generative AI & Transformers
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed max-w-2xl">
              An exhaustive, mathematically rigorous study notebook covering the complete arc of modern AI: from vectors, gradient descent, and multi-layer perceptrons to scaled dot-product attention, causal LLM training, diffusion, RAG, and production agent blueprints.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors font-sans ${
                  activeTab === 'curriculum' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Read Curriculum
              </button>

              <button
                onClick={() => setActiveTab('attention-lab')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors font-sans ${
                  activeTab === 'attention-lab' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Attention Simulator
              </button>

              <button
                onClick={() => setActiveTab('sampler-lab')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors font-sans ${
                  activeTab === 'sampler-lab' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sampling Lab
              </button>

              <button
                onClick={() => setIsFormulaSheetOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors font-sans bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                Formula Sheet
              </button>

              <button
                onClick={() => setIsNotesDrawerOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors font-sans bg-amber-100/80 text-amber-900 border border-amber-300 hover:bg-amber-200/80 flex items-center gap-1.5"
              >
                <span>✎</span>
                <span>My Margin Notes</span>
              </button>
            </div>
          </div>

          {/* Authentic Notebook Hero Image Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-amber-900/10 shadow-lg bg-white group">
              <img
                src="/src/assets/images/notebook_cover_handwritten_1793263448358.jpg"
                alt="Handwritten engineering study notebook open on desk with fountain pen"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs font-handwriting">
                "In deep learning, mathematics is not abstract theory—it is code in motion."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Render Active Tab Component */}
        {activeTab === 'attention-lab' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('curriculum')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 font-sans"
              >
                ← Back to Curriculum Notes
              </button>
            </div>
            <InteractiveAttentionLab />
          </div>
        )}

        {activeTab === 'sampler-lab' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('curriculum')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 font-sans"
              >
                ← Back to Curriculum Notes
              </button>
            </div>
            <InteractiveSamplerLab />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('curriculum')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 font-sans"
              >
                ← Back to Curriculum Notes
              </button>
            </div>
            <QuizDeck />
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Notebook Index & Search */}
            <aside className="lg:col-span-4 space-y-4 no-print sticky top-20">
              {/* Search Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                <input
                  type="text"
                  placeholder="Search concepts, formulas, KV cache, LoRA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              {/* Module Navigation Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Table of Contents
                </div>

                {filteredModules.map((mod) => {
                  const isSelected = mod.id === activeModule.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-50/90 border border-amber-300/80 shadow-xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mod.moduleNumber}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-amber-950 font-sans' : 'text-slate-800 font-sans'}`}>
                          {mod.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-sans truncate mt-0.5">
                          {mod.tagline}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          ~{mod.estimatedMinutes} min read · {mod.sections.length} topics
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Interactive Widgets in Sidebar */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-handwriting font-bold text-lg text-amber-800">Notebook Tools</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <button
                    onClick={() => setActiveTab('attention-lab')}
                    className="p-2.5 bg-white hover:bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium text-left transition-colors shadow-xs"
                  >
                    <span className="block font-bold">Attention Lab</span>
                    <span className="text-[10px] text-slate-500">Q, K, V Matrix</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sampler-lab')}
                    className="p-2.5 bg-white hover:bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium text-left transition-colors shadow-xs"
                  >
                    <span className="block font-bold">Sampling Lab</span>
                    <span className="text-[10px] text-slate-500">Temp & Top-P</span>
                  </button>

                  <button
                    onClick={() => setIsFormulaSheetOpen(true)}
                    className="p-2.5 bg-white hover:bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium text-left transition-colors shadow-xs"
                  >
                    <span className="block font-bold">Formula Sheet</span>
                    <span className="text-[10px] text-slate-500">Quick Cheatsheet</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="p-2.5 bg-white hover:bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium text-left transition-colors shadow-xs"
                  >
                    <span className="block font-bold">Quiz Deck</span>
                    <span className="text-[10px] text-slate-500">Interview Traps</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Main Notebook Page */}
            <div className="lg:col-span-8 space-y-8">
              {/* Notebook Paper Sheet Container */}
              <article className={`rounded-3xl border border-slate-300/80 shadow-md p-6 sm:p-10 transition-colors ${getPaperBgClass()}`}>
                {/* Notebook Page Header Stamp */}
                <div className="border-b-2 border-slate-300 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                      <span>MODULE {activeModule.moduleNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>EST. STUDY: {activeModule.estimatedMinutes} MIN</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-handwriting text-base text-amber-700">Class Notes</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                      {activeModule.title}
                    </h2>
                    <p className="text-sm text-slate-600 font-sans mt-1">
                      {activeModule.tagline}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNotesDrawerOpen(true)}
                    className="px-3.5 py-2 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-handwriting text-base font-bold transition-colors border border-amber-400/80 shadow-xs self-start sm:self-auto flex items-center gap-1.5 no-print"
                  >
                    <span>✎ Add Sticky Note</span>
                  </button>
                </div>

                {/* Module Summary Callout Box */}
                <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-300/90 mb-10 shadow-xs relative">
                  <div className="font-bold text-amber-900 text-sm font-sans mb-1 flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    <span>Executive Summary & Learning Objectives:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 font-sans leading-relaxed">
                    {activeModule.summary}
                  </p>
                </div>

                {/* Module Cover Illustration if present */}
                {activeModule.coverImage && (
                  <div className="mb-10 rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-white">
                    <img
                      src={activeModule.coverImage}
                      alt={activeModule.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                    <div className="p-2.5 bg-slate-50 text-center text-xs text-slate-500 font-mono">
                      Technical Architecture Diagram · {activeModule.title}
                    </div>
                  </div>
                )}

                {/* Render Sections */}
                <div className="space-y-12">
                  {activeModule.sections.map((section, sIdx) => (
                    <section key={section.id} id={section.id} className="pt-6 first:pt-0 border-t border-slate-200/80 first:border-none">
                      {/* Section Title */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                          <span>SECTION {activeModule.moduleNumber}.{sIdx + 1}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans leading-snug">
                          {section.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                          {section.subtitle}
                        </p>
                      </div>

                      {/* Handwritten Sticky Note / Callout */}
                      {section.handwrittenCallout && (
                        <div className="my-5 p-4 bg-amber-100/90 border border-amber-300 rounded-xl shadow-xs rotate-[-0.5deg] font-handwriting text-lg text-amber-950 leading-relaxed">
                          <div className="font-bold text-amber-800 text-sm font-sans mb-0.5">
                            ✎ Handwritten Study Insight:
                          </div>
                          <div className="whitespace-pre-line">
                            {section.handwrittenCallout}
                          </div>
                        </div>
                      )}

                      {/* Core Concepts Bullet Strip */}
                      <div className="my-4 p-4 bg-white/80 rounded-xl border border-slate-200/90">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-2">
                          Key Pillars & Invariants:
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
                          {section.coreConcepts.map((concept, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Detailed Explanations */}
                      <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed my-4">
                        {section.explanation.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>

                      {/* Key Formula Block with Variable Breakdown */}
                      {section.keyFormula && (
                        <div className="my-6 p-4 rounded-xl bg-slate-900 text-amber-300 shadow-md border border-slate-800">
                          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Governing Mathematical Formula</span>
                            <span className="text-amber-400">Latex Notation</span>
                          </div>
                          <div className="p-3 bg-slate-950/80 rounded-lg text-center font-mono text-sm sm:text-base text-amber-300 overflow-x-auto shadow-inner my-2">
                            {section.keyFormula.latex}
                          </div>
                          <p className="text-xs text-slate-300 font-sans mb-3">
                            {section.keyFormula.description}
                          </p>

                          {/* Variable Legend */}
                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            <span className="text-[10px] uppercase font-mono text-slate-400">Variable Glossary:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
                              {section.keyFormula.variables.map((v, vIdx) => (
                                <div key={vIdx} className="flex items-start gap-2">
                                  <span className="font-mono text-amber-400 font-bold">{v.symbol}:</span>
                                  <span className="text-slate-300 text-[11px]">{v.meaning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hand-Drawn Technical Diagram */}
                      {section.sketchType && (
                        <HandwrittenDiagram type={section.sketchType} />
                      )}

                      {/* Code Snippet with 1-Click Copy */}
                      {section.codeSnippet && (
                        <div className="my-5 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
                          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>{section.codeSnippet.title}</span>
                            <button
                              onClick={() => handleCopyCode(section.codeSnippet!.code, section.id)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              {copiedCodeId === section.id ? 'Copied ✓' : 'Copy Code'}
                            </button>
                          </div>
                          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                            <code>{section.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Staff Interview Trap Callout */}
                      {section.interviewTrap && (
                        <div className="my-4 p-4 bg-rose-50/90 rounded-xl border border-rose-200 text-xs font-sans text-rose-950">
                          <div className="font-bold text-rose-800 text-xs flex items-center gap-1.5 mb-1 font-mono uppercase">
                            <span>⚠️ Staff & Senior AI Interview Trap</span>
                          </div>
                          <p className="leading-relaxed">{section.interviewTrap}</p>
                        </div>
                      )}

                      {/* Real-World Application Blueprint */}
                      <div className="my-4 p-4 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs font-sans text-emerald-950">
                        <div className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 mb-1 font-mono uppercase">
                          <span>🚀 Real-World Industry Application</span>
                        </div>
                        <p className="leading-relaxed">{section.realWorldApp}</p>
                      </div>
                    </section>
                  ))}
                </div>

                {/* Inline Activation Lab inside Module 01 */}
                {activeModule.id === 'foundations-ml-math' && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <InteractiveActivationLab />
                  </div>
                )}

                {/* Inline Attention Lab inside Module 03 */}
                {activeModule.id === 'transformer-architecture-deep-dive' && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <InteractiveAttentionLab />
                  </div>
                )}

                {/* Inline Sampler Lab inside Module 04 */}
                {activeModule.id === 'llms-training-inference' && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <InteractiveSamplerLab />
                  </div>
                )}

                {/* Notebook Navigation Bottom Buttons */}
                <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
                  {GEN_AI_MODULES.findIndex(m => m.id === activeModule.id) > 0 ? (
                    <button
                      onClick={() => {
                        const idx = GEN_AI_MODULES.findIndex(m => m.id === activeModule.id);
                        setSelectedModuleId(GEN_AI_MODULES[idx - 1].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-sans shadow-xs"
                    >
                      ← Previous Module
                    </button>
                  ) : <div />}

                  {GEN_AI_MODULES.findIndex(m => m.id === activeModule.id) < GEN_AI_MODULES.length - 1 ? (
                    <button
                      onClick={() => {
                        const idx = GEN_AI_MODULES.findIndex(m => m.id === activeModule.id);
                        setSelectedModuleId(GEN_AI_MODULES[idx + 1].id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 font-sans shadow-xs"
                    >
                      Next Module →
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 rounded-lg hover:bg-amber-800 font-sans shadow-xs"
                    >
                      Take Final Mastery Quiz →
                    </button>
                  )}
                </div>
              </article>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#eae4d3] border-t border-slate-300 py-8 px-6 text-xs text-slate-600 font-sans no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-base text-amber-800">GenAI Illustrated Codex</span>
            <span>·</span>
            <span>Handcrafted study companion from Machine Learning basics to Transformers & Autonomous Agents</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Formula Cheat Sheet
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-slate-900 transition-colors"
            >
              Quiz Deck
            </button>
            <button
              onClick={() => window.print()}
              className="hover:text-slate-900 transition-colors"
            >
              Print Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Formula Sheet Modal */}
      <FormulaSheetModal
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      {/* Personal Margin Notes Drawer */}
      <PersonalNotesDrawer
        currentModuleId={activeModule.id}
        currentModuleTitle={activeModule.title}
        isOpen={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
      />
    </div>
  );
}
