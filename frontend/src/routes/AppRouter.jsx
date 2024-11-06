import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nutrition from '../Pages/Nutrition';
import CustomerManagement from '../components/CustomerManagement.jsx';
import DietCategory from '../Pages/DietCategory.jsx';
import Diet from '../Pages/Diet.jsx';
import Dashboard from '../Pages/Dashboard.jsx';
import Profile from '../Pages/Profile.jsx';


const AppRouter = () => {
  const { setPageTitle } = usePageTitle(); // Access the context
  const location = useLocation(); // Track route changes

  useEffect(() => {
    // Update title on route change
    const pageTitleMap = {
      '/dashboard': 'Dashboard',
      '/customers': 'Customers',
      '/nutrition': 'Nutrition',
      '/dietcategory': 'Diet Category',
      '/diet': 'Diet Plans',
      '/profile': 'Profile',
    };
    const title = pageTitleMap[location.pathname] || 'Dashboard';
    setPageTitle(title); // Update context title
    document.title = `GymFuel - ${title}`; // Update browser tab title
  }, [location, setPageTitle]);


  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/nutrition/*" element={<Nutrition />} />
        <Route path="/dietcategory/*" element={<DietCategory />} />
        <Route path="/diets/*" element={<Diet />} />
        <Route path="/profile/*" element={<Profile />} />


      </Routes>
    </Router>
  );
};
export default AppRouter;
