import React, { useState } from 'react';

interface ActivationDef {
  id: string;
  name: string;
  formula: string;
  usedIn: string;
  description: string;
  evalFn: (x: number) => number;
  derivativeFn: (x: number) => number;
  color: string;
}

const ACTIVATIONS: ActivationDef[] = [
  {
    id: 'swiglu',
    name: 'SwiGLU',
    formula: 'SwiGLU(x) = (x · σ(βx)) ⊙ (x W_up)',
    usedIn: 'Llama 3, Mistral, PaLM, Gemma',
    description: 'Bilinear gating mechanism: smooth non-linearity allows dynamic gating of features. The gold standard for modern LLMs.',
    evalFn: (x) => {
      // Approximating 1D slice: Swish(x) * x = x / (1 + exp(-x)) * x
      const swish = x / (1 + Math.exp(-x));
      return swish * (0.8 * x + 0.5);
    },
    derivativeFn: (x) => {
      const sig = 1 / (1 + Math.exp(-x));
      return (sig + x * sig * (1 - sig)) * 1.2;
    },
    color: '#d97706' // amber
  },
  {
    id: 'gelu',
    name: 'GELU (Gaussian Error Linear Unit)',
    formula: 'GELU(x) = x · Φ(x) ≈ 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))',
    usedIn: 'GPT-3, BERT, RoBERTa, ViT',
    description: 'Smooth approximation of ReLU with probabilistic gating. Gradients never completely die for negative values.',
    evalFn: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3)))),
    derivativeFn: (x) => {
      const c = Math.sqrt(2 / Math.PI);
      const inner = c * (x + 0.044715 * Math.pow(x, 3));
      const tanhVal = Math.tanh(inner);
      const sech2 = 1 - tanhVal * tanhVal;
      return 0.5 * (1 + tanhVal) + 0.5 * x * sech2 * c * (1 + 3 * 0.044715 * x * x);
    },
    color: '#2563eb' // blue
  },
  {
    id: 'relu',
    name: 'ReLU (Rectified Linear Unit)',
    formula: 'ReLU(x) = max(0, x)',
    usedIn: 'Original 2017 Transformer, CNNs',
    description: 'Fast to compute, but suffers from the "Dying ReLU" problem: any negative input yields gradient 0.',
    evalFn: (x) => Math.max(0, x),
    derivativeFn: (x) => (x > 0 ? 1 : 0),
    color: '#dc2626' // red
  },
  {
    id: 'sigmoid',
    name: 'Sigmoid',
    formula: 'σ(x) = 1 / (1 + e⁻ˣ)',
    usedIn: 'Binary classification, LSTM gates',
    description: 'Classic S-curve squashes to (0, 1). Vanishing gradient problem: max derivative is only 0.25!',
    evalFn: (x) => 1 / (1 + Math.exp(-x)),
    derivativeFn: (x) => {
      const s = 1 / (1 + Math.exp(-x));
      return s * (1 - s);
    },
    color: '#059669' // emerald
  }
];

export const InteractiveActivationLab: React.FC = () => {
  const [selectedId, setSelectedId] = useState('swiglu');
  const [testValueX, setTestValueX] = useState(1.2);

  const activeActivation = ACTIVATIONS.find(a => a.id === selectedId) || ACTIVATIONS[0];

  const yVal = activeActivation.evalFn(testValueX);
  const dyVal = activeActivation.derivativeFn(testValueX);

  // Generate SVG path points from x = -4 to +4
  const points: { x: number; y: number }[] = [];
  const svgWidth = 460;
  const svgHeight = 220;
  const xMin = -4;
  const xMax = 4;
  const yMin = -2;
  const yMax = 4;

  const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * svgWidth;
  const toSvgY = (y: number) => svgHeight - ((y - yMin) / (yMax - yMin)) * svgHeight;

  for (let x = xMin; x <= xMax; x += 0.1) {
    points.push({ x: toSvgX(x), y: toSvgY(activeActivation.evalFn(x)) });
  }

  const pathD = points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-lg text-blue-700">Non-Linearity Lab</span>
            <span className="text-slate-300">·</span>
            <h3 className="font-sans font-bold text-slate-900 text-base">Activation Function & Gradient Inspector</h3>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Discover why modern LLMs transitioned from ReLU to GELU and SwiGLU.
          </p>
        </div>

        {/* Function selector pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {ACTIVATIONS.map((act) => (
            <button
              key={act.id}
              onClick={() => setSelectedId(act.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedId === act.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {act.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Curve & Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 items-center">
        {/* SVG Curve Plot */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
            {/* Grid Lines */}
            <line x1={0} y1={toSvgY(0)} x2={svgWidth} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={svgHeight} stroke="#94a3b8" strokeWidth="1.5" />

            {/* Labels */}
            <text x={svgWidth - 25} y={toSvgY(0) - 6} fill="#64748b" className="text-[10px] font-mono">x</text>
            <text x={toSvgX(0) + 6} y={15} fill="#64748b" className="text-[10px] font-mono">f(x)</text>

            {/* Function Curve */}
            <path d={pathD} fill="none" stroke={activeActivation.color} strokeWidth="3" />

            {/* Current Point Indicator */}
            <circle
              cx={toSvgX(testValueX)}
              cy={toSvgY(yVal)}
              r="6"
              fill={activeActivation.color}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>

          <div className="text-[11px] text-center text-slate-500 font-mono mt-1">
            x ∈ [-4, +4] · Interactive Point at x = {testValueX.toFixed(2)}
          </div>
        </div>

        {/* Live Evaluation & Explanations */}
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Target Equation</div>
            <div className="font-mono text-xs font-bold text-slate-800 bg-white p-2 rounded border border-slate-200">
              {activeActivation.formula}
            </div>
          </div>

          {/* Slider for X value */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700 font-sans">Input Value (x):</span>
              <span className="font-mono font-bold text-blue-700">{testValueX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
              step="0.1"
              value={testValueX}
              onChange={(e) => setTestValueX(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Value and Derivative Output Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-sans">Output f(x):</div>
              <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {yVal.toFixed(3)}
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-500 font-sans">Derivative f'(x) [Gradient]:</div>
              <div className="text-lg font-bold font-mono text-amber-700 tabular-nums">
                {dyVal.toFixed(3)}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-sans leading-relaxed">
            <span className="font-bold text-slate-800">Used In: </span>
            <span className="text-slate-700 font-medium">{activeActivation.usedIn}</span>
            <p className="mt-1 text-slate-500">{activeActivation.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
