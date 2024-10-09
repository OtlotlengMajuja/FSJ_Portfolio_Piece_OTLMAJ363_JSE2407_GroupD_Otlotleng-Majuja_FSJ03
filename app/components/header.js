'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import { signIn, signOutUser, signUp } from '../lib/authService';
import Loading from '../loading';
import { RiUser3Line, RiLoginBoxLine, RiLogoutBoxRLine } from 'react-icons/ri';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';


/**
 * Header component for the e-commerce site.
 * This component displays the site logo and a navigation menu with links to 
 * different pages such as Home, About Us, and Cart.
 *
 * @returns {JSX.Element} The header component containing a logo and navigation links.
 */
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [authError, setAuthError] = useState(null);

    const { user, loading } = useAuth();

    const handleSignIn = async (email, password) => {
        try {
            await signIn(email, password);
            setIsSignInModalOpen(false); // Close the modal on successful sign-in
            setAuthError(null);
        } catch (error) {
            console.error("Sign-in error:", error);
            setAuthError(error.message || "An error occurred during sign-in. Please try again.");
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
            setAuthError(null);
        } catch (error) {
            console.error("Sign-out error:", error);
            setAuthError("Failed to sign out. Please try again.");
        }
    };

    const handleSignUp = async (email, password) => {
        try {
            await signUp(email, password);
            setIsSignUpModalOpen(false); // Close the modal on successful sign-up
            setAuthError(null);
        } catch (error) {
            console.error("Sign-up error:", error);
            setAuthError(error.message || "An error occurred during sign-up. Please try again.");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <header className="bg-primary shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo and link to the home page */}
                <Link href="/" className="flex items-center">
                    <span className="font-['Anek_Devanagari'] text-3xl text-white">Curated Finds Boutique</span>
                </Link>

                {/* Hamburger menu button for mobile */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white sm:hidden"
                >
                    ☰
                </button>

                {/* Auth buttons */}
                {user ? (
                    <div className="flex items-center space-x-4">
                        <RiUser3Line className="text-white text-2xl" />
                        <button onClick={handleSignOut} className="text-white flex items-center space-x-1 hover:text-primary-dark transition-colors duration-300">
                            <RiLogoutBoxRLine />
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSignInModalOpen(true)} className="text-white flex items-center space-x-1 hover:text-primary-dark transition-colors duration-300">
                            <RiLoginBoxLine />
                            <span>Sign In</span>
                        </button>
                        <button onClick={() => setIsSignUpModalOpen(true)} className="text-white flex items-center space-x-1 hover:text-primary-dark transition-colors duration-300">
                            <span>Sign Up</span>
                        </button>
                    </div>
                )}

                {/* Navigation links */}
                <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
                    <ul className="flex space-x-6">
                        {/* Home page link */}
                        <li>
                            <Link href="/" className="text-white hover:text-primary-dark transition-colors duration-300">
                                Home
                            </Link>
                        </li>
                        {/* About Us page link */}
                        <li>
                            <Link href="/about" className="text-white hover:text-primary-dark transition-colors duration-300">
                                About Us
                            </Link>
                        </li>
                        {/* Cart page link */}
                        <li>
                            <Link href="/cart" className="text-white hover:text-primary-dark transition-colors duration-300">
                                Cart
                            </Link>
                        </li>
                        {/* Privacy policy link */}
                        <li>
                            <Link href="/privacy" className="text-white hover:text-primary-dark transition-colors duration-300">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Error message */}
            {authError && (
                <div className="bg-red-500 text-white p-2 text-center">
                    {authError}
                </div>
            )}

            {/* Modals */}
            {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} onSignIn={handleSignIn} />}
            {isSignUpModalOpen && <SignUpModal onClose={() => setIsSignUpModalOpen(false)} onSignUp={handleSignUp} />}
        </header>
    );
}
