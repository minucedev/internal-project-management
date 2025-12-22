/**
 * Header Component
 * 
 * Main application header with:
 * - User information display
 * - Logout button
 * - Navigation (future enhancement)
 * 
 * Handles logout flow:
 * 1. Dispatch logout action to clear Redux state
 * 2. Clear localStorage via tokenService (handled by logout reducer)
 * 3. Redirect to /login page
 */

import { useNavigate } from 'react-router-dom';
import { Button, Space, Typography, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

const { Text } = Typography;

/**
 * Header Component
 * 
 * Displays user information and provides logout functionality.
 * Only shown to authenticated users.
 */
export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  /**
   * Handle logout button click
   * 
   * Steps:
   * 1. Dispatch logout action (clears Redux state and localStorage)
   * 2. Call authService.logout() for potential backend call
   * 3. Redirect to login page
   */
  const handleLogout = () => {
    console.log('🔓 Logging out user:', currentUser?.username);
    
    // Dispatch logout action to clear state and localStorage
    dispatch(logout());
    
    // Redirect to login page
    navigate('/login', { replace: true });
    
    console.log('✅ Logout successful, redirected to /login');
  };

  return (
    <header className="bg-gradient-primary py-4 px-6 shadow-card flex justify-between items-center">
      {/* Left side - App title */}
      <div>
        <Text
          strong
          className="text-xl text-white"
        >
          Internal Project Management
        </Text>
      </div>

      {/* Right side - User info and logout */}
      <Space size="middle">
        {currentUser && (
          <>
            <Space>
              <Avatar icon={<UserOutlined />} className="bg-white text-secondary-600" />
              <Text className="text-white font-medium">
                {currentUser.username}
              </Text>
            </Space>
            <Button
              type="default"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30"
            >
              Logout
            </Button>
          </>
        )}
      </Space>
    </header>
  );
};

export default Header;
