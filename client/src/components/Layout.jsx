import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <Header />
      <Navbar />
      <main className="w-full flex-1 bg-slate-50">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
