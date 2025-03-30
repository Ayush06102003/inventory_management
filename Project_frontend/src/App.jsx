import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, Dashboard, AddAdmin, AddDepartment, Department } from './Pages';
import { ForgotPassword, ResetPassword, Sidebar } from './Components';
import PrivateRoute from './routing/PrivateRoute';
import { ContractProvider } from './Hooks/UseContractContext';

const App = () => {
  return (
    <div className='w-full'>
      <BrowserRouter>
        <ContractProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="flex">
                    <Sidebar />
                    <div className="flex-1">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/addadmin" element={<AddAdmin />} />
                        <Route path='/adddepartment' element={<AddDepartment />} />
                        <Route path='/department/:departmentAddress' element={<Department />} />
                      </Routes>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </ContractProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
