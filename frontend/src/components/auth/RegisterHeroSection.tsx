/**
 * RegisterHeroSection Component - Left side for Register page
 * - Gradient background from secondary to primary
 * - Animated blur circles
 * - Brand logo and heading
 * - Benefits list with emoji icons
 * - Hidden on mobile (<lg)
 */

import { CheckCircleFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const benefits = [
  { icon: '🚀', title: 'Get started in minutes', desc: 'Quick and easy setup' },
  { icon: '💎', title: 'Free forever plan', desc: 'No credit card required' },
  { icon: '🔒', title: 'Enterprise-grade security', desc: 'Your data is safe with us' },
];

const RegisterHeroSection: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-secondary-600 via-primary-600 to-primary-700 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-soft"
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
          Start Your<br />Journey Today
        </Title>
        <Text className="text-white/90 text-lg leading-relaxed block max-w-md">
          Join thousands of teams already using TaskFlow to streamline their projects and boost productivity.
        </Text>

        <div className="space-y-4 mt-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 text-white/90">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-lg">
                <span>{benefit.icon}</span>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">{benefit.title}</p>
                <p className="text-sm text-white/80">{benefit.desc}</p>
              </div>
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

export default RegisterHeroSection;
