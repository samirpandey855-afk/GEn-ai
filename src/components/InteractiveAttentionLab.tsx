import React, { useState, useMemo } from 'react';

const PRESET_SENTENCES = [
  {
    label: 'Coreference Resolution (Winograd)',
    sentence: 'The animal did not cross the street because it was too tired',
    focusTokenIndex: 8 // "it"
  },
  {
    label: 'Knowledge Association',
    sentence: 'Paris is the historic and beautiful capital of France',
    focusTokenIndex: 6 // "capital"
  },
  {
    label: 'Transformer Core',
    sentence: 'Attention mechanisms allow words to gather contextual information',
    focusTokenIndex: 0 // "Attention"
  }
];

export const InteractiveAttentionLab: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [activeSentence, setActiveSentence] = useState(PRESET_SENTENCES[0].sentence);
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(PRESET_SENTENCES[0].focusTokenIndex);
  const [useScaling, setUseScaling] = useState(true);
  const [useCausalMask, setUseCausalMask] = useState(false);
  const [headIndex, setHeadIndex] = useState(0); // Head 0: Syntactic, Head 1: Semantic, Head 2: Positional

  const tokens = useMemo(() => {
    return activeSentence.trim().split(/\s+/).slice(0, 10);
  }, [activeSentence]);

  // Ensure selectedQueryIndex is valid for current tokens
  const safeQueryIdx = Math.min(selectedQueryIndex, Math.max(0, tokens.length - 1));

  // Compute simulated Q, K vectors and dot-product attention
  const { scores, attentionWeights } = useMemo(() => {
    const N = tokens.length;
    const d_k = 64;
    const scaleFactor = useScaling ? Math.sqrt(d_k) : 1.0;

    // Deterministic pseudo-embeddings based on token content and head behavior
    const computedScores: number[][] = [];
    const weights: number[][] = [];

    for (let i = 0; i < N; i++) {
      const rowScores: number[] = [];
      const qToken = tokens[i].toLowerCase();

      for (let j = 0; j < N; j++) {
        const kToken = tokens[j].toLowerCase();
        let baseAffinity = 0;

        // Simulate realistic multi-head behaviors:
        if (headIndex === 0) {
          // Head 0: Coreference & Semantic Association
          if (qToken === 'it' && (kToken === 'animal' || kToken === 'street')) {
            baseAffinity = kToken === 'animal' ? 3.8 : 1.2;
          } else if (qToken === 'capital' && (kToken === 'paris' || kToken === 'france')) {
            baseAffinity = 3.5;
          } else if (i === j) {
            baseAffinity = 1.8;
          } else {
            baseAffinity = Math.cos(i - j) * 1.2;
          }
        } else if (headIndex === 1) {
          // Head 1: Syntactic & Local Bigram relations
          const distance = Math.abs(i - j);
          baseAffinity = distance === 1 ? 3.2 : distance === 2 ? 1.5 : -0.8;
        } else {
          // Head 2: Distant / Sentence start grounding (Attention sink token)
          baseAffinity = j === 0 ? 3.0 : Math.sin(i * j) * 1.5;
        }

        // Add variance to simulate unnormalized dot product growth
        const rawDot = baseAffinity * (useScaling ? 2.5 : 9.0);
        let finalScore = rawDot / scaleFactor;

        // Apply causal mask if enabled
        if (useCausalMask && j > i) {
          finalScore = -1e9; // -Infinity
        }

        rowScores.push(finalScore);
      }
      computedScores.push(rowScores);

      // Compute row-wise Softmax
      const maxScore = Math.max(...rowScores);
      const expScores = rowScores.map(s => (s <= -1e8 ? 0 : Math.exp(s - maxScore)));
      const sumExp = expScores.reduce((acc, v) => acc + v, 0);
      const rowWeights = expScores.map(v => (sumExp > 0 ? v / sumExp : 0));
      weights.push(rowWeights);
    }

    return { scores: computedScores, attentionWeights: weights };
  }, [tokens, headIndex, useScaling, useCausalMask]);

  const currentWeights = attentionWeights[safeQueryIdx] || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-lg text-amber-700">Lab Experiment</span>
            <span className="text-slate-300">·</span>
            <h3 className="font-sans font-bold text-slate-900 text-base">Scaled Dot-Product Attention Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Select a token to see how Queries and Keys compute attention weights across the entire sequence.
          </p>
        </div>

        {/* Preset selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 font-sans">Preset:</label>
          <select
            value={selectedPresetIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedPresetIndex(idx);
              setActiveSentence(PRESET_SENTENCES[idx].sentence);
              setSelectedQueryIndex(PRESET_SENTENCES[idx].focusTokenIndex);
            }}
            className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {PRESET_SENTENCES.map((p, i) => (
              <option key={i} value={i}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
        {/* Head Selector */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-slate-700">Attention Head:</span>
          <div className="flex items-center gap-1">
            {['Head 1 (Semantic)', 'Head 2 (Adjacent)', 'Head 3 (Global)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setHeadIndex(idx)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  headIndex === idx ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                H{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Scaling Factor Toggle */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-slate-700">Scale by 1/√d_k:</span>
          <button
            onClick={() => setUseScaling(!useScaling)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              useScaling ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {useScaling ? 'Enabled (Stable)' : 'Disabled (Saturated)'}
          </button>
        </div>

        {/* Causal Mask Toggle */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-slate-700">Causal Mask (Decoder):</span>
          <button
            onClick={() => setUseCausalMask(!useCausalMask)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              useCausalMask ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {useCausalMask ? 'Causal On (j ≤ i)' : 'Bidirectional (Full)'}
          </button>
        </div>
      </div>

      {/* Token Click Selection Strip */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
          Click any word below to make it the active <span className="text-blue-600 font-mono">Query Token</span>:
        </label>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, idx) => {
            const isSelected = idx === safeQueryIdx;
            const weightOnTarget = currentWeights[idx] || 0;
            return (
              <button
                key={idx}
                onClick={() => setSelectedQueryIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{token}</span>
                <span className="text-[10px] opacity-80">[{idx}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Attention Distribution for active Query Token */}
      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-slate-700 font-sans">
            How token <span className="font-mono text-blue-700 font-bold px-1.5 py-0.5 bg-blue-100 rounded">"{tokens[safeQueryIdx]}"</span> distributes attention across all Keys:
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Formula: Softmax( (Q_{safeQueryIdx} · Kᵀ) / √64 )
          </div>
        </div>

        <div className="space-y-2">
          {tokens.map((token, keyIdx) => {
            const weight = currentWeights[keyIdx] || 0;
            const percentage = (weight * 100).toFixed(1);
            const isSelf = keyIdx === safeQueryIdx;
            const isMasked = useCausalMask && keyIdx > safeQueryIdx;

            return (
              <div key={keyIdx} className="flex items-center gap-3 text-xs font-mono">
                <div className={`w-28 text-right truncate font-medium ${isSelf ? 'text-blue-700 font-bold' : isMasked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {token} <span className="text-[10px] text-slate-400">[{keyIdx}]</span>
                </div>

                <div className="flex-1 bg-slate-200 h-5 rounded-md overflow-hidden relative">
                  {isMasked ? (
                    <div className="h-full bg-slate-300 flex items-center px-2 text-[10px] text-slate-500 font-sans">
                      Masked (-∞)
                    </div>
                  ) : (
                    <div
                      className={`h-full transition-all duration-300 rounded-md flex items-center justify-end px-2 text-[10px] font-bold ${
                        weight > 0.35 ? 'bg-amber-500 text-white' : weight > 0.15 ? 'bg-blue-500 text-white' : 'bg-blue-300 text-slate-800'
                      }`}
                      style={{ width: `${Math.max(weight * 100, 2)}%` }}
                    >
                      {percentage}%
                    </div>
                  )}
                </div>

                <div className="w-12 text-right text-[11px] text-slate-500 tabular-nums">
                  {isMasked ? '0.0%' : `${percentage}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Handwritten commentary note */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs font-handwriting text-amber-900 flex items-start gap-2">
        <span className="font-bold text-amber-700 text-base leading-none">✎</span>
        <div>
          <span className="font-bold">Key Intuition: </span>
          {useScaling
            ? 'With 1/√d_k scaling enabled, the Softmax distribution is balanced and informative. Gradients can flow smoothly backward to update both the Query and Key projection weights.'
            : 'Notice what happened when scaling was disabled! The largest dot product dominates completely (~98%), driving other weights to ~0%. In backpropagation, this causes vanishing gradients!'}
        </div>
      </div>
    </div>
  );
};
