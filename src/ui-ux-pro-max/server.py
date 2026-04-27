#!/usr/bin/env python3
"""
UI/UX Pro Max - Visual Editor Backend Server
HTTP API para servir dados de design system, busca e geração
"""

import json
import csv
import os
import sys
from pathlib import Path
from typing import List, Dict, Any
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# Add scripts directory to path
SCRIPTS_DIR = Path(__file__).parent / 'scripts'
sys.path.insert(0, str(SCRIPTS_DIR))

from core import search, search_stack, detect_domain
from design_system import generate_design_system

app = Flask(__name__, static_folder='../../web/dist', static_url_path='/assets')
CORS(app)

# Cache de dados em memória
cache = {
    'products': [],
    'styles': [],
    'colors': [],
    'typography': [],
    'charts': [],
    'ux_guidelines': [],
    'landing': [],
    'stacks': {},
    'bm25_index': None,
    'loaded': False
}

DATA_DIR = Path(__file__).parent / 'data'

def load_csv(filename: str) -> List[Dict[str, str]]:
    """Carrega dados de um arquivo CSV"""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        return []

    data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        data = list(reader)
    return data

def load_all_data():
    """Carrega todos os dados CSV na memória"""
    if cache['loaded']:
        return

    cache['products'] = load_csv('products.csv')
    cache['styles'] = load_csv('styles.csv')
    cache['colors'] = load_csv('colors.csv')
    cache['typography'] = load_csv('typography.csv')
    cache['charts'] = load_csv('charts.csv')
    cache['ux_guidelines'] = load_csv('ux-guidelines.csv')
    cache['landing'] = load_csv('landing.csv')

    # Carrega dados de stacks
    stacks_dir = DATA_DIR / 'stacks'
    if stacks_dir.exists():
        for stack_file in stacks_dir.glob('*.csv'):
            stack_name = stack_file.stem
            cache['stacks'][stack_name] = load_csv(f'stacks/{stack_file.name}')

    # BM25 é computado sob demanda em core.py
    cache['loaded'] = True
    print(f"✓ Carregados {len(cache['products'])} produtos")
    print(f"✓ Carregados {len(cache['styles'])} estilos")
    print(f"✓ Carregadas {len(cache['colors'])} paletas de cores")
    print(f"✓ Carregadas {len(cache['typography'])} tipografias")

@app.before_request
def before_request():
    """Carrega dados na primeira requisição"""
    if not cache['loaded']:
        load_all_data()

# ============ ENDPOINTS API ============

@app.get('/api/health')
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'loaded': cache['loaded']})

@app.get('/api/products')
def get_products():
    """Lista todos os 161 produtos"""
    return jsonify(cache['products'])

@app.get('/api/styles')
def get_styles():
    """Lista todos os 67 estilos"""
    return jsonify(cache['styles'])

@app.get('/api/colors')
def get_colors():
    """Lista todas as 161 paletas de cores"""
    return jsonify(cache['colors'])

@app.get('/api/typography')
def get_typography():
    """Lista todas as 57+ tipografias"""
    return jsonify(cache['typography'])

@app.get('/api/charts')
def get_charts():
    """Lista todos os 25 tipos de gráficos"""
    return jsonify(cache['charts'])

@app.get('/api/ux-guidelines')
def get_ux_guidelines():
    """Lista todas as 99+ diretrizes UX"""
    return jsonify(cache['ux_guidelines'])

@app.get('/api/landing-patterns')
def get_landing_patterns():
    """Lista os 8 padrões de landing page"""
    return jsonify(cache['landing'])

@app.get('/api/stacks')
def get_stacks():
    """Lista stacks e suas guidelines"""
    stacks_list = []
    for stack_name, guidelines in cache['stacks'].items():
        stacks_list.append({
            'name': stack_name,
            'count': len(guidelines),
            'guidelines': guidelines[:5]  # Preview dos 5 primeiros
        })
    return jsonify(stacks_list)

@app.post('/api/search')
def search_endpoint():
    """Busca híbrida BM25 + regex"""
    data = request.json or {}
    query = data.get('query', '')
    domain = data.get('domain', None)
    limit = min(data.get('limit', 10), 50)

    if not query:
        return jsonify({'error': 'Query é obrigatório'}), 400

    result = search(query, domain, limit)
    return jsonify(result)

@app.post('/api/design-system')
def generate_system():
    """Gera um design system completo"""
    data = request.json or {}
    product_name = data.get('product_name', 'My Product')
    product_type = data.get('product_type', '')
    style_preference = data.get('style_preference', '')
    custom_query = data.get('query', '')

    if not product_type and not custom_query:
        return jsonify({'error': 'product_type ou query é obrigatório'}), 400

    query = custom_query or product_type
    design_system = generate_design_system(query, product_name)

    return jsonify(design_system)

@app.post('/api/export')
def export_code():
    """Exporta design system para diferentes formatos"""
    data = request.json or {}
    design_system = data.get('design_system', {})
    format_type = data.get('format', 'json')  # json, css, js, tailwind
    stack = data.get('stack', 'html-tailwind')

    exported = {
        'format': format_type,
        'stack': stack,
        'generated_at': str(Path('').resolve()),
        'design_system': design_system
    }

    if format_type == 'css':
        exported['css'] = _generate_css_variables(design_system)
    elif format_type == 'tailwind':
        exported['tailwind'] = _generate_tailwind_config(design_system)
    elif format_type == 'js':
        exported['js'] = json.dumps(design_system, indent=2)

    return jsonify(exported)

def _generate_css_variables(design_system: Dict) -> str:
    """Gera CSS variables a partir do design system"""
    css = ":root {\n"

    # Cores
    colors = design_system.get('colors', {})
    for color_name, color_value in colors.items():
        css += f"  --color-{color_name}: {color_value};\n"

    # Tipografia
    typography = design_system.get('typography', {})
    if 'primary' in typography:
        css += f"  --font-primary: {typography['primary'].get('family', 'sans-serif')};\n"

    css += "}\n"
    return css

def _generate_tailwind_config(design_system: Dict) -> Dict[str, Any]:
    """Gera configuração Tailwind a partir do design system"""
    colors = design_system.get('colors', {})

    # Mapeia cores para tema Tailwind
    tailwind_colors = {
        'primary': colors.get('primary', '#000000'),
        'secondary': colors.get('secondary', '#808080'),
        'accent': colors.get('accent', '#0000FF'),
    }

    return {
        'theme': {
            'colors': tailwind_colors,
            'fontFamily': {
                'primary': design_system.get('typography', {}).get('primary', {}).get('family', 'sans-serif')
            }
        }
    }

# ============ STATIC FILES ============

@app.get('/')
def index():
    """Serve index.html para SPA"""
    if Path('../../web/dist/index.html').exists():
        return send_from_directory('../../web/dist', 'index.html')
    return jsonify({'error': 'Frontend não foi buildado. Execute: npm run build em web/'}), 404

@app.get('/<path:path>')
def serve_static(path):
    """Serve arquivos estáticos do frontend"""
    if Path(f'../../web/dist/{path}').exists():
        return send_from_directory('../../web/dist', path)
    return index()  # Fallback para SPA

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 UI/UX Pro Max - Visual Editor Server")
    print("📊 Iniciando servidor na porta 5000...")
    print("🌐 Acesse: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
