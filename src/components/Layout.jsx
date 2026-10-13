import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import '../styles/global.css';

const Layout = () => {
  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="app-content" style={{ flex: 1, minWidth: 0, marginLeft: '280px' }}>
        <Header />
        <main className="app-main" style={{ paddingTop: '96px', paddingBottom: '32px', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
