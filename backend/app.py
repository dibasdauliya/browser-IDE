import sys
import subprocess
import tempfile
import os
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/execute', methods=['POST'])
def execute_python():
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'No code provided'}), 400
        
        code = data['code']
        
        # Create a temporary file to write the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name
        
        try:
            # Execute the Python code with a timeout
            start_time = time.time()
            result = subprocess.run(
                [sys.executable, temp_file_path],
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout
            )
            execution_time = time.time() - start_time
            
            # Prepare response
            response = {
                'output': result.stdout,
                'error': result.stderr,
                'exit_code': result.returncode,
                'execution_time': round(execution_time, 3)
            }
            
            return jsonify(response)
            
        except subprocess.TimeoutExpired:
            return jsonify({
                'error': 'Code execution timed out (30 seconds limit)',
                'output': '',
                'exit_code': -1,
                'execution_time': 30
            }), 408
            
        except Exception as e:
            return jsonify({
                'error': f'Execution error: {str(e)}',
                'output': '',
                'exit_code': -1,
                'execution_time': 0
            }), 500
            
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
                
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'output': '',
            'exit_code': -1,
            'execution_time': 0
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Python execution service is running'})

if __name__ == '__main__':
    print("Starting Python Code Execution Backend...")
    print("Backend will be available at: http://localhost:5001")
    print("API endpoint: http://localhost:5001/api/execute")
    app.run(debug=True, host='0.0.0.0', port=5001) 