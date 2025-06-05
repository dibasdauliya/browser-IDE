import { Link } from "react-router-dom";
import { Code, Play, Terminal, ArrowRight, Github } from "lucide-react";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl mr-4">
              <Code className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Browser IDE
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Run code directly in your browser with zero setup. No downloads, no
            installations - just pure coding experience.
          </p>
        </header>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Python IDE Card */}
          <Link
            to="/python"
            className="group bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-blue-500 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-3 rounded-lg mr-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Python IDE</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Full-featured Python environment powered by Pyodide. Run Python
              code with scientific libraries support.
            </p>
            <div className="flex items-center text-blue-400 group-hover:text-blue-300">
              <span className="mr-2">Launch Python IDE</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              ✓ Numpy, Pandas, Matplotlib support
              <br />
              ✓ Real-time code execution
              <br />✓ Syntax highlighting & auto-completion
            </div>
          </Link>

          {/* Coming Soon Cards */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 opacity-60">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-600 p-3 rounded-lg mr-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">JavaScript IDE</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Modern JavaScript environment with Node.js capabilities. Coming
              soon...
            </p>
            <div className="text-gray-500">
              <span>Coming Soon</span>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 opacity-60">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 p-3 rounded-lg mr-4">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">More Languages</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Additional programming languages and environments. Coming soon...
            </p>
            <div className="text-gray-500">
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Why Browser IDE?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero Setup</h3>
              <p className="text-gray-400">
                Start coding immediately without any downloads or installations.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="bg-green-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Full Featured</h3>
              <p className="text-gray-400">
                Complete IDE experience with syntax highlighting,
                auto-completion, and more.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="bg-purple-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Execution</h3>
              <p className="text-gray-400">
                Run your code instantly and see results in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400">
          <div className="flex items-center justify-center mb-4">
            <Github className="w-5 h-5 mr-2" />
            <span>Open Source Browser IDE</span>
          </div>
          <p className="text-sm">
            Built with React, TypeScript, and modern web technologies.
          </p>
        </footer>
      </div>
    </div>
  );
};
