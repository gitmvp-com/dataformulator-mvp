from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_ai_response(provider, api_key, model, prompt):
    """Get AI response from OpenAI or Anthropic"""
    if provider == 'openai':
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model or 'gpt-4o',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content
    elif provider == 'anthropic':
        from anthropic import Anthropic
        client = Anthropic(api_key=api_key)
        response = client.messages.create(
            model=model or 'claude-3-5-sonnet-latest',
            max_tokens=4000,
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response.content[0].text
    else:
        raise ValueError(f'Unknown provider: {provider}')

@app.route('/api/formulate', methods=['POST'])
def formulate():
    """Generate data transformation and visualization using AI"""
    data = request.json
    tables = data.get('tables', [])
    user_prompt = data.get('prompt', '')
    encodings = data.get('encodings', {})
    api_key = data.get('apiKey') or os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY')
    provider = data.get('provider', 'openai')
    model = data.get('model')

    if not api_key:
        return jsonify({'error': 'API key not configured'}), 400

    # Convert tables to DataFrames
    dfs = {}
    for table in tables:
        dfs[table['name']] = pd.DataFrame(table['data'])

    # Build prompt for AI
    table_info = []
    for name, df in dfs.items():
        cols = ', '.join(df.columns)
        table_info.append(f"Table '{name}': columns = [{cols}]")

    prompt = f"""You are a data transformation expert. Generate Python pandas code to transform the data.

Available tables:
{chr(10).join(table_info)}

User request: {user_prompt}

Desired encodings: {encodings}

Generate Python code that:
1. Transforms/joins the data as needed
2. Returns a final DataFrame called 'result_df'
3. Only use pandas operations
4. Handle missing values appropriately
5. If joining tables, use appropriate join keys

IMPORTANT: Return ONLY the Python code, no explanations. The code should work with the DataFrames already loaded as: {', '.join(dfs.keys())}

Example output format:
```python
# Your transformation code here
result_df = ...
```
"""

    try:
        # Get AI response
        ai_response = get_ai_response(provider, api_key, model, prompt)
        
        # Extract code from response
        code = ai_response
        if '```python' in code:
            code = code.split('```python')[1].split('```')[0]
        elif '```' in code:
            code = code.split('```')[1].split('```')[0]
        code = code.strip()

        # Execute the code
        local_vars = dfs.copy()
        exec(code, {'pd': pd, '__builtins__': __builtins__}, local_vars)
        
        result_df = local_vars.get('result_df')
        if result_df is None:
            return jsonify({'error': 'Code did not produce result_df'}), 400

        # Convert result to JSON
        transformed_data = result_df.to_dict(orient='records')

        # Generate basic Vega-Lite spec
        vega_spec = {
            '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
            'data': {'values': transformed_data},
            'mark': 'bar',  # Will be overridden by frontend
            'encoding': {},
            'width': 400,
            'height': 300,
        }

        return jsonify({
            'transformedData': transformed_data,
            'vegaLiteSpec': vega_spec,
            'code': code,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
