import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Layout actually contain the sidebar , navbar and the main content(notification, chat, friends... etc)
const Layout = ({ children, showSidebar = false }) => {

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>  {/*  we accept the HomePage as the children and render it here */}
        </div>
      </div>
    </div>
  );
};


export default Layout;