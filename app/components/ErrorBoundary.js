import React from "react";

/**
 * @class ErrorBoundary
 * @extends {React.Component}
 * @description A React component that catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
    /**
     * @constructor
     * @param {Object} props - The properties passed to the component
     */
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * @static
     * @param {Error} error - The error that was caught
     * @returns {Object} New state to be used for rendering
     */
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    /**
     * @param {Error} error - The error that was caught
     * @param {Object} errorInfo - Component stack trace information
     */
    componentDidCatch(error, errorInfo) {
        console.log('Error:', error, errorInfo);
    }

    /**
     * @returns {React.ReactNode} The child components or error UI
     */
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1>Something went wrong.</h1>
                    <button onClick={() => this.setState({ hasError: false })}>Try again</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary
