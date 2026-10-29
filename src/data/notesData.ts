export interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  handwrittenCallout?: string;
  coreConcepts: string[];
  explanation: string[];
  keyFormula?: {
    latex: string;
    description: string;
    variables: { symbol: string; meaning: string }[];
  };
  sketchType?: 'neural-net' | 'vectors' | 'attention' | 'transformer' | 'causal-mask' | 'kv-cache' | 'moe' | 'rag' | 'diffusion' | 'lora';
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  interviewTrap?: string;
  realWorldApp: string;
}

export interface ModuleData {
  id: string;
  moduleNumber: string;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  badgeLabel: string;
  coverImage?: string;
  summary: string;
  sections: SectionItem[];
}

export const GEN_AI_MODULES: ModuleData[] = [
  {
    id: 'foundations-ml-math',
    moduleNumber: '01',
    title: 'Foundations of Machine Learning & AI Mathematics',
    tagline: 'From Linear Algebra & Vectors to Neural Networks and Backpropagation',
    estimatedMinutes: 25,
    badgeLabel: 'Core Foundations',
    summary: 'Before understanding Generative AI, you must build rock-solid intuition around high-dimensional vector spaces, loss surfaces, gradient descent, and how multi-layer perceptrons learn through the chain rule of calculus.',
    sections: [
      {
        id: 'vector-spaces-embeddings',
        title: 'Vectors, Tensors & High-Dimensional Geometry',
        subtitle: 'How machine learning represents words, concepts, and images as coordinates',
        handwrittenCallout: 'Key Insight: In deep learning, "meaning" is a direction in a high-dimensional space! Similar concepts point in similar directions.',
        coreConcepts: [
          'Scalars (rank 0), Vectors (rank 1), Matrices (rank 2), and Tensors (rank N)',
          'Dot Product as a measure of directional alignment',
          'Cosine Similarity: Normalizing magnitude to measure pure conceptual angle',
          'Euclidean (L2) vs Manhattan (L1) distances in embedding spaces',
          'Curse of Dimensionality: Why 4096-dimensional vectors behave counterintuitively'
        ],
        explanation: [
          'A vector in Generative AI is a list of real numbers representing coordinates in a latent semantic space. For example, modern LLMs like Llama 3 use d_model = 4096 dimensions.',
          'The Dot Product between vectors u and v computes the sum of their element-wise products. If u and v have unit length, the dot product equals the cosine of the angle between them.',
          'Cosine similarity ranges from -1 (exact opposite) to 0 (orthogonal / completely unrelated) to +1 (identical direction). In vector search (RAG) and self-attention, dot products measure semantic affinity.'
        ],
        keyFormula: {
          latex: 'CosineSim(u, v) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum_{i=1}^d u_i^2} \\sqrt{\\sum_{i=1}^d v_i^2}}',
          description: 'Calculates the cosine of the angle between two embedding vectors regardless of their magnitudes.',
          variables: [
            { symbol: 'u, v', meaning: 'High-dimensional embeddings (e.g., text or image vectors)' },
            { symbol: 'u · v', meaning: 'Dot product (inner product)' },
            { symbol: '||u||', meaning: 'L2 Euclidean norm (magnitude of vector u)' }
          ]
        },
        sketchType: 'vectors',
        codeSnippet: {
          language: 'python',
          title: 'Cosine Similarity & Dot Product in PyTorch',
          code: `import torch
import torch.nn.functional as F

# Two 4-dimensional embeddings (e.g. "king", "queen")
u = torch.tensor([0.45, 0.82, -0.12, 0.33])
v = torch.tensor([0.42, 0.85, -0.10, 0.30])

# Dot product
dot_prod = torch.dot(u, v)

# Cosine similarity (normalized dot product)
cos_sim = F.cosine_similarity(u.unsqueeze(0), v.unsqueeze(0))
print(f"Cosine Similarity: {cos_sim.item():.4f}") # ~0.9982 (High affinity)`
        },
        interviewTrap: 'Candidates often confuse Dot Product with Cosine Similarity. Remember: if embeddings are not normalized (unit length), a very long vector can yield a higher dot product than a closely aligned short vector! Always normalize if comparing direction.',
        realWorldApp: 'Vector databases (Pinecone, Chroma, Qdrant, Milvus) compute billions of cosine distances per second to retrieve relevant documents for enterprise RAG and semantic search.'
      },
      {
        id: 'loss-functions-gradient-descent',
        title: 'Loss Functions, Gradients & Optimization',
        subtitle: 'The mathematical engine that guides weights downhill to intelligence',
        handwrittenCallout: 'Remember: Gradient ∇L points in the direction of steepest ASCENT. To minimize loss, we step in the negative direction (-η∇L).',
        coreConcepts: [
          'Objective Function (Loss L): Measuring the error between prediction and ground truth',
          'Cross-Entropy Loss: The ubiquitous loss function for language models predicting next tokens',
          'Mean Squared Error (MSE): Predicting continuous values (regression & diffusion noise)',
          'Stochastic Gradient Descent (SGD) with Momentum',
          'Adam & AdamW Optimizers: Adaptive learning rates with decoupled weight decay'
        ],
        explanation: [
          'Deep learning is optimization: finding weights W that minimize expected loss across a dataset.',
          'For classification and next-token prediction, we use Cross-Entropy Loss: L = -log(P(target_token)). If the model assigns probability 1.0 to the correct next word, loss is 0; if it assigns probability 0.001, loss is -log(0.001) ≈ 6.9.',
          'AdamW (Loshchilov & Hutter) is the standard optimizer for LLMs and Transformers because it maintains per-parameter running estimates of first (mean) and second (uncentered variance) moments while applying weight decay properly.'
        ],
        keyFormula: {
          latex: '\\mathcal{L}_{\\text{CrossEntropy}} = - \\sum_{k=1}^{V} y_k \\log(\\hat{y}_k) = - \\log(\\hat{y}_{\\text{target}})',
          description: 'Categorical Cross-Entropy Loss for next-token prediction over vocabulary size V.',
          variables: [
            { symbol: 'V', meaning: 'Vocabulary size (e.g., 32,000 to 128,000 tokens)' },
            { symbol: 'y_k', meaning: 'One-hot ground truth vector (1 for correct token, 0 otherwise)' },
            { symbol: 'ŷ_k', meaning: 'Softmax probability assigned by model to token k' }
          ]
        },
        sketchType: 'neural-net',
        codeSnippet: {
          language: 'python',
          title: 'Cross-Entropy Loss in Language Modeling',
          code: `import torch
import torch.nn as nn

# Model outputs raw logits for 4 vocabulary tokens
logits = torch.tensor([[2.5, -1.2, 0.4, 4.8]]) # shape: (batch=1, vocab=4)
target = torch.tensor([3]) # Ground-truth token index is 3

criterion = nn.CrossEntropyLoss()
loss = criterion(logits, target)
print(f"Loss: {loss.item():.4f}") # Softmax + Negative Log Likelihood`
        },
        interviewTrap: 'Why AdamW over standard Adam with L2 regularization? In Adam, standard L2 penalty gets distorted by the adaptive second-moment gradient scaling. AdamW decouples weight decay directly from gradient updates.',
        realWorldApp: 'Every state-of-the-art LLM (Llama 3, Mistral, GPT-4, Claude) is trained with AdamW with cosine learning rate decay and warmup.'
      },
      {
        id: 'neural-networks-backpropagation',
        title: 'Multi-Layer Perceptrons & Backpropagation',
        subtitle: 'Activation functions, the Chain Rule, and how deep representations form',
        handwrittenCallout: 'Intuition: Without non-linear activation functions (ReLU, GELU, SwiGLU), stacking 100 neural layers is mathematically identical to a single linear matrix multiplication!',
        coreConcepts: [
          'Perceptron: z = W · x + b, activated by σ(z)',
          'Activation Functions: Sigmoid, Tanh, ReLU, Leaky ReLU, GELU, SwiGLU',
          'The Chain Rule: dL/dw = (dL/dy) * (dy/dz) * (dz/dw)',
          'Vanishing & Exploding Gradients in deep stacks',
          'Layer Normalization vs Batch Normalization'
        ],
        explanation: [
          'A neural network layer applies an affine linear transformation followed by an element-wise non-linear activation function. Without non-linearity, multiple layers collapse into W_final = W_3 * W_2 * W_1, restricting the model to linear decision boundaries.',
          'Modern LLMs use GELU (Gaussian Error Linear Unit) or SwiGLU (Swish Gated Linear Unit) rather than standard ReLU. SwiGLU introduces a bilinear gating mechanism that allows the model to control information flow dynamically.',
          'Backpropagation executes reverse-mode automatic differentiation: it caches intermediate activations during forward pass, then calculates gradients from output to input via vector-Jacobian products.'
        ],
        keyFormula: {
          latex: '\\text{SwiGLU}(x) = \\left( x W_{\\text{gate}} \\cdot \\sigma(x W_{\\text{gate}}) \\right) \\odot (x W_{\\text{up}})',
          description: 'SwiGLU activation function used in modern LLMs (Llama, PaLM, Mistral).',
          variables: [
            { symbol: 'x', meaning: 'Input hidden state vector' },
            { symbol: 'W_gate, W_up', meaning: 'Weight matrices for gating and projection branches' },
            { symbol: 'σ', meaning: 'Sigmoid activation (Swish = x · σ(x))' },
            { symbol: '⊙', meaning: 'Hadamard (element-wise) multiplication' }
          ]
        },
        sketchType: 'neural-net',
        codeSnippet: {
          language: 'python',
          title: 'SwiGLU Feed-Forward Block in PyTorch',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SwiGLUFFN(nn.Module):
    def __init__(self, dim, hidden_dim):
        super().__init__()
        self.w_gate = nn.Linear(dim, hidden_dim, bias=False)
        self.w_up = nn.Linear(dim, hidden_dim, bias=False)
        self.w_down = nn.Linear(hidden_dim, dim, bias=False)

    def forward(self, x):
        # Swish(x * W_gate) * (x * W_up)
        gate = F.silu(self.w_gate(x))
        up = self.w_up(x)
        return self.w_down(gate * up)`
        },
        interviewTrap: 'Why does LayerNorm work better than BatchNorm for transformers and LLMs? BatchNorm computes statistics across the mini-batch dimension, making it sensitive to variable sequence lengths and small batch sizes during inference. LayerNorm computes mean and variance across the feature dimension independently for each token!',
        realWorldApp: 'SwiGLU feed-forward networks form 2/3 of all parameters in modern LLMs such as Llama 3 8B/70B and Mistral 7B.'
      }
    ]
  },
  {
    id: 'nlp-representation-evolution',
    moduleNumber: '02',
    title: 'NLP Evolution & Representation Learning',
    tagline: 'From Tokenization and Word2Vec to RNNs, LSTMs, and Seq2Seq',
    estimatedMinutes: 20,
    badgeLabel: 'Sequential AI',
    summary: 'Trace the evolutionary lineage of natural language processing: subword tokenization, continuous word embeddings, recurrent loops, and the seq2seq bottleneck that sparked the attention revolution.',
    sections: [
      {
        id: 'tokenization-subwords',
        title: 'Tokenization: Translating Text to Machine Tokens',
        subtitle: 'BPE (Byte Pair Encoding), WordPiece, and Byte-level BPE',
        handwrittenCallout: 'Rules of Thumb: 1 token ≈ 0.75 English words (or 100 tokens ≈ 75 words). Code and non-Latin alphabets consume significantly more tokens per word!',
        coreConcepts: [
          'Character vs Word vs Subword Tokenization',
          'Byte Pair Encoding (BPE) algorithm: Iteratively merging most frequent adjacent pairs',
          'Vocabulary Size tradeoffs: Small vocab (few tokens, long sequences) vs Large vocab (big embedding matrix, short sequences)',
          'Handling unknown tokens: Byte-level fallback prevents out-of-vocabulary (OOV) crashes',
          'Tokenization pitfalls: Spacing (" apple" vs "apple"), numbers, and whitespace sensitivity'
        ],
        explanation: [
          'LLMs do not read characters or words directly; they read discrete integer IDs corresponding to subword tokens in a pre-constructed vocabulary (typically 32k to 128k entries).',
          'BPE starts with all individual characters/bytes as vocabulary items. It scans training corpora and iteratively merges the most frequent adjacent character pairs into new tokens until the target vocabulary size is reached.',
          'GPT-4 and Llama 3 use Byte-level BPE (tiktoken) with a ~100k-128k vocabulary. Because every raw byte is represented, the model can process any unicode string, code, or binary without ever encountering an unknown token error.'
        ],
        keyFormula: {
          latex: '\\text{Vocabulary Expansion: } (c_i, c_j) \\leftarrow \\arg\\max \\text{Freq}(c_i, c_j) \\implies \\text{New Token } c_{new}',
          description: 'Byte Pair Encoding merge step: iteratively finding the most frequent bigram to add to vocabulary.',
          variables: [
            { symbol: 'c_i, c_j', meaning: 'Adjacent subword tokens in corpus' },
            { symbol: 'Freq', meaning: 'Occurrence frequency across training dataset' },
            { symbol: 'c_new', meaning: 'Newly formed merged token' }
          ]
        },
        codeSnippet: {
          language: 'python',
          title: 'Understanding Token IDs with Tiktoken',
          code: `import tiktoken

enc = tiktoken.get_encoding("cl100k_base") # GPT-4 tokenizer
text = "Generative AI is revolutionary!"
tokens = enc.encode(text)

print("Token IDs:", tokens)
# [41434, 15592, 374, 34483, 0]
for t in tokens:
    print(f"ID {t:5d} -> '{enc.decode([t])}'")`
        },
        interviewTrap: 'Why did older LLMs fail at basic math like counting letters ("How many \'r\'s in strawberry?") or reversing words? Because to the model, "strawberry" is tokenized as ["straw", "berry"]! The model never sees the individual letters unless prompted to decompose them.',
        realWorldApp: 'Proper tokenizer choices directly affect inference speed and pricing: a 128k vocabulary tokenizes multilingual text with 30-40% fewer tokens, cutting inference latency and API cost.'
      },
      {
        id: 'embeddings-word2vec',
        title: 'Word Embeddings: Word2Vec, GloVe & Vector Math',
        subtitle: 'Distributed representations: capturing semantics through context',
        handwrittenCallout: 'Iconic Vector Math: Vector("King") - Vector("Man") + Vector("Woman") ≈ Vector("Queen")! The geometric space captures relational semantics.',
        coreConcepts: [
          'Distributional Hypothesis: "You shall know a word by the company it keeps" (J.R. Firth)',
          'One-Hot Encoding limitations: Sparse, orthogonal vectors with zero semantic distance',
          'Word2Vec architectures: Skip-Gram (predict context from center) vs CBOW (predict center from context)',
          'Negative Sampling: Efficient training trick replacing expensive softmax over entire dictionary',
          'Static Embeddings limitation: Polysemy ("bank" of a river vs financial "bank" share one vector)'
        ],
        explanation: [
          'Before Word2Vec (Mikolov et al., 2013), words were represented as one-hot vectors of size |V|. In one-hot space, all words are equidistant: distance("cat", "dog") == distance("cat", "airplane").',
          'Word2Vec maps each word to a dense d-dimensional vector (e.g. d=300). Words appearing in similar contexts receive similar coordinates.',
          'However, static embeddings have a fatal flaw: each word has exactly one vector. In "he sat on the river bank" and "he deposited money in the bank", the word "bank" receives the exact same representation. This limitation led directly to contextual representations like ELMo and Transformers.'
        ],
        keyFormula: {
          latex: '\\mathcal{L}_{\\text{SkipGram}} = \\sum_{t=1}^T \\sum_{-c \\le j \\le c, j \\neq 0} \\log P(w_{t+j} \\mid w_t)',
          description: 'Skip-gram objective: maximize log probability of predicting surrounding context words given center word w_t.',
          variables: [
            { symbol: 'w_t', meaning: 'Center target word' },
            { symbol: 'w_{t+j}', meaning: 'Context word within sliding window c' },
            { symbol: 'c', meaning: 'Context window radius' }
          ]
        },
        sketchType: 'vectors',
        interviewTrap: 'What is the fundamental difference between Word2Vec and Transformer embeddings? Word2Vec is static (context-independent lookup table). Transformer embeddings are dynamic (contextual): the output embedding for a token is modulated by every other token in the sequence via self-attention.',
        realWorldApp: 'Vector search indexes and early semantic recommendation engines were built on Word2Vec and GloVe; modern systems use Transformer-based embedding models like text-embedding-3 or BGE.'
      },
      {
        id: 'rnns-lstm-seq2seq',
        title: 'RNNs, LSTMs & The Seq2Seq Bottleneck',
        subtitle: 'Sequential memory, vanishing gradients, and the emergence of Attention',
        handwrittenCallout: 'The Fatal Flaw of RNNs: Sequential dependency prevented parallel computation on GPUs! To compute step t=1000, you had to run t=1 through 999 sequentially.',
        coreConcepts: [
          'Recurrent Neural Networks (RNN): Passing hidden state h_t = tanh(W_h * h_{t-1} + W_x * x_t)',
          'Vanishing Gradient Problem: Repeated matrix multiplications cause gradients to decay exponentially',
          'LSTM (Long Short-Term Memory): Cell state c_t governed by Forget, Input, and Output gates',
          'Encoder-Decoder Seq2Seq: Compressing an entire sentence into a single fixed-size vector bottleneck',
          'Bahdanau / Luong Additive Attention: Allowing the decoder to look back at all encoder hidden states'
        ],
        explanation: [
          'RNNs process tokens sequentially, maintaining a hidden state vector h_t that acts as the model\'s memory. However, backpropagating through time (BPTT) requires multiplying by weight matrix W at every step, causing gradients to explode or vanish for long sequences.',
          'Hochreiter & Schmidhuber introduced LSTMs (1997), adding a linear cell state highway c_t protected by 3 multiplicative sigmoid gates. This enabled learning long-range dependencies across dozens of tokens.',
          'In 2014, Sutskever et al. built Seq2Seq for machine translation. The encoder compressed an entire 50-word sentence into one final vector h_T. This created an information bottleneck! In 2014, Bahdanau et al. introduced Attention: instead of forcing the encoder to compress everything into one vector, let the decoder take a weighted sum of ALL encoder states.'
        ],
        keyFormula: {
          latex: '\\text{Attention Weight } \\alpha_{t, i} = \\frac{\\exp(e_{t, i})}{\\sum_{k} \\exp(e_{t, k})}, \\quad \\text{Context Vector } c_t = \\sum_{i=1}^T \\alpha_{t, i} h_i',
          description: 'Bahdanau Attention: Soft alignment weights between decoder step t and all encoder hidden states h_i.',
          variables: [
            { symbol: 'α_{t,i}', meaning: 'Attention weight indicating how much decoder step t focuses on encoder word i' },
            { symbol: 'h_i', meaning: 'Encoder hidden state vector for token i' },
            { symbol: 'c_t', meaning: 'Dynamic context vector fed to decoder' }
          ]
        },
        sketchType: 'neural-net',
        interviewTrap: 'Why did Transformers replace LSTMs if LSTMs could already do attention? Two reasons: 1) LSTMs cannot be parallelized across sequence length during training (O(N) sequential steps). 2) Even with attention, recurrence imposes an inductive bias that struggles past a few hundred steps. Transformers process all N tokens in parallel!',
        realWorldApp: 'Early Google Translate (2016) used GNMT (stacked LSTMs with attention). In 2017, the Transformer paper replaced the LSTM backbone entirely with self-attention.'
      }
    ]
  },
  {
    id: 'transformer-architecture-deep-dive',
    moduleNumber: '03',
    title: 'The Transformer Architecture (Deep Dive)',
    tagline: 'Inside "Attention Is All You Need": Q, K, V, MHA, Positional Encodings & Normalization',
    estimatedMinutes: 30,
    badgeLabel: 'Core Architecture',
    coverImage: '/src/assets/images/transformer_architecture_visual_1793263449434.jpg',
    summary: 'The Transformer paper (Vaswani et al., 2017) revolutionized modern AI. Understand the mathematical mechanics of Queries, Keys, Values, Scaled Dot-Product Attention, Multi-Head projections, Positional Encodings (RoPE), and the structural difference between Encoders and Decoders.',
    sections: [
      {
        id: 'scaled-dot-product-attention',
        title: 'Scaled Dot-Product Attention: Q, K, V Intuition',
        subtitle: 'The filing cabinet analogy: Querying the database of tokens',
        handwrittenCallout: 'Database Metaphor: \n• Query (Q) = What I am searching for\n• Key (K) = Title tag / label of each item in storage\n• Value (V) = The actual information content retrieved',
        coreConcepts: [
          'Linear Projections: X * W_Q, X * W_K, X * W_V',
          'Dot Product Q · K^T: Pairwise token relevance scores',
          'Scaling factor 1 / sqrt(d_k): Preventing vanishing gradients in softmax',
          'Softmax: Converting raw scores into a valid probability distribution (sums to 1)',
          'Weighted Sum: Multiplying attention probabilities by Value matrix V',
          'Quadratic Complexity O(N^2) in sequence length N'
        ],
        explanation: [
          'Every token in a sequence is transformed into three vectors via learned linear projection matrices: Query Q, Key K, and Value V. For an input X of shape (N, d_model), Q = X W_Q, K = X W_K, V = X W_V.',
          'The attention score between token i and token j is computed as the dot product Q_i · K_j^T. When two tokens have high compatibility, their dot product is large.',
          'Why scale by sqrt(d_k)? As dimension d_k increases, the variance of the dot product grows proportionally to d_k. Large values push the Softmax function into regions with near-zero gradients (saturation). Dividing by sqrt(d_k) preserves unit variance and stable gradient flow!',
          'Finally, Softmax(Q K^T / sqrt(d_k)) produces an N × N attention matrix where row i sums to 1. Multiplying this matrix by V produces the contextualized output vectors.'
        ],
        keyFormula: {
          latex: '\\text{Attention}(Q, K, V) = \\text{Softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
          description: 'Scaled Dot-Product Attention: The foundational equation of modern Generative AI.',
          variables: [
            { symbol: 'Q', meaning: 'Query matrix (shape: N × d_k)' },
            { symbol: 'K', meaning: 'Key matrix (shape: M × d_k)' },
            { symbol: 'V', meaning: 'Value matrix (shape: M × d_v)' },
            { symbol: 'd_k', meaning: 'Dimension of keys/queries (e.g. 64 or 128)' },
            { symbol: 'Softmax', meaning: 'Row-wise exponential normalization' }
          ]
        },
        sketchType: 'attention',
        codeSnippet: {
          language: 'python',
          title: 'Scaled Dot-Product Attention in Pure PyTorch',
          code: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    # 1. Compute pairwise attention scores (N x N)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    # 2. Apply optional causal or padding mask
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
        
    # 3. Softmax across key dimension
    attn_weights = F.softmax(scores, dim=-1)
    
    # 4. Weighted combination of values
    output = torch.matmul(attn_weights, V)
    return output, attn_weights`
        },
        interviewTrap: 'Why does self-attention have O(N^2) complexity? Because computing Q K^T compares every token against every other token in the sequence of length N, creating an N × N matrix. For 4k tokens, that is 16 million pairs; for 128k tokens, it is 16.3 billion pairs! This motivated FlashAttention and linear attention variants.',
        realWorldApp: 'Every token generated in ChatGPT, Claude, and Gemini executes thousands of scaled dot-product operations per layer across tens of layers.'
      },
      {
        id: 'multi-head-attention-pos-encoding',
        title: 'Multi-Head Attention (MHA) & Positional Embeddings',
        subtitle: 'Subspace specialization and how models perceive sequence order',
        handwrittenCallout: 'Why Multi-Head? One head can track grammatical subject-verb agreement, another tracks pronoun references, and another tracks punctuation rhythm simultaneously!',
        coreConcepts: [
          'Multi-Head Attention: Splitting d_model into h heads of dimension d_k = d_model / h',
          'Concatenation and Output Projection W_O',
          'Permutation Invariance of Attention: Why transformers require positional encoding',
          'Sinusoidal Positional Encoding (original 2017 paper)',
          'Rotary Position Embedding (RoPE): Rotating vectors in complex 2D planes',
          'ALiBi (Attention with Linear Biases): Linear penalties for token distance'
        ],
        explanation: [
          'Instead of performing a single attention calculation with d_model dimensions, Multi-Head Attention linearly projects queries, keys, and values h times with different learned weights. The outputs are concatenated and multiplied by W_O.',
          'Crucially, attention is permutation-invariant: if you shuffle the input words, the computed attention values are identical! In natural language, "dog bites man" is completely different from "man bites dog". Therefore, position information must be explicitly injected.',
          'While the 2017 Transformer used static sine and cosine waves, modern LLMs (Llama, Mistral, Gemma) use RoPE (Rotary Position Embeddings). RoPE rotates Q and K in 2D coordinate pairs by angles proportional to their token position. The dot product of rotated vectors naturally encodes their relative distance (m - n)!'
        ],
        keyFormula: {
          latex: '\\text{MHA}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O, \\quad \\text{where } \\text{head}_i = \\text{Attn}(Q W_i^Q, K W_i^K, V W_i^V)',
          description: 'Multi-Head Attention: Projecting into h subspaces, calculating attention in parallel, concatenating and projecting.',
          variables: [
            { symbol: 'h', meaning: 'Number of attention heads (e.g. 32 in Llama 3 8B)' },
            { symbol: 'W_i^Q, W_i^K, W_i^V', meaning: 'Per-head projection matrices' },
            { symbol: 'W^O', meaning: 'Final output projection matrix (h·d_v × d_model)' }
          ]
        },
        sketchType: 'transformer',
        interviewTrap: 'Why does RoPE generalize to long contexts better than absolute learned embeddings? Absolute positional embeddings assign a learned vector to index 0, 1, 2... if a sequence during inference is longer than training, unseen indices have no trained weights! RoPE encodes relative angular displacement, which naturally extrapolates with techniques like YaRN or NTK-aware scaling.',
        realWorldApp: 'RoPE allows modern LLMs to scale from 4k contexts to 128k or 1 million tokens without re-architecting the embedding layer.'
      },
      {
        id: 'encoder-vs-decoder-architectures',
        title: 'Architectural Taxonomy: Encoder-Only vs Decoder-Only vs Enc-Dec',
        subtitle: 'BERT vs GPT vs T5: Which architecture wins for Generative AI and why?',
        handwrittenCallout: 'Industry Consensus: Decoder-only (GPT style) has won modern Generative AI! Why? Unified auto-regressive pre-training naturally unlocks zero-shot reasoning and in-context learning.',
        coreConcepts: [
          'Encoder-Only (BERT, RoBERTa): Bidirectional attention, masked language modeling (MLM), optimal for classification and embeddings',
          'Decoder-Only (GPT, Llama, Mistral, Claude): Causal (masked) attention, auto-regressive next-token prediction, the standard for GenAI',
          'Encoder-Decoder (T5, BART, Whisper): Cross-attention connects encoder representations to decoder, great for translation and audio transcription',
          'Causal Masking: Lower-triangular mask preventing tokens from "cheating" by peeking into future tokens',
          'Pre-LN vs Post-LN: Why Pre-LayerNorm stabilized deep transformer training'
        ],
        explanation: [
          'In Encoder-only models, every token attends to all tokens before and after it. This makes it ideal for classification, NER, and dense semantic embeddings (e.g., text-embedding-3), but inefficient for open-ended generation.',
          'In Decoder-only models, a causal mask sets the upper-right triangle of the attention score matrix to -infinity, which becomes 0 after softmax. Token i can only attend to tokens j <= i. This matches human text generation: writing one word after another.',
          'Earlier transformers placed LayerNorm after the residual addition (Post-LN), requiring delicate learning-rate warmup. Modern architectures place LayerNorm before the attention and FFN blocks (Pre-LN) or use RMSNorm, enabling stable training of 100+ billion parameter models.'
        ],
        keyFormula: {
          latex: 'M_{i, j} = \\begin{cases} 0 & \\text{if } i \\ge j \\text{ (Allowed)} \\\\ -\\infty & \\text{if } i < j \\text{ (Masked Future)} \\end{cases}',
          description: 'Causal Mask Matrix: Applied to attention logits before Softmax to enforce auto-regressive causality.',
          variables: [
            { symbol: 'i', meaning: 'Current token index (query position)' },
            { symbol: 'j', meaning: 'Target token index (key position)' },
            { symbol: 'M_{i,j}', meaning: 'Mask entry added to attention score before Softmax' }
          ]
        },
        sketchType: 'causal-mask',
        interviewTrap: 'Why does cross-attention appear in Encoder-Decoder models (like Whisper and T5) but NOT in Decoder-only models (like Llama)? In Decoder-only models, Q, K, and V all come from the same sequence (Self-Attention). In Encoder-Decoder models, Queries come from the decoder, but Keys and Values come from the encoder outputs (Cross-Attention)!',
        realWorldApp: 'OpenAI GPT-4, Google Gemini, Anthropic Claude, and Meta Llama are all Decoder-only autoregressive transformers.'
      }
    ]
  },
  {
    id: 'llms-training-inference',
    moduleNumber: '04',
    title: 'Large Language Models (LLMs): Training, Alignment & Inference',
    tagline: 'Pre-training, Scaling Laws, RLHF, DPO, KV Caching, and Sampling Techniques',
    estimatedMinutes: 30,
    badgeLabel: 'Production LLMs',
    summary: 'Master the end-to-end lifecycle of modern LLMs: compute-optimal pre-training datasets, alignment pipelines (SFT, RLHF, DPO), inference acceleration with KV Caching & FlashAttention, and stochastic decoding sampling.',
    sections: [
      {
        id: 'pretraining-scaling-laws',
        title: 'Pre-Training & Scaling Laws (Chinchilla & Kaplan)',
        subtitle: 'The recipe for world knowledge: Trillions of tokens and optimal compute allocation',
        handwrittenCallout: 'Chinchilla Rule of Thumb: For compute-optimal training, dataset tokens D and model parameters N should scale in equal proportions: D ≈ 20 × N tokens!',
        coreConcepts: [
          'Pre-training Objective: Next-Token Prediction on Internet-scale text (Common Crawl, GitHub, Wikipedia, Books, Papers)',
          'Data Filtering & Hygiene: Deduplication (MinHash), quality classifiers, toxic content filtering, synthetic data generation',
          'Kaplan et al. (2020) vs Chinchilla / Hoffmann et al. (2022) Scaling Laws',
          'Power-Law Loss Decay: L(N, D) = (N_c / N)^α_N + (D_c / D)^α_D',
          'Compute budget calculation in FLOPs: C ≈ 6 × N × D'
        ],
        explanation: [
          'Pre-training is where an LLM acquires 98% of its knowledge. The model learns grammar, facts, reasoning patterns, and coding by predicting the next token across 15+ trillion tokens of text.',
          'In 2020, OpenAI\'s Kaplan et al. suggested allocating most compute to growing parameter count N. In 2022, DeepMind\'s Chinchilla paper proved that earlier models (like GPT-3 175B) were severely undertrained! For optimal compute efficiency, for every 1 parameter, you need at least 20 tokens.',
          'Modern open-source models train far beyond the Chinchilla optimal point (e.g., Llama 3 8B was trained on 15 trillion tokens, ~1875 tokens per parameter!). Why? Because training longer on smaller models yields cheaper inference for millions of downstream users!'
        ],
        keyFormula: {
          latex: 'C_{\\text{FLOPs}} \\approx 6 \\cdot N \\cdot D, \\quad \\text{where } N = \\text{parameters}, \\, D = \\text{training tokens}',
          description: 'Approximate floating-point operations (FLOPs) required to train a transformer autoregressively.',
          variables: [
            { symbol: 'C', meaning: 'Total compute budget in FLOPs' },
            { symbol: 'N', meaning: 'Number of active model parameters' },
            { symbol: 'D', meaning: 'Number of training tokens consumed' },
            { symbol: '6', meaning: 'Constant factor: ~2 FLOPs per parameter forward pass + ~4 FLOPs backward pass' }
          ]
        },
        codeSnippet: {
          language: 'python',
          title: 'Compute Budget & Training Cost Estimator',
          code: `def estimate_training_flops(params_billions, tokens_trillions):
    N = params_billions * 1e9
    D = tokens_trillions * 1e12
    flops = 6 * N * D
    # An NVIDIA H100 GPU delivers ~1000 TFLOPs (1e15) BF16 with 40% MFU
    gpu_seconds = flops / (400e12)
    gpu_hours = gpu_seconds / 3600
    return flops, gpu_hours

flops, hours = estimate_training_flops(params_billions=8, tokens_trillions=15)
print(f"Llama 3 8B Training Compute: {flops:.2e} FLOPs (~{hours:,.0f} H100 GPU Hours)")`
        },
        interviewTrap: 'Why does inference compute cost differ from training compute? Training compute is 6 * N * D (forward + backward pass). Inference compute is only 2 * N * D (only the forward pass, no backward pass or optimizer state needed)!',
        realWorldApp: 'Companies use Chinchilla scaling laws to budget multi-million dollar cluster allocations on thousands of H100 GPUs before starting pre-training runs.'
      },
      {
        id: 'alignment-sft-rlhf-dpo',
        title: 'Post-Training Alignment: SFT, RLHF & DPO',
        subtitle: 'Transforming a wild text completer into a helpful, truthful, instruction-following agent',
        handwrittenCallout: 'The Base Model Problem: Prompt: "Write a poem about dogs." \nBase model might output: "Write a poem about cats. Write a poem about birds." (It just completes text!). Alignment teaches it to answer instructions!',
        coreConcepts: [
          'Supervised Fine-Tuning (SFT): High-quality (Prompt, Response) instruction datasets',
          'RLHF (Reinforcement Learning from Human Feedback): Reward Modeling + PPO (Proximal Policy Optimization)',
          'KL-Divergence Penalty: Preventing the aligned model from drifting too far from the base model',
          'DPO (Direct Preference Optimization): Eliminating the separate reward model by reparameterizing the reward implicitly',
          'KTO (Kahneman-Tversky Optimization) & RLAIF (RL from AI Feedback / Constitutional AI)'
        ],
        explanation: [
          'A base LLM is just a predictive autocomplete engine. If you ask it "How do I fix a leaky faucet?", it might just produce another plumbing forum question. Post-training alignment shapes the model into an interactive assistant.',
          'Step 1: Supervised Fine-Tuning (SFT). The model trains on 100k-500k human-curated high-quality instruction demonstrations.',
          'Step 2: Preference Optimization. In classical RLHF, humans rank two responses (Winner y_w vs Loser y_l). A separate Reward Model is trained on these rankings, and PPO optimizes the policy against this reward model while penalizing KL divergence from the base model.',
          'In 2023, Rafailov et al. introduced DPO (Direct Preference Optimization). DPO shows that the optimal policy under the RLHF objective can be expressed in closed form! This allows training directly on preference pairs with a simple cross-entropy-like loss, removing the unstable reward model and PPO loop entirely.'
        ],
        keyFormula: {
          latex: '\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right) \\right]',
          description: 'DPO Loss: Maximizes implicit reward difference between preferred response y_w and dispreferred response y_l.',
          variables: [
            { symbol: 'y_w, y_l', meaning: 'Winning (preferred) and losing (dispreferred) responses' },
            { symbol: 'π_θ', meaning: 'The policy model being trained' },
            { symbol: 'π_ref', meaning: 'Frozen reference SFT model' },
            { symbol: 'β', meaning: 'Hyperparameter controlling KL penalty strength (typically 0.1 to 0.5)' }
          ]
        },
        interviewTrap: 'What happens if you set β too high or too low in DPO? If β is too high, the model is penalized excessively for departing from π_ref and fails to improve on preferences. If β is too small, the model collapses into degenerate repetitive text or hallucinations by ignoring the reference distribution.',
        realWorldApp: 'Almost all modern open weights (Llama 3, Mistral, Zephyr) use DPO or iterative DPO in place of complex PPO pipelines.'
      },
      {
        id: 'kv-cache-flashattention-serving',
        title: 'KV Cache, Memory Footprint & FlashAttention',
        subtitle: 'Why inference is memory-bandwidth bound and how modern engines achieve 100+ tokens/sec',
        handwrittenCallout: 'Key Discovery: During autoregressive generation, past tokens never change! Computing their Keys and Values on every step wastes compute. Store them in the KV Cache!',
        coreConcepts: [
          'Prefill Phase (Prompt Processing - Compute Bound) vs Decode Phase (Token Generation - Memory Bound)',
          'KV Cache: Storing past Key and Value tensors in GPU High Bandwidth Memory (HBM)',
          'KV Cache Memory Formula: 2 × 2 × n_layers × n_heads × d_head × batch_size × seq_length bytes',
          'Multi-Query Attention (MQA) & Grouped-Query Attention (GQA): Sharing Key/Value heads to reduce KV cache size by 8x',
          'FlashAttention (Dao et al.): Tiling attention computation in fast GPU SRAM to avoid slow HBM read/write bottlenecks',
          'PagedAttention (vLLM): Eliminating memory fragmentation by managing KV cache like virtual memory pages'
        ],
        explanation: [
          'When generating token 101, token 1 to 100 are already fixed. If we recomputed their Key and Value vectors at every step, latency would scale as O(N^2). By caching K and V in memory, generating a single token requires only O(N) operations.',
          'However, the KV Cache is massive! For a 70B model with 128k context and batch size 4, the KV cache can consume over 100 GB of GPU RAM—often more than the model weights themselves!',
          'To solve this, modern models use Grouped-Query Attention (GQA). Instead of each Query head having its own Key/Value head (MHA), 8 Query heads share 1 Key/Value head. This slashes KV cache memory by 8x with virtually zero loss in quality.',
          'FlashAttention solves a hardware bottleneck: GPU compute (FLOPs) is 100x faster than memory access (HBM bandwidth). FlashAttention splits Q, K, and V into small tiles that fit into fast on-chip SRAM, computing softmax online without materializing the full N × N attention matrix into memory.'
        ],
        keyFormula: {
          latex: '\\text{KV Cache Size (bytes)} = 2 \\times 2 \\times L \\times n_{\\text{KV-heads}} \\times d_{\\text{head}} \\times B \\times S',
          description: 'Memory footprint required to hold the Key-Value cache in GPU memory.',
          variables: [
            { symbol: '2 (first)', meaning: 'Two tensors: one for Keys, one for Values' },
            { symbol: '2 (second)', meaning: 'Bytes per element (16-bit FP16 / BF16 precision)' },
            { symbol: 'L', meaning: 'Number of transformer layers' },
            { symbol: 'n_{KV-heads}', meaning: 'Number of Key-Value heads (equals n_heads in MHA, but 1/8 in GQA)' },
            { symbol: 'B, S', meaning: 'Batch size B and sequence length S' }
          ]
        },
        sketchType: 'kv-cache',
        codeSnippet: {
          language: 'python',
          title: 'KV Cache GPU Memory Calculation in GB',
          code: `def calc_kv_cache_gb(layers, kv_heads, head_dim, seq_len, batch_size=1, dtype_bytes=2):
    # 2 (Key + Value) * dtype_bytes * layers * kv_heads * head_dim * seq_len * batch_size
    bytes_total = 2 * dtype_bytes * layers * kv_heads * head_dim * seq_len * batch_size
    return bytes_total / (1024 ** 3)

# Llama 3 70B: 80 layers, 8 KV heads (GQA), head_dim 128, 128k context
gb_128k = calc_kv_cache_gb(80, 8, 128, 128_000)
print(f"Llama 3 70B KV Cache for 128k context: {gb_128k:.2f} GB per request!")`
        },
        interviewTrap: 'Why is LLM generation during the decode phase memory-bandwidth bound rather than compute bound? Because for each single token generated, the GPU must stream the ENTIRE model weights (e.g. 140 GB for a 70B model) from HBM into the compute cores just to perform a single matrix-vector multiplication!',
        realWorldApp: 'vLLM, TensorRT-LLM, and TGI use PagedAttention and GQA to achieve 10x-20x higher server throughput and serve thousands of concurrent users.'
      },
      {
        id: 'sampling-decoding-strategies',
        title: 'Sampling & Decoding: Temperature, Top-K, Top-P & Min-P',
        subtitle: 'Controlling creativity, determinism, and hallucination during text generation',
        handwrittenCallout: 'Cheat Sheet: \n• Temp = 0.0: Greedy argmax (Deterministic, best for code/math)\n• Temp = 0.7: Balanced creativity (Storytelling, chat)\n• Temp > 1.2: Chaotic and unhinged (High risk of gibberish)',
        coreConcepts: [
          'Greedy Decoding: Always picking token with highest probability (argmax)',
          'Temperature Scaling: Rescaling logits by z_i / T before Softmax',
          'Top-K Filtering: Truncating the probability distribution to top K candidate tokens',
          'Top-P (Nucleus) Sampling: Dynamically keeping the smallest set of tokens whose cumulative probability exceeds P',
          'Min-P Sampling: Filtering out tokens with probability below (p_base * max_prob)',
          'Repetition Penalty: Penalizing logits of previously generated tokens to prevent infinite loops'
        ],
        explanation: [
          'An LLM outputs raw scores (logits) z for every word in the vocabulary. Before choosing the next token, these logits are normalized via Softmax.',
          'Temperature T controls the "sharpness" of the probability distribution. As T -> 0, the distribution approaches a delta function at the maximum logit (Greedy Decoding). As T -> infinity, the distribution flattens into a uniform random distribution.',
          'Top-P (Nucleus Sampling) adjusts the candidate pool dynamically. If the model is confident ("The capital of France is [Paris 99%]"), the candidate pool shrinks to 1 token. If the context is open-ended, the pool expands to 50 tokens. This avoids the static cutoff flaw of Top-K.'
        ],
        keyFormula: {
          latex: 'P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_{j \\in V_{\\text{filtered}}} \\exp(z_j / T)}, \\quad \\text{where } \\sum_{k=1}^K P(w_{(k)}) \\ge P_{\\text{nucleus}}',
          description: 'Temperature-scaled Nucleus (Top-P) probability distribution formula.',
          variables: [
            { symbol: 'z_i', meaning: 'Raw output logit for token i' },
            { symbol: 'T', meaning: 'Sampling temperature parameter (0 < T <= 2)' },
            { symbol: 'P_nucleus', meaning: 'Cumulative probability threshold (typically 0.9 or 0.95)' }
          ]
        },
        codeSnippet: {
          language: 'python',
          title: 'Top-P and Temperature Sampler Implementation',
          code: `import torch
import torch.nn.functional as F

def sample_next_token(logits, temperature=0.7, top_p=0.9):
    # 1. Scale by temperature
    scaled_logits = logits / max(temperature, 1e-5)
    probs = F.softmax(scaled_logits, dim=-1)
    
    # 2. Sort probabilities descending
    sorted_probs, sorted_indices = torch.sort(probs, descending=True)
    cumulative_probs = torch.cumsum(sorted_probs, dim=-1)
    
    # 3. Mask out tokens past cumulative threshold top_p
    sorted_indices_to_remove = cumulative_probs > top_p
    # Shift right to keep first token above threshold
    sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
    sorted_indices_to_remove[..., 0] = 0
    
    # 4. Zero out filtered probabilities and re-normalize
    sorted_probs[sorted_indices_to_remove] = 0.0
    sorted_probs /= sorted_probs.sum(dim=-1, keepdim=True)
    
    # 5. Multinomial draw
    next_token_sorted_idx = torch.multinomial(sorted_probs, num_samples=1)
    next_token_id = torch.gather(sorted_indices, -1, next_token_sorted_idx)
    return next_token_id.item()`
        },
        interviewTrap: 'Why does setting Temperature = 0 sometimes still produce slight variations on different GPU servers? Because floating point addition in non-deterministic parallel reduction algorithms (e.g. cuBLAS parallel matmuls) can cause tiny 1e-7 differences in logits, which can flip the argmax if two tokens are nearly tied.',
        realWorldApp: 'OpenAI API, Anthropic API, and Ollama expose temperature, top_p, and frequency_penalty as the primary knobs for fine-tuning assistant voice and creativity.'
      }
    ]
  },
  {
    id: 'vision-multimodal-diffusion',
    moduleNumber: '05',
    title: 'Generative AI: Vision, Multimodal & Diffusion Models',
    tagline: 'Latent Diffusion, DiT, Vision Transformers (ViT), and Audio Tokenization',
    estimatedMinutes: 25,
    badgeLabel: 'Multimodal GenAI',
    coverImage: '/src/assets/images/neural_network_sketch_art_1793263448323.jpg',
    summary: 'Generative AI extends far beyond text. Understand how diffusion models destroy and reconstruct images from pure noise, how Vision Transformers tokenize visual pixels, and how modern frontier models unify multimodal tokens.',
    sections: [
      {
        id: 'diffusion-models-ddpm',
        title: 'Diffusion Models: DDPM, Latent Diffusion & Flow Matching',
        subtitle: 'From thermodynamic noise reversal to Stable Diffusion and Flux',
        handwrittenCallout: 'Core Intuition: Training an image generator is like training someone to un-blur a photograph! At step t, given a noisy picture, predict the exact Gaussian noise that was added.',
        coreConcepts: [
          'Forward Process (Noise Injection): q(x_t | x_0) progressively adds Gaussian noise according to variance schedule β_t',
          'Reverse Process (Denoising): p_θ(x_{t-1} | x_t) predicts added noise ε_θ(x_t, t) using a neural network',
          'Latent Diffusion Models (LDM): Compressing pixel space into a latent space via VAE (Variational Autoencoder) to slash compute by 64x',
          'Classifier-Free Guidance (CFG): Guiding generation toward text prompt by interpolating conditioned and unconditioned predictions',
          'Diffusion Transformers (DiT): Replacing the traditional U-Net with a scalable Transformer backbone (Sora, Flux)'
        ],
        explanation: [
          'Diffusion models work on a simple mathematical principle inspired by non-equilibrium thermodynamics. In the forward process, we take an image x_0 and repeatedly add small Gaussian noise until it turns into pure static noise x_T ~ N(0, I).',
          'The neural network (U-Net or DiT) is trained to take the noisy image x_t and the timestep t, and predict the exact noise vector ε that was added. Subtracting the predicted noise steps the image back toward clarity!',
          'Pixel-space diffusion is computationally intractable for 1024x1024 images. Stable Diffusion solved this with Latent Diffusion: an Autoencoder (VAE) compresses the image 8x spatially (1024x1024x3 pixels -> 128x128x4 latent channels). Diffusion occurs entirely in this low-dimensional latent space before being decoded back to pixels.'
        ],
        keyFormula: {
          latex: '\\mathcal{L}_{\\text{Simple}}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| \\epsilon - \\epsilon_\\theta(x_t, t) \\|^2 \\right], \\quad \\text{where } x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon',
          description: 'DDPM Training Objective (Ho et al., 2020): Mean squared error between true Gaussian noise and predicted noise.',
          variables: [
            { symbol: 'x_0', meaning: 'Clean original training image' },
            { symbol: 'ε', meaning: 'Standard Gaussian noise vector N(0, I)' },
            { symbol: 'ε_θ(x_t, t)', meaning: 'Neural network predicting the noise given noisy state x_t and timestep t' },
            { symbol: 'ᾱ_t', meaning: 'Cumulative noise schedule parameter at step t' }
          ]
        },
        sketchType: 'diffusion',
        interviewTrap: 'What is Classifier-Free Guidance (CFG) and what happens when it is too high? CFG formula: ε_guided = ε_uncond + s * (ε_cond - ε_uncond). The scale s amplifies the influence of the text prompt. If s is too high (>15), images burn out with oversaturated neon artifacts and distorted anatomy.',
        realWorldApp: 'Midjourney, Stable Diffusion, Black Forest Labs Flux, and OpenAI DALL-E 3 are built on latent diffusion and DiT architectures.'
      },
      {
        id: 'multimodal-vlm-vit',
        title: 'Vision Transformers (ViT) & Vision-Language Models (VLMs)',
        subtitle: 'Treating an image like a sentence of 16x16 pixel patches',
        handwrittenCallout: 'Brilliant ViT Realization (Dosovitskiy et al.): An image is worth 16x16 words! Chop an image into a grid of patches, linearly project each patch into a vector, and feed it straight into a standard Transformer.',
        coreConcepts: [
          'Patch Extraction: Dividing H × W image into N = (H/P) × (W/P) non-overlapping patches (e.g. 14x14 or 16x16)',
          'Linear Projection: Flattening patches and projecting to dimension d_model',
          'Class Token [CLS] and 1D learnable positional embeddings',
          'CLIP (Contrastive Language-Image Pre-Training): Aligning image and text embeddings via dual encoders',
          'VLM Architectures (LLaVA, Gemini, GPT-4V): Projecting visual tokens into the LLM\'s input embedding space'
        ],
        explanation: [
          'Before 2020, computer vision was dominated by Convolutional Neural Networks (CNNs). ViT proved that standard Transformer architectures with zero convolutional inductive bias can outperform CNNs when trained on large datasets.',
          'To build a Vision-Language Model (VLM) like LLaVA or Gemini, a pre-trained Vision Encoder (like SigLIP or CLIP) converts an image into a sequence of token vectors. A simple projection layer (MLP adapter) maps these vision tokens directly into the LLM\'s embedding space.',
          'The LLM simply concatenates visual tokens and text tokens together: [VIS_1, VIS_2, ... VIS_N, "What", "is", "in", "this", "image", "?"], and generates text autoregressively using its normal self-attention mechanism!'
        ],
        keyFormula: {
          latex: '\\mathbf{z}_0 = [\\mathbf{x}_{\\text{class}}; \\, \\mathbf{x}_p^1 \\mathbf{E}; \\, \\dots; \\, \\mathbf{x}_p^N \\mathbf{E}] + \\mathbf{E}_{\\text{pos}}',
          description: 'Vision Transformer Input Formulation: Prepends [CLS] token, projects flattened image patches, adds positional embeddings.',
          variables: [
            { symbol: 'x_p^i', meaning: 'Flattened 2D image patch i of size P² × C' },
            { symbol: 'E', meaning: 'Learned patch projection matrix' },
            { symbol: 'E_pos', meaning: '1D positional embedding matrix' }
          ]
        },
        interviewTrap: 'Why does native resolution matter in modern VLMs? Early models scaled images to 224x224, destroying small text, OCR details, and tiny chart labels. Modern VLMs (like GPT-4o and Gemini 1.5) use dynamic patching, slicing high-res images into a grid of multiple tiles plus a downsampled thumbnail.',
        realWorldApp: 'Autonomous vehicles, medical scan analysis, UI-to-code generation, and document intelligence OCR systems rely on VLMs.'
      }
    ]
  },
  {
    id: 'advanced-genai-systems-tools',
    moduleNumber: '06',
    title: 'Advanced GenAI Systems: RAG, Agents, LoRA & Quantization',
    tagline: 'Retrieval-Augmented Generation, ReAct Agent Loops, Parameter-Efficient Fine-Tuning, and Serving',
    estimatedMinutes: 30,
    badgeLabel: 'Production Systems',
    coverImage: '/src/assets/images/rag_agent_production_visual_1793263449016.jpg',
    summary: 'Building production AI requires moving beyond standalone models to full systems: orchestrating external memory with RAG, enabling autonomous reasoning with ReAct agents, fine-tuning efficiently with LoRA, and deploying with 4-bit quantization.',
    sections: [
      {
        id: 'rag-deep-dive',
        title: 'Retrieval-Augmented Generation (RAG) Architecture',
        subtitle: 'Overcoming hallucinations and knowledge cutoffs with external vector memory',
        handwrittenCallout: 'RAG In A Nutshell: Open-book exam vs Closed-book exam! A base LLM tries to memorize everything in its weights. RAG gives the LLM the exact relevant textbook pages in its prompt before it answers.',
        coreConcepts: [
          'The 4 RAG Stages: Ingestion, Indexing, Retrieval, and Generation',
          'Document Chunking Strategies: Fixed-size, semantic chunking, recursive character splitting, chunk overlap',
          'Dense Retrieval (Vector Embeddings) vs Sparse Retrieval (BM25 / Keyword Search)',
          'Hybrid Search with Reciprocal Rank Fusion (RRF)',
          'Cross-Encoder Re-Ranking: Scoring top 100 candidates to select the top 5 most relevant passages',
          'Advanced RAG: Self-RAG, Corrective RAG (CRAG), and GraphRAG'
        ],
        explanation: [
          'LLMs suffer from three critical flaws: 1) Hallucinations (confidently generating falsehoods), 2) Fixed knowledge cutoff dates, and 3) Inability to see private enterprise documents. RAG solves all three without retraining the model.',
          'In RAG, source documents (PDFs, docs, databases) are split into chunks (e.g. 500 tokens with 50-token overlap). Each chunk is passed through an embedding model and stored in a vector database.',
          'When a user asks a question, their query is embedded, and the vector DB returns the top-K chunks with highest cosine similarity. An optional Cross-Encoder re-ranks the chunks. The chunks are injected into the system prompt as context, instructing the LLM to ground its answer strictly in the provided text with citations.'
        ],
        keyFormula: {
          latex: '\\text{RRF Score}(d \\in D) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}, \\quad \\text{where } k \\approx 60',
          description: 'Reciprocal Rank Fusion (RRF) for combining Dense Vector Search and BM25 Sparse Keyword Search rankings.',
          variables: [
            { symbol: 'M', meaning: 'Set of retrieval methods (e.g., BM25 keyword rank + Vector similarity rank)' },
            { symbol: 'r_m(d)', meaning: 'Rank position of document d in ranking method m' },
            { symbol: 'k', meaning: 'Smoothing constant to balance top vs lower-ranked documents' }
          ]
        },
        sketchType: 'rag',
        interviewTrap: 'Why does naive RAG fail in production? Common failure modes: 1) Poor chunking splits tables or sentences across chunk boundaries. 2) Embedding models fail at keyword matching (e.g., part numbers, dates, IDs). 3) Context window stuffing causes "Lost in the Middle" syndrome where LLMs ignore chunks placed in the center of long prompts!',
        realWorldApp: 'Enterprise knowledge assistants (Notion AI, Microsoft Copilot, Glean) rely on hybrid RAG architectures with cross-encoder re-ranking.'
      },
      {
        id: 'agents-function-calling',
        title: 'Autonomous AI Agents & Tool Calling (ReAct Loop)',
        subtitle: 'From passive conversationalists to active reasoning problem solvers',
        handwrittenCallout: 'ReAct Cycle: \n1. Thought: What do I need to find out?\n2. Action: Call tool search_flights(origin="SFO", dest="NYC")\n3. Observation: Flights returned\n4. Thought: Evaluate results and choose next step...',
        coreConcepts: [
          'The ReAct Framework (Yao et al., 2022): Synergizing Reasoning and Acting',
          'Function Calling & Tool Use: Model emits structured JSON arguments matching a JSONSchema definition',
          'Planning Strategies: Chain-of-Thought (CoT), Self-Consistency, Tree of Thoughts (ToT)',
          'Model Context Protocol (MCP): Standardized protocol connecting AI agents to tools and data sources',
          'Multi-Agent Architectures: Supervisor patterns, handoffs, and specialized agent teams'
        ],
        explanation: [
          'An LLM alone cannot check today\'s weather, query a live SQL database, or execute Python code. Tool Calling gives the model "hands and eyes".',
          'The developer defines tools as JSON schemas describing function names, descriptions, and parameter types. When prompted, the model does not answer directly; instead, it outputs a special structured token block: {"name": "get_stock_price", "arguments": {"ticker": "AAPL"}}.',
          'The application intercepts this JSON, executes the real Python or API call, and appends the result as an "observation" role message back into the prompt. The model reads the output and continues reasoning until the task is accomplished.'
        ],
        keyFormula: {
          latex: '\\tau = (o_0, a_0, r_0, o_1, a_1, r_1, \\dots, o_T), \\quad a_t = \\text{LLM}(\\text{Prompt}, \\, h_{1:t})',
          description: 'Agent Trajectory: State observation o_t, reasoning thought r_t, and tool action a_t in a sequential Markovian loop.',
          variables: [
            { symbol: 'o_t', meaning: 'Observation from environment or tool execution' },
            { symbol: 'a_t', meaning: 'Action chosen by LLM (tool call or final answer)' },
            { symbol: 'h_{1:t}', meaning: 'History of conversation and tool interactions' }
          ]
        },
        codeSnippet: {
          language: 'json',
          title: 'Tool Definition JSON Schema for Function Calling',
          code: `{
  "name": "query_database",
  "description": "Execute a safe read-only SQL query against the customer database",
  "parameters": {
    "type": "object",
    "properties": {
      "sql_query": {
        "type": "string",
        "description": "PostgreSQL query string"
      }
    },
    "required": ["sql_query"]
  }
}`
        },
        interviewTrap: 'How do you prevent agents from falling into infinite execution loops? Production systems enforce hard execution boundaries: max_iterations (e.g. 8 steps), timeout budgets (e.g. 30s), semantic loop detectors (detecting repeating tool calls with identical arguments), and human-in-the-loop approvals for destructive operations.',
        realWorldApp: 'Coding agents like Cursor, Devin, and GitHub Copilot Workspace, as well as customer workflow automation bots, run on autonomous ReAct tool-calling loops.'
      },
      {
        id: 'peft-lora-quantization',
        title: 'Efficient Adaptation: LoRA, QLoRA & Quantization',
        subtitle: 'Fine-tuning a 70B model on a single consumer GPU with low-rank decomposition',
        handwrittenCallout: 'Mathematical Magic: Weight matrix W (4096×4096 = 16.7M params) decomposed into A (4096×16) and B (16×4096) = only 131k params! A 99.2% reduction in trainable weights!',
        coreConcepts: [
          'Full Fine-Tuning bottleneck: Storing optimizer states (Adam requires 16 bytes per parameter) demands 8x A100 GPUs',
          'Intrinsic Rank Hypothesis: Weight updates during adaptation live on a low-dimensional manifold',
          'LoRA (Low-Rank Adaptation): Freezing original W_0 and adding trainable low-rank matrices ΔW = B × A',
          'Rank r and Alpha scaling factor α / r',
          'Quantization: Mapping 16-bit floating point weights (FP16/BF16) to 8-bit or 4-bit integers (INT8, INT4 / NF4)',
          'QLoRA (Dettmers et al.): Combining 4-bit NormalFloat quantization with paged optimizers and double quantization'
        ],
        explanation: [
          'Full fine-tuning of modern LLMs is expensive: training an 8B model in BF16 requires saving gradients and Adam optimizer states (first and second moments), demanding ~80 GB of VRAM.',
          'LoRA freezes the pre-trained weights W_0. Instead of learning a full ΔW of size d × k, it decomposes ΔW into two tiny matrices: B of size d × r and A of size r × k, where rank r is small (e.g. r=8 or r=16).',
          'During inference, LoRA weights can be folded back into W_0: W_serving = W_0 + (α/r) · (B × A). This means LoRA introduces ZERO additional inference latency!',
          'QLoRA quantizes the base model down to 4-bit NormalFloat (NF4). A 70B parameter model, which normally requires 140 GB of VRAM just to load, fits comfortably in under 40 GB of VRAM, allowing fine-tuning on a single workstation GPU.'
        ],
        keyFormula: {
          latex: 'h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x, \\quad \\text{where } B \\in \\mathbb{R}^{d \\times r}, \\, A \\in \\mathbb{R}^{r \\times k}, \\, r \\ll \\min(d, k)',
          description: 'LoRA Forward Pass: Original frozen weight W_0 plus scaled low-rank update (B · A).',
          variables: [
            { symbol: 'W_0', meaning: 'Pre-trained frozen weight matrix (shape: d × k)' },
            { symbol: 'B', meaning: 'Trainable projection matrix initialized to zeros (shape: d × r)' },
            { symbol: 'A', meaning: 'Trainable projection matrix initialized to Gaussian noise (shape: r × k)' },
            { symbol: 'r', meaning: 'Rank hyperparameter (typically 8, 16, 32, or 64)' },
            { symbol: 'α', meaning: 'Constant scaling factor to stabilize training when changing rank r' }
          ]
        },
        sketchType: 'lora',
        codeSnippet: {
          language: 'python',
          title: 'Configuring LoRA with Hugging Face PEFT',
          code: `from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B")

lora_config = LoraConfig(
    r=16,                         # Low rank dimension
    lora_alpha=32,               # Scaling parameter (alpha / r = 2.0)
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
# trainable params: 6,815,744 || all params: 8,037,076,992 || trainable%: 0.0848%`
        },
        interviewTrap: 'Why initialize matrix B to all zeros and matrix A to random Gaussian noise? Because if B is zero, ΔW = B × A = 0 at the start of training! This ensures the model starts with the exact behavior of the pre-trained base model without any initial perturbation.',
        realWorldApp: 'SaaS platforms host single base models and dynamically swap tiny 50MB LoRA adapter weights in memory per-customer to deliver custom-tuned models cost-effectively.'
      }
    ]
  },
  {
    id: 'real-world-applications-blueprints',
    moduleNumber: '07',
    title: 'Real-World Applications & Industry Blueprints',
    tagline: 'End-to-End Production Systems in Enterprise Search, Code Gen, Healthcare, Finance, and Multimodal',
    estimatedMinutes: 25,
    badgeLabel: 'Production Blueprints',
    summary: 'Bridging theory to production: step-by-step engineering reference architectures for real enterprise systems, evaluation guardrails, hallucination mitigation, latency benchmarks, and cost optimization.',
    sections: [
      {
        id: 'enterprise-rag-blueprint',
        title: 'Blueprint 1: Enterprise Search & Citation-Grounded Assistant',
        subtitle: 'Scalable multi-tenant knowledge retrieval with zero hallucination tolerance',
        handwrittenCallout: 'Golden Production Rule: Never allow the LLM to answer without citing the exact chunk ID and page number. If the context does not contain the answer, instruct it to refuse strictly.',
        coreConcepts: [
          'Document Ingestion Pipeline: OCR extraction, layout-aware PDF parsing (Nougat, Unstructured), table markdown formatting',
          'Role-Based Access Control (RBAC): Enforcing document permission filters directly inside vector queries',
          'Guardrails & Safety: Prompt injection detectors (Llama-Guard, NeMo Guardrails), PII scrubbers',
          'Evaluation Framework: RAG Triad (Context Relevance, Groundedness / Faithfulness, Answer Relevance via Ragas)'
        ],
        explanation: [
          'Enterprise RAG is far more complex than a toy tutorial script. Production documents are dirty: complex PDFs have multi-column layouts, financial tables, headers, and images.',
          'The production pipeline parses PDFs into semantic markdown chunks, preserves table structures, and attaches metadata: {doc_id, access_roles, department, timestamp}.',
          'During retrieval, queries first pass through a PII scrubber and prompt injection filter. The vector database performs hybrid search filtered by the authenticated user\'s access roles (RBAC). The response is evaluated by a real-time hallucination checker before being streamed to the user.'
        ],
        sketchType: 'rag',
        interviewTrap: 'How do you handle security & permission trimming in RAG? Bad approach: retrieve top 10 chunks and filter out unauthorized ones (you might be left with 0 chunks). Good approach: Pre-filtering! Pass user permission tags directly into the vector database metadata query filter so only authorized chunks are searched.',
        realWorldApp: 'Legal discovery platforms (Harvey AI, Casetext), enterprise knowledge bots (Glean, Slack AI), and internal support tools.'
      },
      {
        id: 'codegen-autonomous-developer',
        title: 'Blueprint 2: Autonomous Coding Assistant & Repo Indexer',
        subtitle: 'Context-aware code completion, AST symbol graphs, and test execution loops',
        handwrittenCallout: 'Code Specifics: Standard text embeddings fail on code! Code requires Abstract Syntax Tree (AST) parsing (tree-sitter) to understand class inheritance and function dependencies.',
        coreConcepts: [
          'Tree-sitter AST parsing for granular function, class, and method chunking',
          'Repository-level indexing: Combining symbol reference graphs (LSIF / SCIP) with vector retrieval',
          'Fill-In-The-Middle (FIM) training: <PRE> prefix <SUF> suffix <MID> completion',
          'Execution Sandbox: Running generated code in ephemeral Docker containers to verify unit test passes'
        ],
        explanation: [
          'AI coding assistants like Cursor and GitHub Copilot cannot simply dump random code files into a prompt. They build a semantic map of the codebase.',
          'Using Tree-sitter, the engine extracts definitions, imports, and method signatures. When a developer types inside a function, the assistant uses FIM (Fill-In-The-Middle) prompts so the model considers both the code above the cursor and the code below it.',
          'Autonomous coding agents take this further: they generate a patch, execute the test suite in a sandboxed container, read the compiler or test error trace, and self-correct their own code until all tests pass!'
        ],
        codeSnippet: {
          language: 'python',
          title: 'Fill-In-The-Middle (FIM) Prompt Structure',
          code: `# Standard FIM tokens used by DeepSeek-Coder, StarCoder, CodeLlama
prompt = f"<｜fim begin｜>{prefix_code}<｜fim hole｜>{suffix_code}<｜fim end｜>"
# The model is trained to output the code that fills the hole!`
        },
        interviewTrap: 'Why does Fill-In-The-Middle (FIM) matter over standard autoregressive prompts? Because when writing code, you are almost never at the very end of an empty file! You are modifying code inside an existing function where the subsequent lines, return statements, and closing braces already exist.',
        realWorldApp: 'Cursor IDE, GitHub Copilot, Devin, and Amazon Q Developer.'
      },
      {
        id: 'clinical-healthcare-safety',
        title: 'Blueprint 3: Clinical Health & Diagnostic Summarizer',
        subtitle: 'HIPAA compliance, deterministic grounding, and human-in-the-loop review',
        handwrittenCallout: 'Safety Invariant: AI in healthcare must NEVER diagnose autonomously! It acts exclusively as a clinician copilot to draft summaries and highlight abnormal lab values for physician review.',
        coreConcepts: [
          'Deterministic Entity Extraction: Mapping symptoms and medications to standard ontologies (SNOMED-CT, ICD-10, RxNorm)',
          'EHR (Electronic Health Record) integration via FHIR standard APIs',
          'Red-teaming for clinical hallucinations and drug-interaction contraindications',
          'Audit Trails: Permanent cryptographic logging of all model inputs, outputs, and physician sign-offs'
        ],
        explanation: [
          'In healthcare, hallucinations can be fatal. A model generating clinical documentation cannot invent lab results or miss critical drug allergies.',
          'The architecture uses a dual-verification pipeline: an extraction agent pulls discrete medical entities and cross-references them against an authoritative drug database (RxNorm) to check for interactions. The physician sees a split-screen UI highlighting every generated sentence with its exact origin in the patient\'s audio recording or chart.',
          'The physician must explicitly click "Approve and Sign" before notes are committed to the hospital EHR system.'
        ],
        realWorldApp: 'Nuance DAX Copilot, Abridge, and Epic Systems ambient clinical intelligence.'
      },
      {
        id: 'eval-guardrails-monitoring',
        title: 'Blueprint 4: Production Evaluation, Guardrails & Cost Optimization',
        subtitle: 'Moving from vibe checks to automated benchmarks and cost controls',
        handwrittenCallout: 'Rule of Cost: 1M tokens of GPT-4o costs ~$5. 1M tokens of small 8B model costs ~$0.15. Route easy queries to cheap models and hard reasoning to flagship models!',
        coreConcepts: [
          'Automated LLM-as-a-Judge: Using GPT-4 / Claude to grade model outputs against structured rubrics',
          'Model Routing: Classifying query complexity and dispatching to 8B vs 70B vs Frontier models',
          'Semantic Caching: Storing (Query Embedding, Response) pairs in Redis to answer repeat questions instantly at 0 compute cost',
          'Hallucination Mitigation: Chain-of-Verification (CoVe) and self-consistency voting'
        ],
        explanation: [
          'You cannot improve what you cannot measure. Production teams reject manual "vibe checks" in favor of automated evaluation pipelines.',
          'Frameworks like Ragas evaluate generation across: Faithfulness (is the answer grounded in context?), Answer Relevance (does it answer what was asked?), and Context Precision.',
          'To optimize costs, production gateways deploy Semantic Caching. If a new user query has >0.96 cosine similarity to an earlier query, the cached response is returned immediately in 15ms at zero LLM cost. Smart routers classify queries: simple FAQs go to a fast 8B model ($0.15/M tokens), while complex multi-step reasoning goes to a flagship frontier model.'
        ],
        keyFormula: {
          latex: '\\text{Faithfulness Score} = \\frac{|\\text{Claims in Output verified by Context}|}{|\\text{Total Claims made in Output}|} \\in [0, 1]',
          description: 'Faithfulness metric used in RAG evaluation to detect hallucinations.',
          variables: [
            { symbol: 'Score 1.0', meaning: 'Every single claim in the response is directly supported by retrieved context' },
            { symbol: 'Score < 0.7', meaning: 'High hallucination risk; output must be blocked from delivery to user' }
          ]
        },
        interviewTrap: 'What is the "judge bias" in LLM-as-a-judge evaluation? Models exhibit systematic biases: 1) Verbosity bias (preferring longer, fluffier answers), 2) Self-enhancement bias (favoring text generated by their own model family), and 3) Position bias (favoring response A over response B in pairwise comparisons). Always swap order of responses to mitigate position bias!',
        realWorldApp: 'LangSmith, Braintrust, Arize Phoenix, and W&B Weave monitor millions of daily production LLM traces.'
      }
    ]
  }
];

export interface QuizQuestion {
  id: string;
  module: string;
  question: string;
  options: string[];
  correctIndex: number;
  handwrittenExplanation: string;
  topicTag: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    module: '01 Foundations',
    question: 'Why do deep neural networks require non-linear activation functions (like ReLU or GELU)?',
    options: [
      'To prevent the weights from growing larger than 1.0',
      'Because without non-linearity, multiple layers mathematically collapse into a single linear transformation',
      'To speed up GPU matrix multiplication operations',
      'Because gradient descent cannot compute derivatives on linear functions'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'Spot on! Matrix multiplication is linear: W_2 * (W_1 * x) = (W_2 * W_1) * x = W_combined * x. Stacking 100 linear layers is identical to 1 layer! Non-linearities allow the network to approximate arbitrary complex functions.',
    topicTag: 'Neural Networks'
  },
  {
    id: 'q2',
    module: '03 Transformers',
    question: 'In the Scaled Dot-Product Attention formula Softmax(QK^T / √d_k)V, why do we divide by √d_k?',
    options: [
      'To convert the attention scores into unit vector lengths',
      'To prevent the dot product magnitude from growing large, which pushes Softmax into regions with vanishingly small gradients',
      'To ensure that all matrices have equal row and column dimensions',
      'To account for the number of heads in multi-head attention'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'Exactly! For vectors of dimension d_k, the variance of their dot product is d_k. For large d_k (e.g. 128), values become huge, causing Softmax to output near-zero derivatives (gradient saturation). Scaling by √d_k preserves unit variance!',
    topicTag: 'Attention Mechanics'
  },
  {
    id: 'q3',
    module: '03 Transformers',
    question: 'Why are modern Large Language Models (like Llama 3 and GPT-4) Decoder-only rather than Encoder-Decoder?',
    options: [
      'Because decoders have faster matrix multiplication on Nvidia tensor cores',
      'Autoregressive causal training allows seamless scaling, zero-shot generalization, and unified pre-training on next-token prediction',
      'Encoders are mathematically incapable of processing sequences longer than 512 tokens',
      'Decoder-only models do not require positional encodings'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'Decoders train on every token autoregressively with causal masking. Every token in the training corpus provides training signal, and the same architecture natively supports in-context learning, chat, and reasoning!',
    topicTag: 'Architecture'
  },
  {
    id: 'q4',
    module: '04 LLMs',
    question: 'According to the Chinchilla Scaling Law (Hoffmann et al., 2022), what is the compute-optimal ratio between tokens and parameters?',
    options: [
      'For every 1 parameter, you should train on approximately 20 tokens (Tokens ≈ 20 × Params)',
      'For every 1 token, you should have 10 parameters',
      'Parameter count should increase by 4x for every 2x increase in tokens',
      'Dataset size has no impact on compute-optimal allocation'
    ],
    correctIndex: 0,
    handwrittenExplanation: 'Chinchilla proved that earlier models (like original GPT-3 175B on 300B tokens) were severely undertrained! For compute-optimal allocation, tokens and parameters should scale in equal proportions (D ≈ 20 × N).',
    topicTag: 'Scaling Laws'
  },
  {
    id: 'q5',
    module: '04 LLMs',
    question: 'What is the primary advantage of Grouped-Query Attention (GQA) over standard Multi-Head Attention (MHA)?',
    options: [
      'It increases model parameter count without increasing latency',
      'Multiple Query heads share a single Key and Value head, reducing KV cache memory footprint by ~8x during inference',
      'It eliminates the need for Layer Normalization',
      'It enables the model to bypass the quadratic O(N²) attention complexity'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'Bingo! In generation, the KV cache consumes massive GPU memory. By having 8 query heads share 1 K and V head, the KV cache shrinks by 87.5% with virtually zero loss in model capability!',
    topicTag: 'KV Cache & Serving'
  },
  {
    id: 'q6',
    module: '04 LLMs',
    question: 'How does Direct Preference Optimization (DPO) differ from traditional RLHF with PPO?',
    options: [
      'DPO uses human feedback, whereas RLHF does not',
      'DPO implicitly reparameterizes the reward, optimizing policy directly on preference pairs without training a separate reward model or using PPO',
      'DPO requires 100x more compute than PPO',
      'DPO can only be used on vision models, not text'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'DPO solves RLHF analytically in closed form! It replaces the unstable multi-stage RL pipeline (Reward Model + Actor + Critic + PPO) with a clean, stable binary cross-entropy style loss over win/loss pairs.',
    topicTag: 'Alignment'
  },
  {
    id: 'q7',
    module: '06 Advanced Systems',
    question: 'In LoRA (Low-Rank Adaptation), why is weight update matrix ΔW decomposed into B × A with rank r?',
    options: [
      'To allow weights to be saved as 8-bit integers',
      'Because weight changes during downstream adaptation have a low intrinsic dimension, cutting trainable parameters by over 99%',
      'To prevent the model from learning new facts',
      'Because PyTorch cannot compute gradients on large matrices'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'A full 4096×4096 matrix has 16.7 million weights. Decomposing it into 4096×16 and 16×4096 requires only 131k weights (a 99.2% reduction!), making fine-tuning fast and runnable on consumer hardware.',
    topicTag: 'PEFT & LoRA'
  },
  {
    id: 'q8',
    module: '06 Advanced Systems',
    question: 'In a production RAG system, what role does a Cross-Encoder Re-Ranker play?',
    options: [
      'It translates the query into multiple languages',
      'It performs high-accuracy joint self-attention across the query and top candidate chunks to re-order them before prompt injection',
      'It compresses the PDF into a smaller file size',
      'It updates the vector database index in real time'
    ],
    correctIndex: 1,
    handwrittenExplanation: 'Bi-encoder vector search is fast (cosine similarity of independent vectors), but loses fine interaction details. A Cross-Encoder feeds (Query + Chunk) together through full attention to score true relevance accurately!',
    topicTag: 'RAG Architecture'
  }
];

export interface CheatSheetFormula {
  category: string;
  name: string;
  formula: string;
  quickNote: string;
}

export const CHEAT_SHEET_FORMULAS: CheatSheetFormula[] = [
  {
    category: 'Attention',
    name: 'Scaled Dot-Product Attention',
    formula: 'Attention(Q, K, V) = Softmax(Q · K^T / √d_k) · V',
    quickNote: 'Q, K, V are projections; √d_k prevents vanishing gradients in Softmax.'
  },
  {
    category: 'Attention',
    name: 'Multi-Head Attention',
    formula: 'MHA(Q,K,V) = Concat(head_1, ..., head_h) · W_O',
    quickNote: 'Allows model to jointly attend to information at different representation subspaces.'
  },
  {
    category: 'Architecture',
    name: 'Decoder Parameter Count Rule',
    formula: 'Params ≈ 12 · L · d_model^2',
    quickNote: 'Approximates active parameters for a standard decoder transformer (L layers, d_model width).'
  },
  {
    category: 'Scaling',
    name: 'Training Compute (FLOPs)',
    formula: 'C ≈ 6 · N · D',
    quickNote: '2 FLOPs per parameter forward + 4 FLOPs backward, multiplied by total tokens D.'
  },
  {
    category: 'Scaling',
    name: 'Chinchilla Optimal Budget',
    formula: 'Tokens_optimal ≈ 20 × Parameters',
    quickNote: 'To minimize pre-training loss for a given compute budget, scale tokens and weights equally.'
  },
  {
    category: 'Inference',
    name: 'Model Weights VRAM',
    formula: 'VRAM_weights = Bytes_per_param × N',
    quickNote: 'FP16/BF16: 2 bytes/param (7B = ~14GB). INT8: 1 byte/param (7GB). INT4: 0.5 bytes/param (3.5GB).'
  },
  {
    category: 'Inference',
    name: 'KV Cache Size (bytes)',
    formula: '2 × 2 × L × n_kv_heads × d_head × Batch × SeqLen',
    quickNote: 'Store K and V in FP16 to avoid recomputing past tokens during decode phase.'
  },
  {
    category: 'Fine-Tuning',
    name: 'LoRA Low-Rank Adaptation',
    formula: 'W_new = W_0 + (α / r) · (B × A)',
    quickNote: 'W_0 frozen; B initialized to 0, A to Gaussian. Zero latency overhead when merged into base weights.'
  },
  {
    category: 'Sampling',
    name: 'Temperature Scaling',
    formula: 'P(w_i) = exp(z_i / T) / ∑_j exp(z_j / T)',
    quickNote: 'T→0 is greedy argmax; T=1 is standard distribution; T>1 flattens distribution (more random).'
  },
  {
    category: 'Evaluation',
    name: 'Perplexity (PPL)',
    formula: 'PPL(W) = exp( - 1/N ∑_i log P(w_i | w_<i) ) = exp( CrossEntropyLoss )',
    quickNote: 'Lower is better. Measures how "surprised" the language model is by real text.'
  }
];
