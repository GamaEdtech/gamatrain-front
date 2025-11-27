# Gamatrain VPS LLM Research: Tiny Open-Source Models & Fine-Tuning Pipeline

**Author:** AI Research Team  
**Date:** November 27, 2024  
**Status:** Complete

---

## Executive Summary

### Recommended Solution

After comprehensive research, we recommend the following stack for Gamatrain's VPS-based LLM deployment:

**🏆 Recommended Model: Qwen2-1.5B-Instruct**

**Deployment Stack:**
- **Model:** Qwen2-1.5B-Instruct (quantized to 4-bit GGUF format)
- **Serving:** Ollama (for ease of deployment) or llama.cpp server (for maximum efficiency)
- **Fine-tuning:** QLoRA with Hugging Face Transformers
- **Training Environment:** Google Colab (free T4 GPU)
- **VPS Requirements:** 8GB RAM + 4 vCPU (CPU-only) or 16GB RAM + small GPU

**Key Advantages:**
- ✅ Smallest footprint (1.5B parameters) - runs efficiently on CPU
- ✅ Apache 2.0 license - fully commercial use without restrictions
- ✅ Excellent multilingual support (29+ languages)
- ✅ Strong instruction-following capabilities
- ✅ 128K token context window
- ✅ Competitive performance with much larger models
- ✅ Easy deployment with Ollama or llama.cpp

---

## Model Comparison

### Top 3 Lightweight LLM Candidates

| Feature | **Qwen2-1.5B** ⭐ | Phi-3-Mini (3.8B) | Gemma 2 (2B) |
|---------|------------------|-------------------|--------------|
| **Parameters** | 1.5 billion | 3.8 billion | 2 billion |
| **License** | Apache 2.0 | MIT | Gemma License |
| **Commercial Use** | ✅ Unrestricted | ✅ Unrestricted | ⚠️ Some restrictions |
| **Context Length** | 128K tokens | 128K tokens | 8K tokens |
| **Multilingual** | 29+ languages | Limited | Limited |
| **CPU Performance** | Excellent | Very Good | Good |
| **RAM (4-bit quant)** | ~1.5GB | ~3GB | ~2GB |
| **GGUF Available** | ✅ Yes | ✅ Yes | ✅ Yes |
| **HuggingFace** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Training Data** | High quality | High quality | High quality |
| **Benchmark Score** | Competitive w/ 7B models | Matches 6-9B models | Matches Llama 2 7B |

#### Additional Notable Models

**Llama 3.2 (1B & 3B):**
- License: Llama 3.2 Community License
- Commercial use: ✅ Yes (with 700M MAU limit)
- Very good performance but larger than Qwen2-1.5B
- Strong multimodal capabilities (vision models available)

**Falcon (1B & 3B):**
- License: Apache 2.0
- Good performance but less active community than others

**StableLM (1.6B):**
- License: Apache 2.0
- Solid performance under 2B parameters

---

## VPS Deployment Guide

### Minimal Hardware Requirements

#### Option 1: CPU-Only Deployment (Recommended for Start)
```
Minimum Specs:
- CPU: 4 vCPU cores (AMD/Intel)
- RAM: 8GB (16GB recommended)
- Storage: 20GB NVMe SSD
- OS: Ubuntu 22.04 LTS

Expected Performance:
- Qwen2-1.5B (4-bit): ~8-15 tokens/sec
- Suitable for: Low-to-medium traffic, async processing
```

#### Option 2: Entry-Level GPU Deployment (Better Performance)
```
Recommended Specs:
- GPU: NVIDIA RTX 3060 (12GB VRAM) or RTX 4060 Ti (16GB VRAM)
- CPU: 4-8 vCPU cores
- RAM: 16GB
- Storage: 50GB NVMe SSD

Expected Performance:
- Qwen2-1.5B (4-bit): ~50-80 tokens/sec
- Suitable for: Real-time inference, higher traffic
```

### Deployment Method Comparison

| Method | Ease of Use | Performance | Memory | Best For |
|--------|-------------|-------------|--------|----------|
| **Ollama** ⭐ | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Efficient | **Development, single-user** |
| **llama.cpp server** | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐⭐ Most Efficient | **CPU-only, edge devices** |
| **vLLM** | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Higher | **Production, multi-user, GPU** |
| **TGI (v3.0)** | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Higher | **Enterprise, long prompts, GPU** |

---

## Deployment Instructions

### Option A: Ollama (Recommended for Quick Start)

#### Installation on VPS

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the Qwen2 1.5B model
ollama pull qwen2:1.5b

# Run the server (it will start automatically on port 11434)
ollama serve
```

#### Test the API

```bash
# Test with curl
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2:1.5b",
  "prompt": "Explain quantum computing in simple terms.",
  "stream": false
}'
```

#### OpenAI-Compatible API

```bash
# Ollama provides OpenAI-compatible endpoints
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2:1.5b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

### Option B: llama.cpp Server (Maximum CPU Efficiency)

#### Installation

```bash
# Install dependencies
sudo apt update
sudo apt install build-essential git cmake

# Clone llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Build with optimizations
make -j$(nproc)

# Download Qwen2-1.5B GGUF model
mkdir -p models
wget https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF/resolve/main/qwen2-1_5b-instruct-q4_k_m.gguf \
  -O models/qwen2-1.5b-q4.gguf
```

#### Start the Server

```bash
# Run server with OpenAI-compatible API
./server -m models/qwen2-1.5b-q4.gguf \
  --port 8080 \
  --host 0.0.0.0 \
  -c 4096 \
  -ngl 0
```

#### Test the Server

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is AI?"}],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

---

### Option C: vLLM (For GPU & Production)

#### Installation

```bash
# Install vLLM
pip install vllm

# Start server with Qwen2-1.5B
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2-1.5B-Instruct \
  --dtype auto \
  --api-key your-api-key-here \
  --port 8000
```

#### Features
- PagedAttention for efficient memory
- Continuous batching for high throughput
- OpenAI-compatible API
- Best for: Multi-user production with GPU

---

## Fine-Tuning Pipeline

### QLoRA Fine-Tuning Overview

**QLoRA (Quantized Low-Rank Adaptation)** allows fine-tuning large models efficiently by:
1. Quantizing the base model to 4-bit precision
2. Adding small trainable LoRA adapters
3. Training only the adapters (1-2% of parameters)

**Benefits:**
- 💰 Drastically reduced memory requirements
- ⚡ Faster training
- 🎯 Maintains model quality
- 💾 Small adapter files (~10-50MB)

### Training Hardware Options

| Option | Cost | Speed | Best For |
|--------|------|-------|----------|
| **Google Colab (Free T4)** ⭐ | Free | Moderate | Development, small datasets |
| **Google Colab Pro (A100)** | $10/month | Fast | Larger datasets, faster iteration |
| **Local GPU (RTX 3060+)** | One-time | Fast | Privacy, full control |
| **RunPod/Vast.ai** | $0.20-0.50/hr | Very Fast | Flexible, pay-per-use |

---

## Data Preparation

### Instruction Tuning Format

For fine-tuning on Gamatrain's blogs, topics, and tests, use this format:

#### JSON/JSONL Format (Recommended)

```json
{
  "instruction": "Explain the concept covered in this blog post about machine learning.",
  "input": "Blog content: Machine learning is a subset of AI...",
  "output": "Machine learning enables computers to learn from data without explicit programming..."
}
```

#### Alternative: Conversational Format

```json
{
  "conversations": [
    {"role": "user", "content": "What does this test question assess?"},
    {"role": "assistant", "content": "This question tests understanding of..."}
  ]
}
```

### Data Preparation Script

```python
# Convert Gamatrain content to training format
import json

def prepare_blog_data(blogs):
    """Convert blog posts to instruction format"""
    dataset = []
    for blog in blogs:
        dataset.append({
            "instruction": f"Summarize this educational content about {blog['topic']}",
            "input": blog['content'],
            "output": blog['summary']
        })
    return dataset

def prepare_qa_data(tests):
    """Convert Q&A pairs from tests"""
    dataset = []
    for test in tests:
        for question in test['questions']:
            dataset.append({
                "instruction": question['text'],
                "input": question.get('context', ''),
                "output": question['correct_answer']
            })
    return dataset

# Save as JSONL
with open('gamatrain_dataset.jsonl', 'w') as f:
    for item in dataset:
        f.write(json.dumps(item, ensure_ascii=False) + '\n')
```

---

## API Integration with Nuxt.js Frontend

### Backend API Example (Node.js/Nuxt Server)

Create a server API route: `server/api/ai/chat.post.ts`

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, context } = body;

  try {
    // Call your LLM API (Ollama, llama.cpp, or vLLM)
    const response = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2:1.5b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational assistant for Gamatrain platform.'
          },
          {
            role: 'user',
            content: context ? `Context: ${context}\n\nQuestion: ${message}` : message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    return {
      success: true,
      message: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
```

### Frontend Integration (Nuxt Composable)

Create a composable: `composables/useAI.ts`

```typescript
export const useAI = () => {
  const askQuestion = async (message: string, context?: string) => {
    const { data, error } = await useFetch('/api/ai/chat', {
      method: 'POST',
      body: {
        message,
        context
      }
    });

    if (error.value) {
      throw new Error(error.value.message);
    }

    return data.value;
  };

  return {
    askQuestion
  };
};
```

### Usage in Component

```vue
<script setup lang="ts">
const { askQuestion } = useAI();
const userQuestion = ref('');
const aiResponse = ref('');
const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    const response = await askQuestion(userQuestion.value);
    aiResponse.value = response.message;
  } catch (error) {
    console.error('AI Error:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="ai-chat">
    <input v-model="userQuestion" placeholder="Ask a question..." />
    <button @click="handleSubmit" :disabled="loading">
      {{ loading ? 'Thinking...' : 'Ask AI' }}
    </button>
    <div v-if="aiResponse" class="response">
      {{ aiResponse }}
    </div>
  </div>
</template>
```

---

## Security & Licensing

### Commercial Use Summary

| Model | License | Commercial Use | Restrictions |
|-------|---------|----------------|--------------|
| **Qwen2-1.5B** ⭐ | Apache 2.0 | ✅ Unlimited | None |
| **Phi-3-Mini** | MIT | ✅ Unlimited | Must include license text |
| **Gemma 2** | Gemma License | ⚠️ Permitted | Terms of Use apply |
| **Llama 3.2** | Llama License | ✅ Yes | 700M MAU limit |

### Security Best Practices

1. **API Authentication:**
   ```typescript
   // Add API key authentication
   const apiKey = event.node.req.headers['x-api-key'];
   if (apiKey !== process.env.AI_API_KEY) {
     throw createError({ statusCode: 401, message: 'Unauthorized' });
   }
   ```

2. **Rate Limiting:**
   ```typescript
   // Implement rate limiting
   import { rateLimit } from '@/utils/rateLimit';
   
   await rateLimit(event, {
     max: 10, // 10 requests
     window: '1 minute'
   });
   ```

3. **Input Validation:**
   ```typescript
   // Validate and sanitize inputs
   const sanitizedMessage = message.trim().substring(0, 1000);
   ```

4. **User Data Handling:**
   - 🔒 Encrypt sensitive training data
   - 📝 Comply with GDPR/privacy laws
   - 🚫 Don't train on personal user data without consent
   - 🗑️ Implement data retention policies

---

## Future Scalability Plan

### Phase 1: MVP (Current)
- Deploy Qwen2-1.5B on CPU-only VPS
- Use Ollama for simplicity
- Fine-tune on small dataset (100-1000 examples)
- Single-instance deployment

### Phase 2: Growth (3-6 months)
- Upgrade to GPU VPS (RTX 3060 or better)
- Switch to vLLM for better throughput
- Expand training dataset (10,000+ examples)
- Implement caching layer (Redis)
- Add monitoring (Prometheus + Grafana)

### Phase 3: Scale (6-12 months)
- Consider larger model (Qwen2-7B or Llama 3.1-8B)
- Implement horizontal scaling:
  - Load balancer (nginx/HAProxy)
  - Multiple inference servers
  - Queue-based architecture (RabbitMQ/Redis)
- Advanced features:
  - RAG (Retrieval-Augmented Generation) with vector DB
  - Streaming responses
  - Multi-modal capabilities

### Scaling Architecture

```
[Nuxt Frontend] 
      ↓
[Load Balancer (nginx)]
      ↓
  ┌───┴───┬───────┬───────┐
  ↓       ↓       ↓       ↓
[LLM 1] [LLM 2] [LLM 3] [LLM N]
  ↓       ↓       ↓       ↓
[Shared Cache (Redis)]
  ↓
[Vector DB (Qdrant/Weaviate)]
```

---

## Cost Estimation

### VPS Hosting (Monthly)

| Tier | Specs | Provider Example | Cost/Month |
|------|-------|------------------|------------|
| **Starter** | 4 vCPU, 8GB RAM | DigitalOcean, Hetzner | $20-40 |
| **Growth** | GPU (RTX 3060) + 16GB RAM | Vast.ai, RunPod | $50-100 |
| **Production** | GPU (RTX 4090) + 32GB RAM | RunPod, Lambda Labs | $150-300 |

### Fine-Tuning Costs

- **Google Colab Free:** $0 (limited hours)
- **Colab Pro:** $10/month (better GPU access)
- **Pay-per-use GPU (RunPod):** $0.20-0.50/hour

### Total Estimated Monthly Cost

- **MVP (Start):** $20-40/month
- **Growth:** $60-150/month
- **Production:** $200-400/month

---

## Risks & Limitations

### Technical Risks

1. **Model Quality:**
   - ⚠️ Small models may produce less accurate responses than larger models
   - ✅ Mitigation: Fine-tune on high-quality domain data, implement feedback loop

2. **Latency:**
   - ⚠️ CPU-only inference may be slow for real-time applications
   - ✅ Mitigation: Implement caching, consider GPU upgrade, use async processing

3. **Hallucinations:**
   - ⚠️ All LLMs can generate incorrect information
   - ✅ Mitigation: Add disclaimers, implement RAG with fact-checking, human review

4. **Context Limitations:**
   - ⚠️ Limited ability to process very long documents
   - ✅ Mitigation: Implement chunking, use models with longer context (Qwen2: 128K)

### Operational Risks

1. **VPS Downtime:**
   - ⚠️ Single point of failure
   - ✅ Mitigation: Implement health checks, auto-restart, fallback API

2. **Resource Exhaustion:**
   - ⚠️ Memory/CPU spikes under high load
   - ✅ Mitigation: Rate limiting, request queuing, monitoring

3. **Model Updates:**
   - ⚠️ Need to retrain with new data periodically
   - ✅ Mitigation: Automated training pipelines, version control

### Legal & Privacy Risks

1. **Training Data Privacy:**
   - ⚠️ User data in training sets
   - ✅ Mitigation: Anonymize data, get consent, follow GDPR

2. **Generated Content Liability:**
   - ⚠️ AI-generated harmful/incorrect content
   - ✅ Mitigation: Content filters, user disclaimers, moderation

---

## Quick Start Checklist

- [ ] Provision VPS (8GB RAM minimum)
- [ ] Install Ollama or llama.cpp
- [ ] Download Qwen2-1.5B model
- [ ] Test API locally
- [ ] Prepare training dataset (100+ examples)
- [ ] Set up Google Colab for fine-tuning
- [ ] Fine-tune model on Gamatrain data
- [ ] Deploy fine-tuned model to VPS
- [ ] Create Nuxt.js API integration
- [ ] Test frontend integration
- [ ] Implement authentication & rate limiting
- [ ] Set up monitoring
- [ ] Launch to users!

---

## Useful Resources

### Model Repositories
- [Qwen2 on Hugging Face](https://huggingface.co/Qwen/Qwen2-1.5B-Instruct)
- [Phi-3 on Hugging Face](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct)
- [Gemma 2 on Hugging Face](https://huggingface.co/google/gemma-2-2b-it)
- [Llama 3.2 on Hugging Face](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct)

### Deployment Tools
- [Ollama Documentation](https://ollama.com/docs)
- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [vLLM Documentation](https://docs.vllm.ai/)
- [Text Generation Inference](https://github.com/huggingface/text-generation-inference)

### Fine-Tuning Resources
- [Hugging Face PEFT](https://github.com/huggingface/peft)
- [Axolotl Training Framework](https://github.com/OpenAccess-AI-Collective/axolotl)
- [QLoRA Paper](https://arxiv.org/abs/2305.14314)
- [Hugging Face TRL Library](https://github.com/huggingface/trl)

### Community & Support
- [Hugging Face Forums](https://discuss.huggingface.co/)
- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)
- [Ollama Discord](https://discord.gg/ollama)

---

## Conclusion

This research provides a complete roadmap for deploying a lightweight, efficient LLM system for Gamatrain on a VPS. The recommended **Qwen2-1.5B** model offers the best balance of performance, efficiency, and licensing for your use case.

**Next Steps:**
1. Review this document with the team
2. Set up a development VPS for testing
3. Prepare initial training dataset
4. Run the fine-tuning demo (see next section)
5. Iterate and improve based on real-world usage

For questions or support, refer to the resources above or consult the AI research team.
