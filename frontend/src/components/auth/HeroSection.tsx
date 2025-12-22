/**
 * HeroSection Component - Login Page Left Side
 * 
 * Features:
 * - Gradient background with animated blur circles
 * - Brand logo and tagline
 * - Hero heading and description
 * - Feature highlights list
 * - Footer copyright
 * - Hidden on mobile/tablet (< lg breakpoint)
 */

import { CheckCircleFilled } from '@ant-design/icons';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface Feature {
  icon: string;
  text: string;
}

const features: Feature[] = [
  { icon: '✓', text: 'Real-time collaboration' },
  { icon: '✓', text: 'Task tracking & analytics' },
  { icon: '✓', text: 'Seamless team communication' },
];

/**
 * HeroSection Component
 */
export const HeroSection: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
        <div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse-soft" 
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-soft" 
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Logo/Brand */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <CheckCircleFilled className="text-2xl text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TaskFlow</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 space-y-6">
        <Title level={1} className="!text-white !text-5xl !leading-tight !mb-4">
          Manage Your<br />Projects with Ease
        </Title>
        <Text className="text-white/90 text-lg leading-relaxed block max-w-md">
          Streamline your workflow, collaborate with your team, and deliver projects on time with our powerful project management platform.
        </Text>
        
        {/* Features List */}
        <div className="space-y-4 mt-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 text-white/90">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-sm font-semibold">{feature.icon}</span>
              </div>
              <span className="text-base">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-white/70 text-sm">
        © 2024 TaskFlow. All rights reserved.
      </div>
    </div>
  );
};

export default HeroSection;
