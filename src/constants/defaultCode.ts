export const DEFAULT_PYTHON_CODE = `
import math
from datetime import datetime

print(f"Hello!")
print(f"Current time: {datetime.now()}")

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

if __name__ == "__main__":
    calc = Calculator("MyCalc")
    
    squares = [x**2 for x in range(1, 6)]
    print(f"Squares: {squares}")
    
    dictionary = {
        "fruit": "apple",
        "color": "red",
        "number": 10
    }
    
    for key, value in dictionary.items():
        print(f"{key}: {value}")
    
    result = calc.add(10, 20)
    fib_10 = calculate_fibonacci(10)
    
    print(f"\\nCalculation results:")
    print(f"10 + 20 = {result}")
    print(f"Fibonacci(10) = {fib_10}")
    print(f"π = {math.pi:.4f}")
`;
