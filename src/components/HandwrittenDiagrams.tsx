import React from 'react';

interface DiagramProps {
  type: 'neural-net' | 'vectors' | 'attention' | 'transformer' | 'causal-mask' | 'kv-cache' | 'moe' | 'rag' | 'diffusion' | 'lora';
  caption?: string;
}

export const HandwrittenDiagram: React.FC<DiagramProps> = ({ type, caption }) => {
  switch (type) {
    case 'vectors':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <svg viewBox="0 0 600 320" className="w-full h-auto max-w-lg mx-auto font-mono text-xs">
            {/* Background Grid */}
            <defs>
              <pattern id="diag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="0.8" />
              </pattern>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e3a8a" />
              </marker>
              <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag-grid)" rx="8" />

            {/* Coordinate Axes */}
            <line x1="80" y1="260" x2="520" y2="260" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="120" y1="280" x2="120" y2="40" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="500" y="280" fill="#64748b" className="font-sans">Dimension X₁</text>
            <text x="60" y="55" fill="#64748b" className="font-sans">Dimension X₂</text>

            {/* Vector u (e.g. "Cat") */}
            <line x1="120" y1="260" x2="380" y2="100" stroke="#1e3a8a" strokeWidth="3" markerEnd="url(#arrow)" />
            <circle cx="380" cy="100" r="4" fill="#1e3a8a" />
            <text x="390" y="95" fill="#1e3a8a" className="font-bold text-sm font-sans">u = "Kitten" [x₁, x₂]</text>

            {/* Vector v (e.g. "Cat") */}
            <line x1="120" y1="260" x2="430" y2="160" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow-amber)" />
            <circle cx="430" cy="160" r="4" fill="#d97706" />
            <text x="440" y="165" fill="#d97706" className="font-bold text-sm font-sans">v = "Cat" [x₁, x₂]</text>

            {/* Angle θ Arc */}
            <path d="M 230 260 A 110 110 0 0 0 250 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
            <text x="250" y="235" fill="#ef4444" className="font-bold text-sm font-handwriting">θ (small angle)</text>

            {/* Hand-written Annotation Callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="220" height="48" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x="12" y="20" fill="#92400e" className="font-bold text-xs font-handwriting">High Cosine Sim: cos(θ) ≈ 0.95</text>
              <text x="12" y="36" fill="#78350f" className="text-[11px] font-sans">Similar direction in semantic space!</text>
            </g>
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 1.1: High-dimensional vector coordinates and cosine angle between semantically related words.'}
          </p>
        </div>
      );

    case 'attention':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <svg viewBox="0 0 700 240" className="w-full h-auto max-w-2xl mx-auto text-xs">
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
              </marker>
            </defs>

            {/* Step 1: Q and K */}
            <rect x="30" y="30" width="70" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="65" y="60" textAnchor="middle" fill="#1e40af" className="font-bold font-mono">Query Q</text>

            <rect x="30" y="100" width="70" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="65" y="130" textAnchor="middle" fill="#1e40af" className="font-bold font-mono">Key Kᵀ</text>

            {/* Multiply symbol */}
            <line x1="100" y1="55" x2="140" y2="85" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            <line x1="100" y1="125" x2="140" y2="95" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

            {/* Step 2: Matmul Q * K^T */}
            <rect x="145" y="65" width="85" height="50" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
            <text x="187" y="90" textAnchor="middle" fill="#0f172a" className="font-mono font-bold">MatMul</text>
            <text x="187" y="105" textAnchor="middle" fill="#64748b" className="text-[10px]">Q · Kᵀ</text>

            <line x1="230" y1="90" x2="265" y2="90" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

            {/* Step 3: Scale 1 / sqrt(d_k) */}
            <rect x="270" y="65" width="75" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="307" y="90" textAnchor="middle" fill="#92400e" className="font-mono font-bold">Scale</text>
            <text x="307" y="105" textAnchor="middle" fill="#b45309" className="text-[10px]">÷ √d_k</text>

            <line x1="345" y1="90" x2="380" y2="90" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

            {/* Step 4: Mask (optional) & Softmax */}
            <rect x="385" y="65" width="85" height="50" rx="6" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="427" y="90" textAnchor="middle" fill="#5b21b6" className="font-mono font-bold">Softmax</text>
            <text x="427" y="105" textAnchor="middle" fill="#7c3aed" className="text-[10px]">(Weights Σ=1)</text>

            {/* Step 5: Multiply by Value V */}
            <rect x="385" y="150" width="70" height="45" rx="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
            <text x="420" y="178" textAnchor="middle" fill="#15803d" className="font-mono font-bold">Value V</text>

            <line x1="470" y1="90" x2="520" y2="115" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            <line x1="455" y1="172" x2="520" y2="125" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

            {/* Step 6: Final MatMul & Context Vector */}
            <rect x="525" y="95" width="130" height="50" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
            <text x="590" y="120" textAnchor="middle" fill="#065f46" className="font-mono font-bold text-sm">Context Output</text>
            <text x="590" y="135" textAnchor="middle" fill="#047857" className="text-[10px]">Attention(Q,K,V)</text>

            {/* Handwritten note on top */}
            <g transform="translate(240, 5)">
              <text x="0" y="12" fill="#d97706" className="font-handwriting font-bold text-sm">
                Scale prevents Softmax gradient saturation!
              </text>
            </g>
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 3.1: Scaled Dot-Product Attention pipeline as formulated in "Attention Is All You Need".'}
          </p>
        </div>
      );

    case 'causal-mask':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
              <span>Rows = Query position</span>
              <span>Cols = Key position</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-100 rounded-lg border border-slate-200 text-center font-mono text-xs">
              {/* Row 1: Token 1 ("The") */}
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">1.0 ("The")</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>

              {/* Row 2: Token 2 ("cat") */}
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.3 ("The")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.7 ("cat")</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>

              {/* Row 3: Token 3 ("sat") */}
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.1 ("The")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.4 ("cat")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.5 ("sat")</div>
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-400 rounded opacity-50">-∞ (Masked)</div>

              {/* Row 4: Token 4 ("down") */}
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.05 ("The")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.25 ("cat")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.30 ("sat")</div>
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold">0.40 ("down")</div>
            </div>
            <div className="mt-2 text-xs text-center font-handwriting text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
              Notice the lower-triangular shape! Each token can only look at itself and earlier tokens, never future tokens.
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 3.2: Causal Mask Matrix enforcing autoregressive text generation.'}
          </p>
        </div>
      );

    case 'kv-cache':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <svg viewBox="0 0 650 200" className="w-full h-auto max-w-xl mx-auto text-xs font-mono">
            {/* Cached Keys and Values */}
            <rect x="40" y="40" width="340" height="120" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="210" y="30" textAnchor="middle" fill="#475569" className="font-bold font-sans">GPU High Bandwidth Memory (KV Cache)</text>

            {/* Cached Token columns */}
            <g transform="translate(60, 55)">
              <rect x="0" y="0" width="55" height="90" rx="4" fill="#e0f2fe" stroke="#0284c7" />
              <text x="27" y="25" textAnchor="middle" fill="#0369a1" className="font-bold">Token 1</text>
              <text x="27" y="50" textAnchor="middle" fill="#0284c7" className="text-[10px]">K₁</text>
              <text x="27" y="70" textAnchor="middle" fill="#0284c7" className="text-[10px]">V₁</text>
            </g>

            <g transform="translate(130, 55)">
              <rect x="0" y="0" width="55" height="90" rx="4" fill="#e0f2fe" stroke="#0284c7" />
              <text x="27" y="25" textAnchor="middle" fill="#0369a1" className="font-bold">Token 2</text>
              <text x="27" y="50" textAnchor="middle" fill="#0284c7" className="text-[10px]">K₂</text>
              <text x="27" y="70" textAnchor="middle" fill="#0284c7" className="text-[10px]">V₂</text>
            </g>

            <text x="215" y="105" textAnchor="middle" fill="#94a3b8" className="text-lg">···</text>

            <g transform="translate(245, 55)">
              <rect x="0" y="0" width="55" height="90" rx="4" fill="#e0f2fe" stroke="#0284c7" />
              <text x="27" y="25" textAnchor="middle" fill="#0369a1" className="font-bold">Token N</text>
              <text x="27" y="50" textAnchor="middle" fill="#0284c7" className="text-[10px]">Kₙ</text>
              <text x="27" y="70" textAnchor="middle" fill="#0284c7" className="text-[10px]">Vₙ</text>
            </g>

            <g transform="translate(315, 55)">
              <rect x="0" y="0" width="55" height="90" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="27" y="25" textAnchor="middle" fill="#92400e" className="font-bold">+ New</text>
              <text x="27" y="50" textAnchor="middle" fill="#b45309" className="text-[10px]">Kₙ₊₁</text>
              <text x="27" y="70" textAnchor="middle" fill="#b45309" className="text-[10px]">Vₙ₊₁</text>
            </g>

            {/* Incoming New Token Query */}
            <g transform="translate(440, 55)">
              <rect x="0" y="0" width="160" height="90" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="80" y="28" textAnchor="middle" fill="#15803d" className="font-bold text-xs font-sans">Current Step (Token N+1)</text>
              <text x="80" y="50" textAnchor="middle" fill="#166534" className="text-[11px]">Computes Qₙ₊₁ only!</text>
              <text x="80" y="72" textAnchor="middle" fill="#15803d" className="text-[10px]">Queries cached K & V</text>
            </g>

            <path d="M 440 100 L 385 100" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 4.1: The Key-Value Cache allows O(1) attention operations per decode step instead of recomputing all past tokens.'}
          </p>
        </div>
      );

    case 'lora':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <svg viewBox="0 0 650 200" className="w-full h-auto max-w-xl mx-auto text-xs font-mono">
            {/* Input Vector x */}
            <rect x="30" y="70" width="50" height="60" rx="4" fill="#e2e8f0" stroke="#64748b" />
            <text x="55" y="105" textAnchor="middle" fill="#1e293b" className="font-bold">x</text>

            {/* Branch 1: Frozen W_0 */}
            <path d="M 80 85 L 140 50" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <rect x="145" y="20" width="120" height="60" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <text x="205" y="45" textAnchor="middle" fill="#475569" className="font-bold">W₀ (Frozen)</text>
            <text x="205" y="62" textAnchor="middle" fill="#64748b" className="text-[10px]">dim: d × k (Millions)</text>

            {/* Branch 2: Trainable LoRA A and B */}
            <path d="M 80 115 L 140 145" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <rect x="145" y="125" width="75" height="45" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="182" y="145" textAnchor="middle" fill="#1e40af" className="font-bold">A (r × k)</text>
            <text x="182" y="160" textAnchor="middle" fill="#1d4ed8" className="text-[9px]">Gaussian init</text>

            <line x1="220" y1="147" x2="245" y2="147" stroke="#2563eb" strokeWidth="1.5" />

            <rect x="250" y="125" width="75" height="45" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="287" y="145" textAnchor="middle" fill="#1e40af" className="font-bold">B (d × r)</text>
            <text x="287" y="160" textAnchor="middle" fill="#1d4ed8" className="text-[9px]">Zero init</text>

            {/* Combine with Addition + */}
            <path d="M 265 50 L 380 90" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 325 147 L 380 110" fill="none" stroke="#2563eb" strokeWidth="1.5" />

            <circle cx="390" cy="100" r="16" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="390" y="105" textAnchor="middle" fill="#b45309" className="font-bold text-base">+</text>

            {/* Output h */}
            <line x1="406" y1="100" x2="470" y2="100" stroke="#0f172a" strokeWidth="2" />
            <rect x="475" y="70" width="130" height="60" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
            <text x="540" y="95" textAnchor="middle" fill="#065f46" className="font-bold">h = W₀x + (α/r)BAx</text>
            <text x="540" y="115" textAnchor="middle" fill="#047857" className="text-[10px]">Zero latency when folded!</text>

            {/* Handwritten callout */}
            <text x="170" y="190" fill="#2563eb" className="font-handwriting font-bold text-xs">
              Rank r = 16 saves 99% of training parameters!
            </text>
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 6.1: LoRA low-rank decomposition into matrices B and A alongside frozen pre-trained weights W_0.'}
          </p>
        </div>
      );

    case 'rag':
      return (
        <div className="my-6 p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm">
          <svg viewBox="0 0 700 220" className="w-full h-auto max-w-2xl mx-auto text-xs font-sans">
            {/* User Query */}
            <rect x="20" y="30" width="110" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="75" y="55" textAnchor="middle" fill="#1e40af" className="font-bold">User Query</text>
            <text x="75" y="75" textAnchor="middle" fill="#60a5fa" className="text-[10px]">"What is QLoRA?"</text>

            {/* Embedding Model */}
            <path d="M 130 60 L 175 60" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <rect x="180" y="30" width="110" height="60" rx="6" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="235" y="55" textAnchor="middle" fill="#5b21b6" className="font-bold">Embedding Model</text>
            <text x="235" y="75" textAnchor="middle" fill="#7c3aed" className="text-[10px]">Vector: [0.12, -0.45...]</text>

            {/* Vector DB */}
            <path d="M 290 60 L 335 60" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
            <rect x="340" y="20" width="120" height="80" rx="6" fill="#fefce8" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="400" y="45" textAnchor="middle" fill="#854d0e" className="font-bold">Vector Database</text>
            <text x="400" y="65" textAnchor="middle" fill="#a16207" className="text-[10px]">Top-K Cosine Search</text>
            <text x="400" y="85" textAnchor="middle" fill="#ca8a04" className="text-[9px]">Chroma / Pinecone</text>

            {/* Retrieved Context Chunks */}
            <path d="M 460 60 L 505 60" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="510" y="25" width="170" height="70" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
            <text x="595" y="48" textAnchor="middle" fill="#15803d" className="font-bold">Augmented Prompt</text>
            <text x="595" y="68" textAnchor="middle" fill="#166534" className="text-[10px]">Context: [Chunk #42]</text>
            <text x="595" y="82" textAnchor="middle" fill="#15803d" className="text-[9px]">Question: "What is QLoRA?"</text>

            {/* LLM Generation */}
            <path d="M 595 95 L 595 130" fill="none" stroke="#16a34a" strokeWidth="1.5" />
            <rect x="510" y="135" width="170" height="65" rx="6" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
            <text x="595" y="160" textAnchor="middle" fill="#9d174d" className="font-bold">LLM Generator</text>
            <text x="595" y="180" textAnchor="middle" fill="#be185d" className="text-[10px]">Grounded Answer with Citation [1]</text>

            {/* Bottom note */}
            <g transform="translate(140, 160)">
              <text x="0" y="15" fill="#475569" className="font-handwriting font-bold text-sm">
                RAG turns a "closed-book" hallucination exam into an "open-book" verified answer!
              </text>
            </g>
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500 font-sans">
            {caption || 'Fig 6.2: End-to-end Retrieval-Augmented Generation (RAG) dataflow pipeline.'}
          </p>
        </div>
      );

    default:
      return null;
  }
};
