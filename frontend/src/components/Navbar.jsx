
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const {user, logout} = useUserStore();
  const isAdmin = user?.role === "admin"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {cart} = useCartStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-900 bg-opacity-90 backdrop-blur-sm shadow-lg z-40 transition-all duration-300 border-b border-blue-900">
      <div className="container mx-auto px-4 py-3">
        <div className='flex justify-between items-center'>
        <Link
          to="/"
          className="text-2xl font-bold text-blue-200 items-center flex space-x-2"
        >
         <img src="/Logo-T-Shirt.png" alt="" width={150} height={50}/>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-white hover:text-blue-400 transition duration-300 ease-in-out">
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              className="text-white hover:text-blue-400 relative group transition duration-300 ease-in-out"
            >
              <ShoppingCart size={18} className="inline-block mx-1 align-baseline" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (<span className="absolute -top-3 -left-2 bg-blue-500 text-blue-100 rounded-full px-1 py-0.1 group-hover:bg-blue-600 transition duration-300 ease-in-out">
                {cart.length}
              </span>)}
            </Link>
          )}

          {isAdmin && (
            <Link className=" bg-gray-900 hover:bg-blue-300 rounded-md text-blue-400 hover:text-blue-900 py-2 px-4 flex items-center transition duration-300 ease-in-out" to={"/secret-dashboard"}>
              <Lock size={18} className="inline-block mx-1 align-baseline " />
              <span className='hidden sm:inline'>Dashboard</span>
            </Link>
          )}

          {user ? (
                <button className="bg-blue-600 hover:bg-blue-300 rounded-md text-white hover:text-blue-600 py-2 px-4 flex items-center transition duration-300 ease-in-out"
                onClick={logout}>
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
          ) : (
                <>
                        <Link
                        to={"/signup"}
                        className="bg-blue-600 hover:bg-blue-300 rounded-md text-white hover:text-blue-600 py-2 px-4 flex items-center transition duration-300 ease-in-out"
                            >
                <UserPlus className="ml-2" size={18} />
                <span className="hidden sm:inline ml-2">Sign Up</span>
                </Link>
                <Link
                to={"/login"}
                className="bg-blue-200 hover:bg-blue-600 rounded-md text-blue-600 hover:text-blue-200 py-2 px-4 flex items-center transition duration-300 ease-in-out"
                >
                <LogIn size={18} />
                <span className="hidden sm:inline ml-2">Log In</span>
                </Link> 
                </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-white hover:text-blue-400 focus:outline-none focus:text-blue-400 transition duration-300"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="px-4 pt-2 pb-4 bg-gradient-to-134 from-blue-800 to-blue-600 backdrop-blur-sm border-t border-blue-800" 
             >
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition duration-300 ease-in-out py-2 px-3 rounded-md hover:bg-blue-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                className="text-white hover:text-blue-400 transition duration-300 ease-in-out py-2 px-3 rounded-md hover:bg-blue-800 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart size={18} className="mr-2" />
                <span>Cart</span>
                <span className="ml-auto bg-blue-500 text-blue-100 rounded-full px-2 py-0.5 text-sm">
                  {cart.length}
                </span>
              </Link>
            )}

            {isAdmin && (
              <Link 
                className="bg-gray-900 hover:bg-blue-300 rounded-md text-blue-400 hover:text-blue-900 py-2 px-3 flex items-center transition duration-300 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Lock size={18} className="mr-2" />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button 
                className="bg-blue-600 hover:bg-blue-300 rounded-md text-white hover:text-blue-600 py-2 px-3 flex items-center transition duration-300 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut size={18} className="mr-2" />
                <span>Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-blue-600 hover:bg-blue-300 rounded-md text-white hover:text-blue-600 py-2 px-3 flex items-center transition duration-300 ease-in-out"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus size={18} className="mr-2" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  to={"/login"}
                  className="bg-blue-200 hover:bg-blue-600 rounded-md text-blue-600 hover:text-blue-200 py-2 px-3 flex items-center transition duration-300 ease-in-out"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  <span>Log In</span>
                </Link> 
              </>
            )}
          </div>
        </nav>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
