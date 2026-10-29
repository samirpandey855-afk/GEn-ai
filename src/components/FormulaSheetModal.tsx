import React, { useState } from 'react';
import { CHEAT_SHEET_FORMULAS } from '../data/notesData';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = CHEAT_SHEET_FORMULAS.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (formula: string, idx: number) => {
    navigator.clipboard.writeText(formula);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-handwriting font-bold text-lg text-amber-700">Quick Reference</span>
              <span className="text-slate-300">·</span>
              <h2 className="text-lg font-bold text-slate-900 font-sans">Gen AI Mathematical Formula Sheet</h2>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Essential equations, memory footprint calculations, and scaling laws.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <input
            type="text"
            placeholder="Search formulas (e.g. Attention, VRAM, KV Cache, LoRA, Flops)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Formula list */}
        <div className="p-5 overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          {filtered.map((item, idx) => (
            <div key={idx} className="pt-3.5 first:pt-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800 font-sans">{item.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(item.formula, idx)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-mono transition-colors"
                >
                  {copiedIndex === idx ? 'Copied ✓' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto shadow-inner">
                {item.formula}
              </div>

              <div className="mt-1.5 text-xs text-slate-500 font-handwriting leading-relaxed">
                ✎ {item.quickNote}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No formulas matched "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>Tip: Press Print (Ctrl+P) to print the current study guide</span>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Print Guide
          </button>
        </div>
      </div>
    </div>
  );
};
