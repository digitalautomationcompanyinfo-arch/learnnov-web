'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, isRtl } = useLanguage();

  return (
    <footer 
      dir={isRtl ? 'rtl' : 'ltr'} 
      style={{
        backgroundColor: '#0B0F19',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94A3B8',
        padding: '3rem 1.5rem 1.5rem',
        marginTop: '4rem',
        fontFamily: 'Cairo, sans-serif'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        
        {/* Col 1: Platform Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFF', fontSize: '1.1rem' }}>
              LN
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>LearnNov Platform</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            {language === 'ar' 
              ? 'المنصة الأكاديمية السحابية المتقدمة لهندسة الذكاء الاصطناعي، الأمن السيبراني، وتطوير تطبيقات الويب الفائقة.' 
              : 'The advanced cloud academic platform for AI Engineering, Cybersecurity, and Next.js Web Development.'}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ color: '#FFF', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>
            {language === 'ar' ? 'الروابط السريعة' : 'Quick Navigation'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? '🏠 الرئيسية والدورات' : '🏠 Dashboard'}</Link></li>
            <li><Link href="/specializations" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? '🎓 المسارات والتخصصات' : '🎓 Specializations'}</Link></li>
            <li><Link href="/exams" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? '📝 الاختبارات والتقييم' : '📝 Exams'}</Link></li>
            <li><Link href="/discussions" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? '💬 منتدى النقاشات' : '💬 Discussions'}</Link></li>
          </ul>
        </div>

        {/* Col 3: Integrations & Tools */}
        <div>
          <h4 style={{ color: '#FFF', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>
            {language === 'ar' ? 'التكاملات والأدوات' : 'Tools & Integrations'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link href="/workspace" style={{ color: '#FF4D4D', textDecoration: 'none', fontWeight: 700 }}>{language === 'ar' ? '📺 مشغل YouTube و Google Workspace' : '📺 YouTube & Google Workspace'}</Link></li>
            <li><Link href="/certificates" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 700 }}>{language === 'ar' ? '📜 توثيق الشهادات الرقمية' : '📜 Certificate Verification'}</Link></li>
            <li><Link href="/payments" style={{ color: '#10B981', textDecoration: 'none' }}>{language === 'ar' ? '💳 الفواتير والاشتراكات' : '💳 Invoices & Payments'}</Link></li>
            <li><Link href="/admin" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 700 }}>{language === 'ar' ? '⚙️ لوحة التحكم والصلاحيات' : '⚙️ Control Panel (RBAC)'}</Link></li>
          </ul>
        </div>

        {/* Col 4: Google & Cloud Badge */}
        <div>
          <h4 style={{ color: '#FFF', fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>
            {language === 'ar' ? 'الاعتماد والتكامل السحابي' : 'Cloud & Accreditations'}
          </h4>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.5rem 0', color: '#CBD5E1' }}>
              {language === 'ar' ? '⚡ منصة مشغلة بسحابة Supabase ومحمية بـ Vercel Enterprise' : '⚡ Powered by Supabase & Vercel Enterprise Cloud'}
            </p>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
              ● 100% Operational & Verified
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
        <div>
          © 2026 LearnNov Academic Cloud Platform. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/profile" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</Link>
          <Link href="/chat" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}</Link>
          <Link href="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
        </div>
      </div>

      {/* Floating AI Academic Assistant Widget Button */}
      <Link 
        href="/chat" 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: isRtl ? 'auto' : '24px',
          left: isRtl ? '24px' : 'auto',
          backgroundColor: '#6366F1',
          background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
          color: '#FFF',
          padding: '0.85rem 1.35rem',
          borderRadius: '99px',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '0.9rem',
          zIndex: 1000,
          transition: 'transform 0.2s ease, boxShadow 0.2s ease'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🤖</span>
        <span>{language === 'ar' ? 'المساعد الأكاديمي الذكي' : 'AI Academic Tutor'}</span>
      </Link>

    </footer>
  );
};
