export const DEFAULT_PYTHON_CODE = `import math
import requests
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

print("🚀 Welcome to the Python Browser IDE!")
print(f"Current time: {datetime.now()}")

# Example 1: Basic calculations
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

class Calculator:
    def __init__(self, name):
        self.name = name
    
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

# Example 2: Working with data structures
squares = [x**2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")

dictionary = {
    "fruit": "apple",
    "color": "red", 
    "number": 10
}

for key, value in dictionary.items():
    print(f"{key}: {value}")

# Example 3: Data visualization with matplotlib
def create_sample_plot():
    """
    Create a sample matplotlib plot that displays inline in the output.
    """
    # Create sample data
    x = np.linspace(0, 10, 100)
    y1 = np.sin(x)
    y2 = np.cos(x)
    
    # Create the plot
    plt.figure(figsize=(10, 6))
    plt.plot(x, y1, label='sin(x)', linewidth=2)
    plt.plot(x, y2, label='cos(x)', linewidth=2)
    plt.title('Sample Plot: Sine and Cosine Functions')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Show the plot (will display inline in output)
    plt.show()
    
    print("📊 Plot displayed above!")

# Example 4: User input (works with browser prompts)
def interactive_example():
    """
    Example showing how input() works in the browser environment.
    Uncomment the lines below to try it!
    """
    # name = input("What's your name? ")
    # age = input("What's your age? ")
    # print(f"Hello {name}! You are {age} years old.")
    print("Interactive example ready - uncomment the lines above to try input()!")

# Example 5: Network requests (SSL warnings suppressed)
def fetch_api_data():
    """
    Example of making HTTP requests with proper error handling.
    SSL warnings are automatically suppressed for better UX.
    """
    try:
        # Example API call - replace with your own URL
        response = requests.get("https://httpbin.org/json", timeout=10)
        response.raise_for_status()
        data = response.json()
        return f"API Response: {data}"
    except requests.exceptions.RequestException as e:
        return f"Request failed: {e}"
    except Exception as e:
        return f"Unexpected error: {e}"

# Run examples
calc = Calculator("MyCalc")
result = calc.add(10, 20)
fib_10 = calculate_fibonacci(10)

print(f"\\n📊 Calculation results:")
print(f"10 + 20 = {result}")
print(f"Fibonacci(10) = {fib_10}")
print(f"π = {math.pi:.4f}")

print(f"\\n📈 Creating sample plot...")
create_sample_plot()

print(f"\\n🎯 Interactive input example:")
interactive_example()

print(f"\\n🌐 Network request example:")
print(fetch_api_data())

print(f"\\n💡 Tips:")
print("- matplotlib plots display inline in the output panel")
print("- input() works with browser prompts (prompt dialogs)")
print("- SSL warnings are automatically suppressed")
print("- Common packages (requests, numpy, matplotlib) are pre-installed")
print("- Missing packages are auto-installed when imported")
print("- Upload/download files using the File Explorer")
`;
