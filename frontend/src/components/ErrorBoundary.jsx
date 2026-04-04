import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-bg-card rounded-3xl p-10 border border-border shadow-lg">
              <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={36} className="text-brand" />
              </div>
              <h1 className="text-2xl font-black text-text-primary mb-3">
                Something went wrong
              </h1>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-6 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary font-bold text-sm hover:bg-bg-tertiary transition-all"
                >
                  <RefreshCw size={16} />
                  Reload
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-light transition-all"
                >
                  <Home size={16} />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
