# Python Code Execution Backend

A simple Flask API that executes Python code safely and returns the output.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
python app.py
```

The server will start on `http://localhost:5001` (for local development)

**Note**: The frontend is configured to use environment variables for the backend URL.

- Production: `https://browser-ide.vercel.app`
- Development: `http://localhost:5001`

## API Endpoints

### POST /api/execute

Execute Python code

**Request:**

```json
{
  "code": "print('Hello, World!')"
}
```

**Response:**

```json
{
  "output": "Hello, World!\n",
  "error": "",
  "exit_code": 0,
  "execution_time": 0.001
}
```

### GET /api/health

Check if the service is running

**Response:**

```json
{
  "status": "healthy",
  "message": "Python execution service is running"
}
```
