import React, { useState, useMemo } from 'react';

interface CandidateToken {
  token: string;
  rawLogit: number;
  explanation: string;
}

const PROMPT_PRESETS: { prompt: string; candidates: CandidateToken[] }[] = [
  {
    prompt: 'The foundational mechanism of modern generative models is',
    candidates: [
      { token: ' self-attention', rawLogit: 6.8, explanation: 'Primary technical term in transformers' },
      { token: ' attention', rawLogit: 6.2, explanation: 'General mechanism from 2017 paper' },
      { token: ' deep', rawLogit: 4.1, explanation: 'Generic descriptor' },
      { token: ' the', rawLogit: 3.5, explanation: 'Grammatical determiner' },
      { token: ' diffusion', rawLogit: 3.2, explanation: 'Alternative generative paradigm' },
      { token: ' backpropagation', rawLogit: 2.4, explanation: 'Underlying training algorithm' },
      { token: ' creativity', rawLogit: 1.1, explanation: 'Abstract concept' },
      { token: ' completely', rawLogit: 0.2, explanation: 'Low-probability adverb' }
    ]
  },
  {
    prompt: 'To reduce hallucinations in enterprise LLM workflows, engineers implement',
    candidates: [
      { token: ' RAG', rawLogit: 7.2, explanation: 'Retrieval-Augmented Generation' },
      { token: ' retrieval', rawLogit: 6.1, explanation: 'Information retrieval step' },
      { token: ' guardrails', rawLogit: 5.5, explanation: 'Safety and verification filters' },
      { token: ' fine-tuning', rawLogit: 4.0, explanation: 'Supervised domain adaptation' },
      { token: ' prompt', rawLogit: 3.8, explanation: 'Prompt engineering & framing' },
      { token: ' chain-of-thought', rawLogit: 3.2, explanation: 'Step-by-step reasoning' },
      { token: ' strict', rawLogit: 2.1, explanation: 'Adjective' },
      { token: ' magic', rawLogit: -1.5, explanation: 'Nonsense / outlier token' }
    ]
  },
  {
    prompt: 'During transformer training, the AdamW optimizer minimizes',
    candidates: [
      { token: ' cross-entropy', rawLogit: 7.0, explanation: 'Loss function for token prediction' },
      { token: ' loss', rawLogit: 6.4, explanation: 'General objective error' },
      { token: ' error', rawLogit: 4.5, explanation: 'Synonym for objective loss' },
      { token: ' perplexity', rawLogit: 3.9, explanation: 'Language model evaluation metric' },
      { token: ' gradients', rawLogit: 2.2, explanation: 'Common misconception (it follows gradients)' },
      { token: ' compute', rawLogit: 1.5, explanation: 'Resource constraint' },
      { token: ' weights', rawLogit: 0.8, explanation: 'Weight decay minimizes weight norms' },
      { token: ' latency', rawLogit: -0.5, explanation: 'Hardware metric, not training loss' }
    ]
  }
];

export const InteractiveSamplerLab: React.FC = () => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(5);
  const [sampledTokens, setSampledTokens] = useState<string[]>([]);
  const [lastSampledToken, setLastSampledToken] = useState<string | null>(null);

  const currentPreset = PROMPT_PRESETS[selectedPresetIdx];

  // Compute probabilities with Temperature, Top-K, and Top-P
  const computedDistribution = useMemo(() => {
    const raw = currentPreset.candidates;

    // 1. Temperature scaling
    const temp = Math.max(temperature, 0.01);
    const scaled = raw.map(c => ({
      ...c,
      scaledLogit: c.rawLogit / temp
    }));

    // 2. Sort descending
    const sorted = [...scaled].sort((a, b) => b.scaledLogit - a.scaledLogit);

    // 3. Top-K cutoff
    const topKCandidates = sorted.slice(0, topK);

    // 4. Compute Softmax over top-K
    const maxLogit = Math.max(...topKCandidates.map(c => c.scaledLogit));
    const exps = topKCandidates.map(c => Math.exp(c.scaledLogit - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0);

    const withProbs = topKCandidates.map((c, i) => ({
      ...c,
      prob: exps[i] / sumExps
    }));

    // 5. Top-P (Nucleus) filter
    let cumulative = 0;
    const finalTokens = withProbs.map((c) => {
      const isIncluded = cumulative < topP || cumulative === 0;
      cumulative += c.prob;
      return {
        ...c,
        inNucleus: isIncluded,
        cumProb: cumulative
      };
    });

    // Re-normalize active tokens in nucleus
    const nucleusTokens = finalTokens.filter(t => t.inNucleus);
    const nucleusSum = nucleusTokens.reduce((a, b) => a + b.prob, 0);

    return finalTokens.map(t => ({
      ...t,
      finalProb: t.inNucleus ? (t.prob / nucleusSum) : 0
    }));
  }, [currentPreset, temperature, topK, topP]);

  // Roll the dice (multinomial sample)
  const handleSampleToken = () => {
    const activeTokens = computedDistribution.filter(t => t.inNucleus && t.finalProb > 0);
    if (activeTokens.length === 0) return;

    const r = Math.random();
    let accumulated = 0;
    let picked = activeTokens[0];

    for (const t of activeTokens) {
      accumulated += t.finalProb;
      if (r <= accumulated) {
        picked = t;
        break;
      }
    }

    setLastSampledToken(picked.token);
    setSampledTokens(prev => [...prev, picked.token]);
  };

  const handleReset = () => {
    setSampledTokens([]);
    setLastSampledToken(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-lg text-emerald-700">Interactive Lab</span>
            <span className="text-slate-300">·</span>
            <h3 className="font-sans font-bold text-slate-900 text-base">Next-Token Sampling & Probability Reshaper</h3>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Adjust Temperature, Top-K, and Top-P to see how the probability distribution dynamically transforms.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 font-sans">Prompt:</label>
          <select
            value={selectedPresetIdx}
            onChange={(e) => {
              setSelectedPresetIdx(Number(e.target.value));
              setSampledTokens([]);
              setLastSampledToken(null);
            }}
            className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {PROMPT_PRESETS.map((p, i) => (
              <option key={i} value={i}>Preset {i + 1}: {p.prompt.slice(0, 30)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompt Display and Generated Sequence */}
      <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
        <span className="text-slate-500 font-sans font-semibold">Prompt Context: </span>
        <span className="text-slate-800 font-medium">"{currentPreset.prompt}"</span>
        {sampledTokens.length > 0 && (
          <span className="text-emerald-700 font-bold bg-emerald-100 px-1 py-0.5 rounded ml-1">
            {sampledTokens.join('')}
          </span>
        )}
      </div>

      {/* Interactive Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-100 mb-5">
        {/* Temperature Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-slate-700">Temperature (T):</span>
            <span className="font-mono font-bold text-blue-700">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.8"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0.05 (Greedy)</span>
            <span>0.7 (Balanced)</span>
            <span>1.8 (Creative/Wild)</span>
          </div>
        </div>

        {/* Top-P (Nucleus) Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-slate-700">Top-P (Nucleus):</span>
            <span className="font-mono font-bold text-emerald-700">{topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0.20 (Strict)</span>
            <span>0.90 (Standard)</span>
            <span>1.00 (All)</span>
          </div>
        </div>

        {/* Top-K Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-slate-700">Top-K:</span>
            <span className="font-mono font-bold text-amber-700">{topK} tokens</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1 (Only Best)</span>
            <span>5 (Balanced)</span>
            <span>8 (Wide Pool)</span>
          </div>
        </div>
      </div>

      {/* Candidate Tokens Probability Distribution */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Candidate Next Tokens</span>
          <span className="font-mono text-slate-500 text-[11px]">Sampling Probability (%)</span>
        </div>

        {computedDistribution.map((item, idx) => {
          const pct = (item.finalProb * 100).toFixed(1);
          const isSampled = lastSampledToken === item.token;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2 rounded-lg text-xs font-mono transition-all ${
                isSampled
                  ? 'bg-emerald-50 border border-emerald-300 ring-1 ring-emerald-400'
                  : item.inNucleus
                  ? 'bg-white border border-slate-200'
                  : 'bg-slate-50 border border-slate-100 opacity-40'
              }`}
            >
              {/* Token Name */}
              <div className="w-36 flex items-center gap-1.5 truncate">
                <span className={`px-1.5 py-0.5 rounded font-bold ${item.inNucleus ? 'bg-slate-100 text-slate-900' : 'bg-slate-200 text-slate-400 line-through'}`}>
                  "{item.token}"
                </span>
                {isSampled && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1 rounded font-sans font-bold">PICKED</span>
                )}
              </div>

              {/* Bar visualization */}
              <div className="flex-1 bg-slate-100 h-5 rounded-md overflow-hidden relative">
                {item.inNucleus ? (
                  <div
                    className={`h-full transition-all duration-200 rounded-md flex items-center justify-end px-2 text-[10px] font-bold text-white ${
                      item.finalProb > 0.5 ? 'bg-emerald-600' : item.finalProb > 0.2 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.max(item.finalProb * 100, 2)}%` }}
                  >
                    {parseFloat(pct) > 6 ? `${pct}%` : ''}
                  </div>
                ) : (
                  <div className="h-full bg-slate-200 flex items-center px-2 text-[10px] text-slate-400 font-sans italic">
                    Cut by Top-P / Top-K
                  </div>
                )}
              </div>

              {/* Percentage & Raw Logit */}
              <div className="w-16 text-right tabular-nums text-slate-600 text-[11px]">
                {item.inNucleus ? `${pct}%` : '0.0%'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sampling Action Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSampleToken}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 font-sans"
          >
            <span>🎲</span>
            <span>Sample Next Token</span>
          </button>
          {sampledTokens.length > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors font-sans"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-handwriting">
          Tip: Set Temp to 0.05 to see pure deterministic Greedy Search!
        </div>
      </div>
    </div>
  );
};
