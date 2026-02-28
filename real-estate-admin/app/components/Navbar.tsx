import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    Real Estate Admin
                </div>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white">
                        Home
                    </Link>
                    <Link href="/admin" className="text-gray-300 hover:text-white">
                        Admin Panel
                    </Link>
                    <Link href="/admin/projects" className="text-gray-300 hover:text-white">
                        Projects
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;