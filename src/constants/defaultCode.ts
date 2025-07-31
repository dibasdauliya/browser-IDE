export const DEFAULT_PYTHON_CODE = `import math
import requests
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

print("Welcome to the Python Browser IDE!")
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
    
    print("Plot displayed above!")

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

print(f"\\nCalculation results:")
print(f"10 + 20 = {result}")
print(f"Fibonacci(10) = {fib_10}")
print(f"π = {math.pi:.4f}")

print(f"\\nCreating sample plot...")
create_sample_plot()

print(f"\\nInteractive input example:")
interactive_example()

print(f"\\nNetwork request example:")
print(fetch_api_data())

print(f"\\nTips:")
print("- matplotlib plots display inline in the output panel")
print("- input() works with browser prompts (prompt dialogs)")
print("- SSL warnings are automatically suppressed")
print("- Common packages (requests, numpy, matplotlib) are pre-installed")
print("- Missing packages are auto-installed when imported")
print("- Upload/download files using the File Explorer")
`;

export const DEFAULT_C_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

// Example 1: Basic C program structure
int main() {
    printf("Welcome to the C Browser IDE!\\n");
    
    // Example 2: Variables and data types
    int number = 42;
    float pi = 3.14159f;
    char message[] = "Hello, C!";
    
    printf("Number: %d\\n", number);
    printf("Pi: %.5f\\n", pi);
    printf("Message: %s\\n", message);
    
    // Example 3: Arrays and loops
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    
    printf("\\nArray elements: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
        sum += numbers[i];
    }
    printf("\\nSum: %d\\n", sum);
    
    // Example 4: Functions
    int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    
    printf("\\nFactorial of 5: %d\\n", factorial(5));
    
    // Example 5: Pointers
    int x = 10;
    int *ptr = &x;
    
    printf("\\nPointer example:\\n");
    printf("Value of x: %d\\n", x);
    printf("Address of x: %p\\n", (void*)&x);
    printf("Value at ptr: %d\\n", *ptr);
    
    // Example 6: Dynamic memory allocation
    int *dynamic_array = (int*)malloc(5 * sizeof(int));
    if (dynamic_array != NULL) {
        for (int i = 0; i < 5; i++) {
            dynamic_array[i] = i * 2;
        }
        
        printf("\\nDynamic array: ");
        for (int i = 0; i < 5; i++) {
            printf("%d ", dynamic_array[i]);
        }
        printf("\\n");
        
        free(dynamic_array);
    }
    
    // Example 7: Math functions
    printf("\\nMath functions:\\n");
    printf("Square root of 16: %.2f\\n", sqrt(16));
    printf("Power 2^8: %.0f\\n", pow(2, 8));
    printf("Sine of 90 degrees: %.4f\\n", sin(90 * M_PI / 180));
    
    // Example 8: String operations
    char str1[] = "Hello";
    char str2[] = "World";
    char result[50];
    
    strcpy(result, str1);
    strcat(result, " ");
    strcat(result, str2);
    
    printf("\\nString concatenation: %s\\n", result);
    printf("Length of result: %zu\\n", strlen(result));
    
    printf("\\nC program completed successfully!\\n");
    return 0;
}`;
