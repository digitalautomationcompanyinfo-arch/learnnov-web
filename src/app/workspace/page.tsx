'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
}

export default function GoogleWorkspaceAndYouTubePage() {
  const { language, isRtl } = useLanguage();

  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>({
    id: '1',
    title: language === 'ar' ? 'احتراف هندسة الأوامر والذكاء الاصطناعي التوليدي' : 'Mastering Prompt Engineering & Generative AI',
    channel: 'جامعة ليرنوف السحابية - LearnNov Channel',
    duration: '18:45',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    youtubeId: 'dQw4w9WgXcQ', // Standard YouTube embed
    category: 'الذكاء الاصطناعي'
  });

  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const videos: YouTubeVideo[] = [
    {
      id: '1',
      title: language === 'ar' ? 'احتراف هندسة الأوامر والذكاء الاصطناعي التوليدي' : 'Mastering Prompt Engineering & Generative AI',
      channel: 'قناة ليرنوف التعليمية',
      duration: '18:45',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'الذكاء الاصطناعي'
    },
    {
      id: '2',
      title: language === 'ar' ? 'بناء تطبيقات الويب الحديثة بـ Next.js 15 و React 19' : 'Building Modern Fullstack Apps with Next.js 15',
      channel: 'أكاديمية ليرنوف للبرمجة',
      duration: '24:10',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      youtubeId: 'SqcY0GlETPk',
      category: 'هندسة البرمجيات'
    },
    {
      id: '3',
      title: language === 'ar' ? 'أساسيات الأمن السيبراني واختبار الاختراق الأخلاقي' : 'Cybersecurity & Ethical Hacking Guide',
      channel: 'معهد الأمان الرقمي',
      duration: '32:00',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      youtubeId: '3Kq1MIfTWCE',
      category: 'الأمن السيبراني'
    }
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEmbedCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYoutubeId(customYoutubeUrl);
    if (ytId) {
      const customVid: YouTubeVideo = {
        id: Date.now().toString(),
        title: language === 'ar' ? 'فيديو يوتيوب تعليمي مخصص' : 'Custom YouTube Video Lesson',
        channel: 'YouTube Video',
        duration: 'مباشر',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        youtubeId: ytId,
        category: 'مخصص'
      };
      setActiveVideo(customVid);
      showToast(language === 'ar' ? 'تم تضمين فيديو يوتيوب داخل الدرس بنجاح!' : 'YouTube Video Embedded!');
      setCustomYoutubeUrl('');
    } else {
      showToast(language === 'ar' ? 'يرجى إدخال رابط يوتيوب صحيح.' : 'Invalid YouTube URL.');
    }
  };

  // Google Calendar Link Builder
  const createGoogleCalendarLink = (title: string, details: string) => {
    const startTime = new Date(Date.now() + 86400000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(Date.now() + 90000000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=LearnNov+Cloud+Platform`;
  };

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'} style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#111827', border: '1px solid #10B981', borderLeft: '4px solid #10B981', color: '#FFF', padding: '0.85rem 1.25rem', borderRadius: '8px', zIndex: 999 }}>
          ✅ {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel profile-header" style={{ borderLeft: '5px solid #FF0000', marginBottom: '2rem' }}>
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)', color: 'white', fontSize: '2rem' }}>
          📺
        </div>
        <div className="profile-info">
          <h1>
            {language === 'ar' ? 'ربط يوتيوب و أدوات ' : 'YouTube & '}
            <span className="text-gradient" style={{ background: 'linear-gradient(to left, #4285F4, #EA4335, #FBBC05, #34A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Google Workspace
            </span>
          </h1>
          <p>
            {language === 'ar' 
              ? 'عرض وبث المحاضرات والفيديوهات التدريبية مباشرة من YouTube، والربط المتكامل مع Google Meet, Calendar, Drive & Classroom' 
              : 'Stream YouTube lectures directly inside the platform and seamlessly integrate with Google Meet, Calendar, Drive & Classroom'}
          </p>
        </div>
      </div>

      {/* Grid: Main YouTube Player & Workspace Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Left/Main Column: YouTube Player */}
        <div>
          <div className="glass-panel" style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,0,0,0.2)', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,0,0,0.15)', color: '#FF4D4D', padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: 700 }}>
                  {activeVideo.category}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#FFF' }}>{activeVideo.title}</h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>📺 {activeVideo.channel} • ⏱️ {activeVideo.duration}</p>
              </div>

              {/* Share to Google Classroom Button */}
              <a
                href={`https://classroom.google.com/share?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`)}&title=${encodeURIComponent(activeVideo.title)}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#4285F4', color: '#FFF', padding: '0.55rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                🏫 مشاركة في Google Classroom
              </a>
            </div>
          </div>

          {/* Embed Custom YouTube Video Form */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>🔗 تضمين فيديو يوتيوب مخصص في المقرر</h3>
            <form onSubmit={handleEmbedCustomVideo} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder={language === 'ar' ? 'ضع رابط فيديو يوتيوب هنا (مثال: https://www.youtube.com/watch?v=...)' : 'Paste YouTube URL here...'}
                value={customYoutubeUrl}
                onChange={e => setCustomYoutubeUrl(e.target.value)}
                style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1E293B', color: '#FFF' }}
                required
              />
              <button type="submit" style={{ backgroundColor: '#FF0000', color: '#FFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                عرض الفيديو
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Google Workspace Integration Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Google Meet Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #34A853' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📹</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Google Meet</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>
              {language === 'ar' ? 'إطلاق وبدء المحاضرات التفاعلية المباشرة وساعات العمل المكتبية عبر Google Meet.' : 'Launch live lectures and office hours via Google Meet.'}
            </p>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#34A853', color: '#FFF', padding: '0.6rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}
            >
              🚀 فتح قاعة Google Meet الحية
            </a>
          </div>

          {/* Google Calendar Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #4285F4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Google Calendar</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>
              {language === 'ar' ? 'إضافة مواعيد المحاضرات والاختبارات مباشرة لتقويم Google الخاص بك.' : 'Sync lecture dates and exam schedules to your Google Calendar.'}
            </p>
            <a
              href={createGoogleCalendarLink('محاضرة ليرنوف التفاعلية - الذكاء الاصطناعي', 'محاضرة بث مباشر لمقرر احتراف هندسة الأوامر والذكاء الاصطناعي')}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#4285F4', color: '#FFF', padding: '0.6rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}
            >
              📅 إضافة لتقويم Google Calendar
            </a>
          </div>

          {/* Google Drive & Docs Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px', borderLeft: '4px solid #FBBC05' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📁</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Google Drive & Docs</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>
              {language === 'ar' ? 'الوصول والمشاركة السحابية للملفات والأجحاث والسلايدات على Google Drive.' : 'Access and share cloud course slides and research on Google Drive.'}
            </p>
            <a
              href="https://drive.google.com/"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#FBBC05', color: '#000', padding: '0.6rem', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', fontSize: '0.85rem' }}
            >
              📂 فتح مجلد Google Drive للمقرر
            </a>
          </div>

        </div>

      </div>

      {/* Educational YouTube Video Gallery */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
        {language === 'ar' ? '🎬 قائمة الفيديوهات التعليمية المعتمدة' : '🎬 Recommended YouTube Educational Playlist'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {videos.map(vid => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="glass-panel"
            style={{ padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', border: activeVideo.id === vid.id ? '2px solid #FF0000' : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }}
          >
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '150px', marginBottom: '0.75rem' }}>
              <img src={vid.thumbnail} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#FFF', fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                {vid.duration}
              </span>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.3rem', color: '#FFF' }}>{vid.title}</h4>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>📺 {vid.channel}</p>
          </div>
        ))}
      </div>

    </main>
  );
}
