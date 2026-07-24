'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { userName, userRole, accessToken } = useAuth();
  const { language, t, isRtl } = useLanguage();

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="glass-panel profile-header">
        <div className="profile-avatar">
          {userName ? userName.charAt(0) : '👤'}
        </div>
        <div className="profile-info">
          <h1>{userName || (language === 'ar' ? 'طالب ليرنوف' : 'LearnNov Student')}</h1>
          <p>{userRole === 'instructor' ? (language === 'ar' ? 'عضو هيئة تدريس' : 'Instructor') : (language === 'ar' ? 'طالب أكاديمي' : 'Academic Student')}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }} className="text-gradient">
          {language === 'ar' ? 'إعدادات الحساب والخصوصية' : 'Account & Privacy Settings'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>{language === 'ar' ? 'اسم المستخدم الكامل' : 'Full Name'}</label>
            <input type="text" value={userName || ''} readOnly />
          </div>
          <div className="form-group">
            <label>{language === 'ar' ? 'نوع الحساب' : 'Account Type'}</label>
            <input type="text" value={userRole || 'student'} readOnly />
          </div>
          <div className="form-group">
            <label>{language === 'ar' ? 'لغة الواجهة المريحة' : 'Preferred Language'}</label>
            <input type="text" value={language === 'ar' ? 'العربية (AR)' : 'English (EN)'} readOnly />
          </div>
          <div className="form-group">
            <label>{language === 'ar' ? 'حالة التوثيق الأمنية' : 'Security Status'}</label>
            <input type="text" value={accessToken ? (language === 'ar' ? 'موثق عبر JWT' : 'Authenticated via JWT') : 'غير موثق'} readOnly />
          </div>
        </div>
      </div>
    </main>
  );
}
