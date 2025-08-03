import subprocess
import tempfile
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import venv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# global variable to store the user's virtual environment path
USER_VENV_PATH = None

def ensure_user_venv():
    """Ensure user virtual environment exists and return its path"""
    global USER_VENV_PATH
    
    if USER_VENV_PATH is None:
        # Create a user-specific virtual environment
        venv_dir = os.path.join(os.path.dirname(__file__), 'user_venv')
        if not os.path.exists(venv_dir):
            print(f"Creating user virtual environment at {venv_dir}")
            venv.create(venv_dir, with_pip=True)
        USER_VENV_PATH = venv_dir
    
    return USER_VENV_PATH

def get_python_executable():
    """Get the Python executable path from the user's virtual environment"""
    venv_path = ensure_user_venv()
    if os.name == 'nt':  # Windows
        return os.path.join(venv_path, 'Scripts', 'python.exe')
    else:  # Unix/Linux/macOS
        return os.path.join(venv_path, 'bin', 'python')

def get_pip_executable():
    """Get the pip executable path from the user's virtual environment"""
    venv_path = ensure_user_venv()
    if os.name == 'nt':  # Windows
        return os.path.join(venv_path, 'Scripts', 'pip.exe')
    else:  # Unix/Linux/macOS
        return os.path.join(venv_path, 'bin', 'pip')

@app.route('/api/install-package', methods=['POST'])
def install_package():
    """Install a Python package in the user's virtual environment"""
    try:
        data = request.get_json()
        if not data or 'package' not in data:
            return jsonify({'error': 'No package name provided'}), 400
        
        package_name = data['package'].strip()
        if not package_name:
            return jsonify({'error': 'Package name cannot be empty'}), 400
        
        # prevent installation of potentially dangerous packages
        dangerous_packages = ['os', 'sys', 'subprocess', 'shutil', 'tempfile', 'pathlib']
        if package_name.lower() in [pkg.lower() for pkg in dangerous_packages]:
            return jsonify({
                'success': False,
                'error': f'Cannot install {package_name} - this is a built-in Python module'
            }), 400
        
        ensure_user_venv()
        pip_executable = get_pip_executable()
        
        print(f"Installing package: {package_name}")
        
        # install the package with user flag to avoid permission issues
        result = subprocess.run(
            [pip_executable, 'install', '--user', package_name],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout for package installation
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'message': f'Successfully installed {package_name}',
                'output': result.stdout
            })
        else:
            # try without --user flag if it fails
            result_no_user = subprocess.run(
                [pip_executable, 'install', package_name],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result_no_user.returncode == 0:
                return jsonify({
                    'success': True,
                    'message': f'Successfully installed {package_name}',
                    'output': result_no_user.stdout
                })
            else:
                return jsonify({
                    'success': False,
                    'error': f'Failed to install {package_name}',
                    'output': result_no_user.stderr
                }), 400
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': f'Package installation timed out for {package_name}'
        }), 408
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/list-packages', methods=['GET'])
def list_packages():
    """List installed packages in the user's virtual environment"""
    try:
        ensure_user_venv()
        pip_executable = get_pip_executable()
        
        # list all installed packages first
        result = subprocess.run(
            [pip_executable, 'list'],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # parse the output to extract package names
            lines = result.stdout.strip().split('\n')[2:]  # skip header lines
            all_packages = []
            for line in lines:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 1:
                        all_packages.append(parts[0])
            
            # filter out system packages and dependencies
            user_packages = []
            system_packages = {
                'pip', 'setuptools', 'wheel', 'distlib', 'filelock', 
                'platformdirs', 'typing-extensions', 'zipp', 'importlib-metadata',
                'markupsafe', 'click', 'itsdangerous', 'jinja2', 'werkzeug',
                'flask', 'flask-cors', 'pyparsing', 'python-dateutil', 
                'six', 'cycler', 'kiwisolver', 'certifi', 'charset-normalizer',
                'idna', 'urllib3', 'cffi', 'colorama', 'cryptography', 'pycparser',
                'contourpy',  'distro', 'et_xmlfile', 'fonttools', 'keyring',
                'keyrings.cryptfile', 'mama', 'more-itertools', 'narwhals',
                'packaging', 'pytz', 'requests', 'soupsieve', 'termcolor',
                'typing_extensions', 'tzdata', 'pycryptodome'
            }
            
            user_packages = []
            for package in all_packages:
                if (not package.startswith('_') and 
                    package not in system_packages and
                    not package.startswith('pip-') and
                    not package.startswith('setuptools') and
                    not package.startswith('argon2-') and
                    not package.startswith('jaraco.') and
                    not package.startswith('scipy') and
                    not package.startswith('psutil')):
                    user_packages.append(package)
            
            return jsonify({
                'success': True,
                'packages': user_packages,
                'all_packages': all_packages
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to list packages',
                'output': result.stderr
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/execute', methods=['POST'])
def execute_python():
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'No code provided'}), 400
        
        code = data['code']
        
        ensure_user_venv()
        python_executable = get_python_executable()
        
        # inject matplotlib plot capture code
        plot_capture_code = '''
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io
import sys

# store original stdout
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

# create global plot capture instance
_plot_capture = PlotCapture()

# override plt.show() to capture plots
original_show = plt.show
def custom_show(*args, **kwargs):
    plot_data = _plot_capture.capture_plot()
    if plot_data:
        print(f'<PLOT_DATA:{plot_data}:PLOT_DATA>')
    
plt.show = custom_show

# also capture plots at the end of execution
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
            # Execute the Python code with the user's virtual environment
            start_time = time.time()
            result = subprocess.run(
                [python_executable, temp_file_path],
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

@app.route('/api/compile-c', methods=['POST'])
def compile_c():
    """Compile and run C code"""
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'No C code provided'}), 400
        
        c_code = data['code']
        if not c_code.strip():
            return jsonify({'error': 'C code cannot be empty'}), 400
        
        # create a temporary directory for compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            # write C code to a temporary file
            c_file_path = os.path.join(temp_dir, 'main.c')
            with open(c_file_path, 'w') as f:
                f.write(c_code)
            
            # compile the C code
            executable_path = os.path.join(temp_dir, 'program')
            if os.name == 'nt':  # Windows
                executable_path += '.exe'
            
            # try to compile with gcc
            compile_result = subprocess.run(
                ['gcc', '-o', executable_path, c_file_path, '-lm'],  # -lm for math functions
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout for compilation
            )
            
            if compile_result.returncode != 0:
                return jsonify({
                    'success': False,
                    'error': 'Compilation failed',
                    'compilation_error': compile_result.stderr
                }), 400
            
            # Execute the compiled program
            try:
                run_result = subprocess.run(
                    [executable_path],
                    capture_output=True,
                    text=True,
                    timeout=10,  # 10 second timeout for execution
                    input="",  # Provide empty input to prevent hanging on scanf
                    bufsize=0  # Unbuffered I/O
                )
                
                output = run_result.stdout
                error_output = run_result.stderr
                
                # Check if the program is waiting for input
                if "Enter" in output or "scanf" in error_output.lower():
                    return jsonify({
                        'success': False,
                        'error': 'Program requires interactive input (scanf).',
                        'needs_input': True,
                        'output': output,
                        'error_output': error_output,
                        'message': 'This program uses scanf() for input. Please provide input values in the frontend.'
                    }), 400
                
                return jsonify({
                    'success': True,
                    'output': output,
                    'error_output': error_output,
                    'return_code': run_result.returncode
                })
                
            except subprocess.TimeoutExpired:
                return jsonify({
                    'success': False,
                    'error': 'Program execution timed out (10 seconds). This may be due to scanf() waiting for input.'
                }), 400
                
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Compilation timed out (30 seconds)'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/compile-c-with-input', methods=['POST'])
def compile_c_with_input():
    """Compile and run C code with interactive input support"""
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'No C code provided'}), 400
        
        c_code = data['code']
        inputs = data.get('inputs', [])  # List of input values
        if not c_code.strip():
            return jsonify({'error': 'C code cannot be empty'}), 400
        
        # create a temporary directory for compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            # write C code to a temporary file
            c_file_path = os.path.join(temp_dir, 'main.c')
            with open(c_file_path, 'w') as f:
                f.write(c_code)
            
            # Compile the C code
            executable_path = os.path.join(temp_dir, 'program')
            if os.name == 'nt':  # Windows
                executable_path += '.exe'
            
            # Try to compile with gcc
            compile_result = subprocess.run(
                ['gcc', '-o', executable_path, c_file_path, '-lm'],  # -lm for math functions
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout for compilation
            )
            
            if compile_result.returncode != 0:
                return jsonify({
                    'success': False,
                    'error': 'Compilation failed',
                    'compilation_error': compile_result.stderr
                }), 400
            
            # Execute the compiled program with input
            try:
                # Prepare input string
                input_string = '\n'.join(str(inp) for inp in inputs) + '\n'
                
                run_result = subprocess.run(
                    [executable_path],
                    capture_output=True,
                    text=True,
                    timeout=10,  # 10 second timeout for execution
                    input=input_string,
                    bufsize=0  # Unbuffered I/O
                )
                
                output = run_result.stdout
                error_output = run_result.stderr
                
                return jsonify({
                    'success': True,
                    'output': output,
                    'error_output': error_output,
                    'return_code': run_result.returncode
                })
                
            except subprocess.TimeoutExpired:
                return jsonify({
                    'success': False,
                    'error': 'Program execution timed out (10 seconds)'
                }), 400
                
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Compilation timed out (30 seconds)'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/check-c-compiler', methods=['GET'])
def check_c_compiler():
    """Check if C compiler (gcc) is available"""
    try:
        result = subprocess.run(
            ['gcc', '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            return jsonify({
                'available': True,
                'version': result.stdout.split('\n')[0]
            })
        else:
            return jsonify({
                'available': False,
                'error': 'gcc not found or not working'
            })
    except FileNotFoundError:
        return jsonify({
            'available': False,
            'error': 'gcc not installed'
        })
    except Exception as e:
        return jsonify({
            'available': False,
            'error': f'Error checking gcc: {str(e)}'
        })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Python execution service is running'})

if __name__ == '__main__':
    print("Starting Python Code Execution Backend...")
    print("Backend will be available at: http://localhost:5001")
    
    ensure_user_venv()
    print(f"User virtual environment ready at: {USER_VENV_PATH}")
    
    app.run(debug=True, host='0.0.0.0', port=5001) 