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
    <header
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left side - App title */}
      <div>
        <Text
          strong
          style={{
            fontSize: '20px',
            color: '#fff',
          }}
        >
          Internal Project Management
        </Text>
      </div>

      {/* Right side - User info and logout */}
      <Space size="middle">
        {currentUser && (
          <>
            <Space>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#fff', color: '#764ba2' }} />
              <Text style={{ color: '#fff', fontWeight: 500 }}>
                {currentUser.username}
              </Text>
            </Space>
            <Button
              type="default"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
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
