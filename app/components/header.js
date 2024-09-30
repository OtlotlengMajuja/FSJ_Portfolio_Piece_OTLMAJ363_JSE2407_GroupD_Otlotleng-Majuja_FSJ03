import Link from 'next/link';

/**
 * Header component for the e-commerce site.
 * This component displays the site logo and a navigation menu with links to 
 * different pages such as Home, About Us, and Cart.
 *
 * @returns {JSX.Element} The header component containing a logo and navigation links.
 */
export default function Header() {
    return (
        <header className="bg-primary shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo and link to the home page */}
                <Link href="/" className="flex items-center">
                    <span className="font-['Anek_Devanagari'] text-3xl text-white">Shopporium</span>
                </Link>

                {/* Navigation links */}
                <nav>
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
                    </ul>
                </nav>
            </div>
        </header>
    );
}
