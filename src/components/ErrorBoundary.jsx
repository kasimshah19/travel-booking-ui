import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console (to be replaced with Sentry in Phase 4)
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-xl max-w-lg shadow-sm border border-red-200 dark:border-red-800">
                        <h2 className="text-xl font-display font-semibold mb-2">Something went wrong</h2>
                        <p className="text-sm opacity-80 mb-6">
                            An unexpected error occurred while loading this page. Our team has been notified.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
