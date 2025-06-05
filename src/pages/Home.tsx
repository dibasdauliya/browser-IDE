import { Link } from "react-router-dom";
import { Code, Play, Terminal, ArrowRight, Github } from "lucide-react";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-800 to-gray-800 text-white">
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
            className="group bg-gray-700 border border-gray-600 rounded-xl p-8 hover:border-blue-500 hover:bg-gray-650 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-3 rounded-lg mr-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Python IDE</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Full-featured Python environment. Run Python code with scientific
              libraries support.
            </p>
            <div className="flex items-center text-blue-400 group-hover:text-blue-300">
              <span className="mr-2">Launch Python IDE</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4 text-sm text-gray-400">
              ✓ Numpy, Pandas, Matplotlib support
              <br />
              ✓ Real-time code execution
              <br />✓ Syntax highlighting & auto-completion
            </div>
          </Link>
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
