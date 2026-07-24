'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotificationsPage() {
  const { language, isRtl } = useLanguage();

  const notifications = [
    {
      id: 1,
      title: language === 'ar' ? 'مرحباً بك في منصة ليرنوف الأكاديمية' : 'Welcome to LearnNov Platform',
      date: language === 'ar' ? 'منذ ساعة' : '1 hour ago',
      read: true,
      icon: '🚀'
    },
    {
      id: 2,
      title: language === 'ar' ? 'تم تأكيد طلب التقديم على الدبلوم العالي' : 'Higher Diploma Application Confirmed',
      date: language === 'ar' ? 'منذ يومين' : '2 days ago',
      read: false,
      icon: '🎓'
    }
  ];

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="section-title text-gradient">
        {language === 'ar' ? '🔔 مركز الإشعارات والتنبيهات' : '🔔 Notification Center'}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {notifications.map(item => (
          <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{item.date}</p>
            </div>
            {!item.read && (
              <span className="badge level" style={{ fontSize: '0.75rem' }}>
                {language === 'ar' ? 'جديد' : 'New'}
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
