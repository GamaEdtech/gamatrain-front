"""
Gamatrain LLM API Server - Minimal Example
==========================================

This is a minimal Flask server that serves a fine-tuned LLM using llama-cpp-python.
Can be deployed on your VPS alongside the main Nuxt.js application.

Requirements:
- Python 3.8+
- llama-cpp-python
- Flask
- Flask-CORS

Installation:
    pip install llama-cpp-python flask flask-cors

Usage:
    python llm_server.py

The server will start on http://localhost:8000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Nuxt.js frontend

# Model configuration
MODEL_PATH = os.getenv('MODEL_PATH', './models/qwen2-1.5b-q4.gguf')
MAX_TOKENS = int(os.getenv('MAX_TOKENS', 500))
TEMPERATURE = float(os.getenv('TEMPERATURE', 0.7))
N_CTX = int(os.getenv('N_CTX', 4096))  # Context window size
N_THREADS = int(os.getenv('N_THREADS', 4))  # CPU threads

# Load model at startup
logger.info(f"Loading model from {MODEL_PATH}...")
try:
    llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=N_CTX,
        n_threads=N_THREADS,
        n_gpu_layers=0,  # Set to 0 for CPU-only, increase for GPU
        verbose=False
    )
    logger.info("✅ Model loaded successfully!")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    llm = None


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if llm else 'unhealthy',
        'model_loaded': llm is not None
    })


@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """
    OpenAI-compatible chat completions endpoint
    
    Request body:
    {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is AI?"}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    """
    if not llm:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        messages = data.get('messages', [])
        temperature = data.get('temperature', TEMPERATURE)
        max_tokens = data.get('max_tokens', MAX_TOKENS)
        
        # Format messages into a prompt
        prompt = format_messages(messages)
        
        logger.info(f"Generating response for prompt: {prompt[:100]}...")
        
        # Generate response
        response = llm(
            prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=0.9,
            echo=False,
            stop=["</s>", "###", "User:"]
        )
        
        # Extract generated text
        generated_text = response['choices'][0]['text'].strip()
        
        # Return OpenAI-compatible response
        return jsonify({
            'id': 'gamatrain-' + os.urandom(8).hex(),
            'object': 'chat.completion',
            'created': int(response['created']),
            'model': 'qwen2-1.5b-gamatrain',
            'choices': [{
                'index': 0,
                'message': {
                    'role': 'assistant',
                    'content': generated_text
                },
                'finish_reason': response['choices'][0]['finish_reason']
            }],
            'usage': {
                'prompt_tokens': response['usage']['prompt_tokens'],
                'completion_tokens': response['usage']['completion_tokens'],
                'total_tokens': response['usage']['total_tokens']
            }
        })
    
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/v1/completions', methods=['POST'])
def completions():
    """
    Simple completion endpoint
    
    Request body:
    {
        "prompt": "What is AI?",
        "temperature": 0.7,
        "max_tokens": 500
    }
    """
    if not llm:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        prompt = data.get('prompt', '')
        temperature = data.get('temperature', TEMPERATURE)
        max_tokens = data.get('max_tokens', MAX_TOKENS)
        
        logger.info(f"Generating completion for: {prompt[:100]}...")
        
        # Generate response
        response = llm(
            prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=0.9,
            echo=False
        )
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error generating completion: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/v1/gamatrain/ask', methods=['POST'])
def gamatrain_ask():
    """
    Custom Gamatrain endpoint with educational context
    
    Request body:
    {
        "question": "What is machine learning?",
        "context": "Optional context from blog posts or course materials",
        "level": "beginner|intermediate|advanced"
    }
    """
    if not llm:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        question = data.get('question', '')
        context = data.get('context', '')
        level = data.get('level', 'intermediate')
        
        # Create educational prompt
        prompt = create_educational_prompt(question, context, level)
        
        logger.info(f"Educational query: {question}")
        
        # Generate response
        response = llm(
            prompt,
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
            top_p=0.9,
            echo=False,
            stop=["</s>", "###"]
        )
        
        answer = response['choices'][0]['text'].strip()
        
        return jsonify({
            'success': True,
            'question': question,
            'answer': answer,
            'level': level
        })
    
    except Exception as e:
        logger.error(f"Error in educational query: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def format_messages(messages):
    """Format chat messages into a prompt"""
    prompt = ""
    for msg in messages:
        role = msg.get('role', 'user')
        content = msg.get('content', '')
        
        if role == 'system':
            prompt += f"System: {content}\n\n"
        elif role == 'user':
            prompt += f"User: {content}\n\n"
        elif role == 'assistant':
            prompt += f"Assistant: {content}\n\n"
    
    prompt += "Assistant: "
    return prompt


def create_educational_prompt(question, context, level):
    """Create an educational prompt with context"""
    level_instructions = {
        'beginner': 'Explain in simple terms that a beginner can understand.',
        'intermediate': 'Provide a clear explanation with some technical details.',
        'advanced': 'Give an in-depth technical explanation with advanced concepts.'
    }
    
    instruction = level_instructions.get(level, level_instructions['intermediate'])
    
    prompt = f"""You are an educational AI assistant for Gamatrain, an online learning platform.

{instruction}

"""
    
    if context:
        prompt += f"""Context from course materials:
{context}

"""
    
    prompt += f"""Question: {question}

Answer: """
    
    return prompt


if __name__ == '__main__':
    if not llm:
        logger.error("Model failed to load. Please check MODEL_PATH and try again.")
        exit(1)
    
    # Get configuration from environment
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting server on {host}:{port}")
    logger.info(f"Model: {MODEL_PATH}")
    logger.info(f"Context window: {N_CTX} tokens")
    logger.info(f"CPU threads: {N_THREADS}")
    
    app.run(host=host, port=port, debug=debug)
