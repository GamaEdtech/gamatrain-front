# Gamatrain LLM Deployment - Quick Start Guide

This guide will help you deploy the LLM system from research to production.

## Prerequisites

- VPS with at least 8GB RAM (16GB recommended)
- Ubuntu 22.04 LTS
- Python 3.8+
- Node.js 18+ (for Nuxt.js)

## Step 1: Prepare Your VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install build essentials
sudo apt install -y build-essential git cmake python3-pip

# Install Python dependencies
pip3 install llama-cpp-python flask flask-cors
```

## Step 2: Download Model

### Option A: Using Pre-quantized GGUF Model

```bash
# Create models directory
mkdir -p ~/gamatrain-llm/models
cd ~/gamatrain-llm/models

# Download Qwen2-1.5B (4-bit quantized)
wget https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF/resolve/main/qwen2-1_5b-instruct-q4_k_m.gguf
```

### Option B: Using Your Fine-Tuned Model

```bash
# Upload your fine-tuned model from Colab
# You can use scp, rsync, or upload to HuggingFace and download

# Example with scp:
scp your-fine-tuned-model.gguf user@your-vps:~/gamatrain-llm/models/
```

## Step 3: Deploy the API Server

```bash
# Copy the Python server script
cd ~/gamatrain-llm
# Upload llm_server.py to this directory

# Set environment variables
export MODEL_PATH=./models/qwen2-1_5b-instruct-q4_k_m.gguf
export PORT=8000
export N_THREADS=4

# Test the server
python3 llm_server.py
```

## Step 4: Set Up as a System Service

Create a systemd service for auto-start:

```bash
sudo nano /etc/systemd/system/gamatrain-llm.service
```

Add this content:

```ini
[Unit]
Description=Gamatrain LLM API Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/gamatrain-llm
Environment="MODEL_PATH=/home/your-username/gamatrain-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf"
Environment="PORT=8000"
Environment="N_THREADS=4"
Environment="N_CTX=4096"
ExecStart=/usr/bin/python3 /home/your-username/gamatrain-llm/llm_server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable gamatrain-llm
sudo systemctl start gamatrain-llm
sudo systemctl status gamatrain-llm
```

## Step 5: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/gamatrain-llm
```

Add:

```nginx
server {
    listen 80;
    server_name ai.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for LLM generation
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/gamatrain-llm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Add SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ai.yourdomain.com
```

## Step 7: Integrate with Nuxt.js

### Add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      aiApiUrl: process.env.AI_API_URL || 'https://ai.yourdomain.com'
    }
  }
})
```

### Add to `.env`:

```bash
AI_API_URL=https://ai.yourdomain.com
```

### Copy composable:

```bash
cp useGamatrainAI.ts ~/your-nuxt-project/composables/
```

## Step 8: Test the Integration

Create a test page `pages/test-ai.vue`:

```vue
<script setup lang="ts">
const { askQuestion, loading, error } = useGamatrainAI();

const question = ref('');
const answer = ref('');

async function handleAsk() {
  if (!question.value.trim()) return;
  
  try {
    answer.value = await askQuestion(question.value);
  } catch (err) {
    console.error('AI Error:', err);
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Test AI Integration</h1>
    
    <div class="space-y-4">
      <input
        v-model="question"
        type="text"
        placeholder="Ask a question..."
        class="w-full p-2 border rounded"
        @keyup.enter="handleAsk"
      />
      
      <button
        @click="handleAsk"
        :disabled="loading"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {{ loading ? 'Thinking...' : 'Ask AI' }}
      </button>
      
      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        Error: {{ error }}
      </div>
      
      <div v-if="answer" class="p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Answer:</h3>
        <p>{{ answer }}</p>
      </div>
    </div>
  </div>
</template>
```

Visit `http://localhost:3000/test-ai` to test!

## Step 9: Monitor and Maintain

### View logs:

```bash
# System service logs
sudo journalctl -u gamatrain-llm -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor resources:

```bash
# CPU and memory usage
htop

# Model-specific monitoring
watch -n 1 'ps aux | grep llm_server'
```

## Troubleshooting

### Server won't start:

```bash
# Check if port is already in use
sudo lsof -i :8000

# Check model file exists
ls -lh ~/gamatrain-llm/models/
```

### Slow responses:

- Reduce `N_CTX` (context window)
- Reduce `max_tokens` in requests
- Consider upgrading to GPU VPS
- Use more CPU threads: `N_THREADS=8`

### Out of memory:

- Use smaller quantization (Q2_K or Q3_K)
- Reduce context window
- Upgrade VPS RAM

## Performance Optimization

### For CPU-only:

```bash
# Enable all CPU optimizations
export N_THREADS=$(nproc)
export OMP_NUM_THREADS=$(nproc)
```

### For GPU (if available):

Update `llm_server.py`:

```python
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=N_CTX,
    n_threads=N_THREADS,
    n_gpu_layers=35,  # Offload layers to GPU
    verbose=False
)
```

## Next Steps

1. ✅ Server deployed and running
2. ✅ Nuxt.js connected
3. 📝 Collect user feedback
4. 🔄 Prepare more training data
5. 📊 Monitor usage patterns
6. 🎯 Fine-tune model with real data
7. 📈 Scale as needed

## Security Checklist

- [ ] Enable firewall (UFW)
- [ ] Set up rate limiting
- [ ] Add API authentication
- [ ] Enable HTTPS
- [ ] Regular backups
- [ ] Monitor logs for abuse
- [ ] Update dependencies regularly

## Cost Tracking

Track your monthly costs:

- VPS: $____/month
- Domain: $____/year
- SSL: Free (Let's Encrypt)
- **Total: ~$____/month**

## Support

For issues:
1. Check the logs
2. Review the research document
3. Test with curl/Postman first
4. Check GitHub issues for llama-cpp-python

Good luck with your deployment! 🚀
