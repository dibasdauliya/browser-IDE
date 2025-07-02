import sys
import subprocess
import tempfile
import os
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import base64
import io
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/execute', methods=['POST'])
def execute_python():
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'No code provided'}), 400
        
        code = data['code']
        
        # Inject matplotlib plot capture code
        plot_capture_code = '''
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io
import sys

# Store original stdout
_original_stdout = sys.stdout

class PlotCapture:
    def __init__(self):
        self.plots = []
    
    def capture_plot(self):
        """Capture current matplotlib figure as base64"""
        if plt.get_fignums():  # Check if there are any figures
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            buf.seek(0)
            img_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close('all')  # Close all figures
            return img_base64
        return None

# Create global plot capture instance
_plot_capture = PlotCapture()

# Override plt.show() to capture plots
original_show = plt.show
def custom_show(*args, **kwargs):
    plot_data = _plot_capture.capture_plot()
    if plot_data:
        print(f'<PLOT_DATA:{plot_data}:PLOT_DATA>')
    
plt.show = custom_show

# Also capture plots at the end of execution
def _capture_remaining_plots():
    plot_data = _plot_capture.capture_plot()
    if plot_data:
        print(f'<PLOT_DATA:{plot_data}:PLOT_DATA>')

import atexit
atexit.register(_capture_remaining_plots)

'''
        
        # Combine plot capture code with user code
        full_code = plot_capture_code + '\n\n# User code:\n' + code
        
        # Create a temporary file to write the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(full_code)
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
            
            # Process output to extract plots
            output_text = result.stdout
            
            # Extract plot data from output
            import re
            plot_pattern = r'<PLOT_DATA:([^:]+):PLOT_DATA>'
            plot_matches = re.findall(plot_pattern, output_text)
            
            # Remove plot data markers from output text
            clean_output = re.sub(plot_pattern + r'\n?', '', output_text)
            
            # Convert plot data to HTML images
            for plot_data in plot_matches:
                clean_output += f'\n<img src="data:image/png;base64,{plot_data}" style="max-width: 100%; height: auto; margin: 10px 0;" />'
            
            response = {
                'output': clean_output,
                'error': result.stderr,
                'exit_code': result.returncode,
                'execution_time': round(execution_time, 3),
                'plots': len(plot_matches)
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