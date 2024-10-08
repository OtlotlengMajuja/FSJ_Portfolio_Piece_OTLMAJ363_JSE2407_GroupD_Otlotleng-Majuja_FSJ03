import { useState } from 'react';
import { signIn } from '../lib/authService';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            alert('Sign-In Successful');
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign In</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default SignIn;