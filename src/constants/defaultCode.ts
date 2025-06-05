export const DEFAULT_PYTHON_CODE = `# Welcome to Python Browser IDE! 🐍
import math
from datetime import datetime

# Variables and basic types
name = "Pyodide"
version = 2024
pi_value = 3.14159
is_awesome = True

print(f"Hello from {name}! 🚀")
print(f"Current time: {datetime.now()}")

# Function definition
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Class definition
class Calculator:
    def __init__(self, name):
        self.name = name
    
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

# Main execution
if __name__ == "__main__":
    # Create calculator instance
    calc = Calculator("MyCalc")
    
    # List comprehension
    squares = [x**2 for x in range(1, 6)]
    print(f"Squares: {squares}")
    
    # Dictionary
    colors = {
        "red": "#FF0000",
        "green": "#00FF00", 
        "blue": "#0000FF"
    }
    
    # Loop through dictionary
    for color, hex_code in colors.items():
        print(f"{color}: {hex_code}")
    
    # Calculate some values
    result = calc.add(10, 20)
    fib_10 = calculate_fibonacci(10)
    
    print(f"\\nCalculation results:")
    print(f"10 + 20 = {result}")
    print(f"Fibonacci(10) = {fib_10}")
    print(f"π = {math.pi:.4f}")
`;
