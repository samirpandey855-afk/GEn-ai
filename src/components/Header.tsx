import React from 'react';

interface HeaderProps {
  activeTab: 'curriculum' | 'attention-lab' | 'sampler-lab' | 'quiz';
  onSelectTab: (tab: 'curriculum' | 'attention-lab' | 'sampler-lab' | 'quiz') => void;
  onOpenFormulaSheet: () => void;
  paperTheme: string;
  onChangePaperTheme: (theme: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenFormulaSheet,
  paperTheme,
  onChangePaperTheme
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, display font, whitespace-nowrap) */}
        <button
          onClick={() => onSelectTab('curriculum')}
          className="text-lg font-bold tracking-tight text-slate-900 font-sans whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-handwriting text-xl shadow-xs">
            ✎
          </span>
          <span>GenAI Illustrated Codex</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 font-sans">
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'curriculum'
                ? 'border-amber-600 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Curriculum
          </button>

          <button
            onClick={() => onSelectTab('attention-lab')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'attention-lab'
                ? 'border-amber-600 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Attention Lab
          </button>

          <button
            onClick={() => onSelectTab('sampler-lab')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'sampler-lab'
                ? 'border-amber-600 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sampling Lab
          </button>

          <button
            onClick={onOpenFormulaSheet}
            className="whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 border-transparent text-slate-600 hover:text-slate-900"
          >
            Formula Sheet
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'quiz'
                ? 'border-amber-600 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Quiz Deck
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Paper theme selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-sans mr-2">
            <span>Paper:</span>
            <select
              value={paperTheme}
              onChange={(e) => onChangePaperTheme(e.target.value)}
              className="border border-slate-200 rounded px-2 py-1 text-slate-700 bg-slate-50 text-xs focus:outline-none"
            >
              <option value="moleskine">Moleskine Grid</option>
              <option value="grid">Clean Graph</option>
              <option value="ruled">Ruled Notebook</option>
              <option value="blueprint">Engineering Blueprint</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 font-sans"
          >
            Print Study Notes
          </button>
        </div>
      </div>
    </header>
  );
};
