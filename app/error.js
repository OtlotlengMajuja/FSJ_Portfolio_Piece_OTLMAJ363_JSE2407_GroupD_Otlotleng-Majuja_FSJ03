'use client';

/**
 * Error component that displays an error message and provides a button to retry the operation.
 *
 * @param {Object} props - The properties passed to the Error component.
 * @param {Error} props.error - The error object that contains details about what went wrong.
 * @param {Function} props.reset - The function to call to retry or reset the operation.
 * @returns {JSX.Element} A JSX element displaying the error message and a retry button.
 */
export default function Error({ error, reset }) {
    return (
        <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
            <div className="card p-8 text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">Something went wrong..</h2>
                <p className="text-secondary mb-6">{error.message}</p>
                {/* Button to retry the operation */}
                <button onClick={reset} className="btn btn-primary">Please try again later</button>
            </div>
        </div>
    );
}
