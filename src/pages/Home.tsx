import { Link } from "react-router-dom";
import { Code, Terminal, ArrowRight, Github, Globe } from "lucide-react";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-800 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
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

        <main className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Python IDE Card */}
            <Link
              to="/python"
              className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-600 p-3 rounded-xl mr-4 group-hover:bg-green-500 transition-colors">
                  <Terminal className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Python IDE
                  </h2>
                  <p className="text-gray-400">
                    Full-featured Python environment
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Complete Python runtime with Pyodide
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Auto-install packages
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Inline matplotlib plots
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  File upload/download support
                </li>
              </ul>

              <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="font-medium">Start coding in Python</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Web Playground Card */}
            <Link
              to="/web"
              className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-600 p-3 rounded-xl mr-4 group-hover:bg-purple-500 transition-colors">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Web Playground
                  </h2>
                  <p className="text-gray-400">
                    HTML, CSS & JavaScript environment
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Live HTML/CSS/JS preview
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Real-time code updates
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Responsive design testing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Multi-file project support
                </li>
              </ul>

              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="font-medium">Build web projects</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          <footer className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <a
                href="https://github.com/dibasdauliya/web-IDE"
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
            <p className="text-gray-500">
              Built with React, TypeScript, and modern web technologies.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
