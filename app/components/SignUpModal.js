import { useState } from 'react';

const SignUpModal = ({ onClose, onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await onSignUp(email, password);
            setSuccess('Sign-up successful! Please log in.');
            setEmail('');
            setPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                    >
                        Sign Up
                    </button>
                </form>
                <button onClick={onClose} className="mt-4 text-black hover:text-primary-dark">Close</button>
            </div>
        </div>
    );
};

export default SignUpModal;