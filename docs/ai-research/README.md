# Gamatrain LLM System - Example Usage

This directory contains examples and utilities for the Gamatrain AI system.

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `gamatrain-vps-llm-research.md` | **Main research document** - Complete analysis and recommendations |
| `fine-tuning-demo.ipynb` | **Colab notebook** - Fine-tune Qwen2-1.5B with QLoRA |
| `llm_server.py` | **API Server** - Flask server for model serving |
| `useGamatrainAI.ts` | **Frontend composable** - Nuxt.js integration |
| `DEPLOYMENT.md` | **Deployment guide** - Step-by-step VPS setup |
| `requirements.txt` | **Python dependencies** - Required packages |

## 🚀 Quick Start

### 1. Research Phase (Start Here)

Read the main research document:
```bash
# Open in your favorite markdown viewer
cat gamatrain-vps-llm-research.md
```

### 2. Fine-Tuning Phase

Open the Colab notebook:
1. Upload `fine-tuning-demo.ipynb` to Google Colab
2. Follow the step-by-step instructions
3. Train on your Gamatrain educational content
4. Download the fine-tuned adapters

### 3. Deployment Phase

Follow the deployment guide:
```bash
# Read the deployment guide
cat DEPLOYMENT.md

# Install server dependencies
pip install -r requirements.txt

# Run the server
python llm_server.py
```

### 4. Frontend Integration

Copy the composable to your Nuxt project:
```bash
cp useGamatrainAI.ts ../composables/
```

Use in your components:
```vue
<script setup>
const { askQuestion } = useGamatrainAI();
const answer = await askQuestion('What is machine learning?');
</script>
```

## 📊 Architecture Overview

```
┌─────────────────┐
│  Nuxt.js App    │
│  (Frontend)     │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│  llm_server.py  │
│  (Flask API)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Qwen2-1.5B     │
│  (GGUF Model)   │
└─────────────────┘
```

## 🎯 Use Cases

### Educational Q&A
```typescript
const { askQuestion } = useGamatrainAI();
const answer = await askQuestion(
  'Explain neural networks',
  { level: 'beginner' }
);
```

### Context-Aware Help
```typescript
const blogContent = '...'; // Content from your blog post
const answer = await askQuestion(
  'Summarize this blog post',
  { context: blogContent }
);
```

### Course Assistance
```typescript
const answer = await askQuestion(
  'What are the key concepts in this lesson?',
  {
    context: lesson.content,
    level: 'intermediate'
  }
);
```

## 📈 Performance Expectations

### CPU-Only (8GB RAM)
- **Latency:** 1-3 seconds per response
- **Throughput:** 5-10 requests/min
- **Cost:** ~$20-40/month

### Small GPU (RTX 3060)
- **Latency:** 0.3-0.8 seconds per response
- **Throughput:** 30-60 requests/min
- **Cost:** ~$50-100/month

## 🔐 Security Notes

Always implement:
- API authentication
- Rate limiting
- Input validation
- HTTPS/SSL
- Regular updates

Example API key auth in `llm_server.py`:
```python
@app.before_request
def check_api_key():
    api_key = request.headers.get('X-API-Key')
    if api_key != os.getenv('API_KEY'):
        return jsonify({'error': 'Unauthorized'}), 401
```

## 🧪 Testing

Test the API server:
```bash
# Health check
curl http://localhost:8000/health

# Ask a question
curl -X POST http://localhost:8000/v1/gamatrain/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is AI?",
    "level": "beginner"
  }'
```

## 📚 Additional Resources

- [Qwen2 Model Card](https://huggingface.co/Qwen/Qwen2-1.5B-Instruct)
- [llama.cpp Documentation](https://github.com/ggerganov/llama.cpp)
- [Ollama](https://ollama.com)
- [Hugging Face PEFT](https://github.com/huggingface/peft)

## 🤝 Contributing

To improve the system:
1. Collect user feedback
2. Add more training examples
3. Fine-tune periodically
4. Monitor performance
5. Iterate and improve

## 📝 License

This implementation uses:
- **Qwen2-1.5B:** Apache 2.0 License ✅ Commercial use allowed
- **Flask:** BSD License
- **llama-cpp-python:** MIT License

## ❓ FAQ

**Q: Can I use this commercially?**  
A: Yes! Qwen2-1.5B uses Apache 2.0 license with no restrictions.

**Q: How much does it cost?**  
A: Starting from $20-40/month for basic VPS hosting.

**Q: How long does fine-tuning take?**  
A: ~30-60 minutes on Google Colab free tier.

**Q: Can I run this on shared hosting?**  
A: No, you need a VPS with at least 8GB RAM.

**Q: What about data privacy?**  
A: All data stays on your VPS - no third-party API calls needed!

## 🎓 Next Steps

1. ✅ Read the research document
2. ✅ Run the fine-tuning demo
3. ✅ Deploy the server
4. ✅ Integrate with Nuxt.js
5. 📊 Monitor and optimize
6. 🔄 Iterate based on feedback

---

**Need help?** Check the main research document or create an issue in the repository.
