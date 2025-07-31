// C Code Helper Utilities
// This file provides utilities to help convert interactive C programs to work in the backend environment

export const convertScanfToHardcoded = (code: string): string => {
  // Common patterns to replace scanf with hardcoded values
  let convertedCode = code;

  // Replace scanf("%d", &n) with hardcoded values
  convertedCode = convertedCode.replace(
    /scanf\("%d",\s*&(\w+)\);/g,
    (match, varName) => {
      return `// ${match}\n    ${varName} = 5; // Hardcoded value instead of scanf`;
    }
  );

  // Replace scanf("%f", &var) with hardcoded values
  convertedCode = convertedCode.replace(
    /scanf\("%f",\s*&(\w+)\);/g,
    (match, varName) => {
      return `// ${match}\n    ${varName} = 3.8f; // Hardcoded value instead of scanf`;
    }
  );

  // Replace scanf(" %[^\\n]", var) with hardcoded strings
  convertedCode = convertedCode.replace(
    /scanf\(" %\[^\\n\]",\s*(\w+)\);/g,
    (match, varName) => {
      return `// ${match}\n    strcpy(${varName}, "Sample Name"); // Hardcoded value instead of scanf`;
    }
  );

  return convertedCode;
};

export const addSampleDataForStudentProgram = (code: string): string => {
  // If it's a student management program, add sample data
  if (code.includes("typedef struct") && code.includes("Student")) {
    const sampleData = `
    // Sample data for demonstration (replaces scanf input)
    Student students[] = {
        {"Alice Johnson", 20, 3.8},
        {"Bob Smith", 19, 3.5},
        {"Carol Davis", 21, 3.9},
        {"David Wilson", 20, 3.2},
        {"Eva Brown", 22, 3.7}
    };
    int n = 5; // Number of students
`;

    // Replace scanf calls with sample data
    let modifiedCode = code;

    // Replace the scanf for number of students
    modifiedCode = modifiedCode.replace(
      /printf\("Enter number of students: "\);\s*scanf\("%d",\s*&n\);/g,
      'printf("Using sample data with 5 students:\\n");'
    );

    // Replace malloc with array declaration
    modifiedCode = modifiedCode.replace(
      /Student\* students = \(Student\*\) malloc\(n \* sizeof\(Student\)\);/g,
      "// Student* students = (Student*) malloc(n * sizeof(Student)); // Replaced with array"
    );

    // Remove the inputStudents function call and replace with sample data
    modifiedCode = modifiedCode.replace(
      /inputStudents\(students,\s*n\);/g,
      "// Sample data inserted above"
    );

    // Add sample data before the sort call
    modifiedCode = modifiedCode.replace(
      /(sortByGPA\(students,\s*n\);)/g,
      `${sampleData}\n    $1`
    );

    // Replace the scanf for target GPA
    modifiedCode = modifiedCode.replace(
      /printf\("\\nEnter GPA to search: "\);\s*scanf\("%f",\s*&target\);/g,
      'printf("\\nSearching for students with GPA 3.8:\\n");\n    target = 3.8f;'
    );

    // Remove the free call since we're using stack array
    modifiedCode = modifiedCode.replace(
      /free\(students\);/g,
      "// free(students); // Not needed for stack array"
    );

    return modifiedCode;
  }

  return code;
};

export const getCommonCFixes = (): string => {
  return `// Common fixes for C programs in this environment:

// 1. Replace scanf() with hardcoded values:
// scanf("%d", &n); → n = 5;

// 2. Replace interactive input with sample data:
// printf("Enter name: "); scanf("%s", name); → strcpy(name, "Sample");

// 3. Use arrays instead of malloc for small data:
// Student* students = malloc(n * sizeof(Student)); → Student students[5];

// 4. Add proper includes:
// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include <math.h> // for math functions

// 5. Define constants:
// #define MAX_SIZE 100

// 6. Use proper string handling:
// strcpy() for string assignment
// strcat() for string concatenation
// strlen() for string length`;
};

export const detectScanfUsage = (code: string): boolean => {
  return code.includes("scanf(");
};

export const suggestFixes = (code: string): string[] => {
  const suggestions: string[] = [];

  if (detectScanfUsage(code)) {
    suggestions.push(
      "Replace scanf() calls with hardcoded values or sample data"
    );
    suggestions.push("Use arrays instead of malloc for small datasets");
    suggestions.push("Add proper error handling for memory allocation");
  }

  if (code.includes("malloc(") && !code.includes("free(")) {
    suggestions.push("Add free() calls to prevent memory leaks");
  }

  if (code.includes("printf(") && !code.includes("#include <stdio.h>")) {
    suggestions.push("Add #include <stdio.h> for printf functions");
  }

  if (code.includes("malloc(") && !code.includes("#include <stdlib.h>")) {
    suggestions.push("Add #include <stdlib.h> for malloc functions");
  }

  return suggestions;
};
