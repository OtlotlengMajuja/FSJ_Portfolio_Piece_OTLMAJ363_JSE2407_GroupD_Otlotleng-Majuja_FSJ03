import { useState } from 'react';
import { signUp } from '../authFunctions';

/**
 * SignUp component for user registration
 * @returns {JSX.Element} Sign-up form
 */
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    /**
     * Handles form submission for sign-up
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            alert('Sign-Up Successful');
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign Up</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default SignUp;
