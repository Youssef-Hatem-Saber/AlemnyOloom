import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Phone, 
  Mail, 
  FileText, 
  BrainCircuit, 
  CheckCircle, 
  Send, 
  Users, 
  Check, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  ArrowLeft,
  Settings,
  Clock,
  Briefcase
} from 'lucide-react';

import { 
  Course, 
  FreeSession, 
  News, 
  Teacher, 
  ContactMessage, 
  DynamicForm, 
  Registration, 
  AcademySettings,
  Coupon
} from './types';

import { 
  INITIAL_SETTINGS, 
  INITIAL_TEACHERS, 
  INITIAL_COURSES, 
  INITIAL_FORMS, 
  INITIAL_FREE_SESSIONS, 
  INITIAL_NEWS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_MESSAGES,
  INITIAL_COUPONS
} from './data';

import { parsePaymentInstructions } from './utils/payment';

// @ts-ignore
import logoImg from '../assets/logo.png';

import DynamicFormRenderer from './components/DynamicFormRenderer';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

const isStemCourse = (course: Course | null | undefined): boolean => {
  if (!course) return false;
  const cat = (course.category || "").toUpperCase();
  const ttl = (course.title || "").toLowerCase();
  return cat === 'STEM' || 
         ttl.includes('stem') || 
         ttl.includes('متفوق') || 
         ttl.includes('تفوق') || 
         ttl.includes('ضبعة') || 
         ttl.includes('الضبعة') ||
         course.id === 'c1' ||
         course.id === 'stem-track-virtual';
};

export default function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(!isSupabaseConfigured);

  // --- ANALYTICS HOOK (Google Analytics 4 & Microsoft Clarity) ---
  useEffect(() => {
    // 1. Initialize Microsoft Clarity
    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID || 'xe847sro54';
    if (clarityId) {
      try {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r) as HTMLScriptElement;t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode?.insertBefore(t,y);
        })(window as any, document, "clarity", "script", clarityId);
        console.log("Microsoft Clarity initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Microsoft Clarity:", err);
      }
    }

    // 2. Initialize Google Analytics 4 (GA4)
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-5TD9DMQKVD';
    if (gaId) {
      try {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        w.gtag = function(...args: any[]) {
          w.dataLayer.push(arguments);
        };
        w.gtag('js', new Date());
        w.gtag('config', gaId);
        console.log("Google Analytics initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Google Analytics:", err);
      }
    }
  }, []);

  // --- DATABASE STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [settings, setSettings] = useState<AcademySettings>(() => {
    const saved = localStorage.getItem('ao_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.email === 'info@alimny-oloom.com' || parsed.phone === '+201012345678' || parsed.phone === '01553514081') {
        return INITIAL_SETTINGS;
      }
      return { ...INITIAL_SETTINGS, ...parsed, whatsappChannel: INITIAL_SETTINGS.whatsappChannel || parsed.whatsappChannel };
    }
    return INITIAL_SETTINGS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ao_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [freeSessions, setFreeSessions] = useState<FreeSession[]>(() => {
    const saved = localStorage.getItem('ao_sessions');
    return saved ? JSON.parse(saved) : INITIAL_FREE_SESSIONS;
  });

  const [newsList, setNewsList] = useState<News[]>(() => {
    const saved = localStorage.getItem('ao_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('ao_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [forms, setForms] = useState<DynamicForm[]>(() => {
    const saved = localStorage.getItem('ao_forms');
    return saved ? JSON.parse(saved) : INITIAL_FORMS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('ao_registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('ao_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ao_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Derived courses computation to feed dynamically configured STEM values
  const computedCourses = courses.map((course) => {
    if (course.category === 'STEM') {
      const stemPriceValue = settings.stemPrice !== undefined ? Number(settings.stemPrice) : 1200;
      return {
        ...course,
        price: stemPriceValue,
        priceDisplay: settings.stemPreBookingEnded ? `${stemPriceValue} ج.م` : "حجز مسبق",
        lecturesCount: settings.stemLecturesCount !== undefined ? Number(settings.stemLecturesCount) : 49,
        duration: settings.stemLecturesCount !== undefined ? `${Math.ceil(Number(settings.stemLecturesCount) / 10)} شهور` : "5 شهور"
      };
    }
    return {
      ...course,
      priceDisplay: course.price === 0 ? "مجاني" : `${course.price} ج.م`
    };
  });

  const VIRTUAL_STEM_COURSE = useMemo<Course>(() => {
    return {
      id: 'stem-track-virtual',
      title: 'برنامج مسار المتفوقين والـ STEM (المستقل)',
      description: 'حجز مقعد مستقل بمسار المتفوقين والـ STEM ومدرسة الضبعة النووية بدون التزام بكورس معين',
      longDescription: 'البرنامج الأقوى والأشمل لتأهيل طلاب الشهادة الإعدادية لاختبارات القبول بمدارس المتفوقين في العلوم والتكنولوجيا والضبعة النووية بمصر.',
      price: settings.stemPrice !== undefined ? Number(settings.stemPrice) : 1200,
      level: 'الصف الثالث الإعدادي / طلاب STEM',
      image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600',
      lecturesCount: settings.stemLecturesCount !== undefined ? Number(settings.stemLecturesCount) : 49,
      duration: settings.stemLecturesCount !== undefined ? `${Math.ceil(Number(settings.stemLecturesCount) / 10)} شهور` : "5 شهور",
      isPublished: true,
      category: 'STEM'
    };
  }, [settings]);

  const getStemTrackCourse = () => {
    return VIRTUAL_STEM_COURSE;
  };

  const latestStemFreeSession = useMemo(() => {
    return freeSessions.find(fs => fs.isStemTrack) || freeSessions[0] || null;
  }, [freeSessions]);

  // --- SAVE & SUPABASE SYNC HOOKS ---
  const handleSyncError = (type: string, error: any) => {
    if (error) {
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("fetch"))) {
        console.log(`Supabase ${type} sync postponed (Network Offline)`);
      } else {
        console.warn(`Supabase ${type} sync warning:`, error);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('ao_settings', JSON.stringify(settings));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_settings').upsert([{ id: 1, ...settings }]);
          handleSyncError("settings", error);
        } catch (err) {
          console.log("Supabase settings sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [settings, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_courses', JSON.stringify(courses));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_courses').upsert(courses);
          handleSyncError("courses", error);
        } catch (err) {
          console.log("Supabase courses sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [courses, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_sessions', JSON.stringify(freeSessions));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_sessions').upsert(freeSessions);
          handleSyncError("sessions", error);
        } catch (err) {
          console.log("Supabase sessions sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [freeSessions, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_news', JSON.stringify(newsList));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_news').upsert(newsList);
          handleSyncError("news", error);
        } catch (err) {
          console.log("Supabase news sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [newsList, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_teachers', JSON.stringify(teachers));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_teachers').upsert(teachers);
          handleSyncError("teachers", error);
        } catch (err) {
          console.log("Supabase teachers sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [teachers, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_forms', JSON.stringify(forms));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_forms').upsert(forms);
          handleSyncError("forms", error);
        } catch (err) {
          console.log("Supabase forms sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [forms, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_registrations', JSON.stringify(registrations));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_registrations').upsert(registrations);
          handleSyncError("registrations", error);
        } catch (err) {
          console.log("Supabase registrations sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [registrations, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_messages', JSON.stringify(messages));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_messages').upsert(messages);
          handleSyncError("messages", error);
        } catch (err) {
          console.log("Supabase messages sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [messages, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ao_coupons', JSON.stringify(coupons));
    if (isSupabaseConfigured && isDataLoaded && supabase) {
      const sync = async () => {
        try {
          const { error } = await supabase.from('ao_coupons').upsert(coupons);
          handleSyncError("coupons", error);
        } catch (err) {
          console.log("Supabase coupons sync postponed (Network Offline)");
        }
      };
      sync();
    }
  }, [coupons, isDataLoaded]);

  // ON MOUNT SYNC FROM SUPABASE
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const pullData = async () => {
      try {
        console.log("Supabase Connection Live: Syncing with Cloud Datastore...");
        
        // Settings
        const { data: setD, error: setE } = await supabase.from('ao_settings').select('*').single();
        if (!setE && setD) setSettings(setD);

        // Courses
        const { data: crsD, error: crsE } = await supabase.from('ao_courses').select('*');
        if (!crsE && crsD) setCourses(crsD);

        // Sessions
        const { data: sesD, error: sesE } = await supabase.from('ao_sessions').select('*');
        if (!sesE && sesD) setFreeSessions(sesD);

        // News
        const { data: nwsD, error: nwsE } = await supabase.from('ao_news').select('*');
        if (!nwsE && nwsD) setNewsList(nwsD);

        // Teachers
        const { data: tchD, error: tchE } = await supabase.from('ao_teachers').select('*');
        if (!tchE && tchD) setTeachers(tchD);

        // Forms
        const { data: frmD, error: frmE } = await supabase.from('ao_forms').select('*');
        if (!frmE && frmD) setForms(frmD);

        // Registrations
        const { data: regD, error: regE } = await supabase.from('ao_registrations').select('*');
        if (!regE && regD) setRegistrations(regD);

        // Messages
        const { data: msgD, error: msgE } = await supabase.from('ao_messages').select('*');
        if (!msgE && msgD) setMessages(msgD);

        // Coupons
        const { data: cpnD, error: cpnE } = await supabase.from('ao_coupons').select('*');
        if (!cpnE && cpnD) setCoupons(cpnD);

      } catch (err) {
        console.warn("Could not sync complete Supabase model. Tables may not be fully initialized in SQL editor.", err);
      } finally {
        setIsDataLoaded(true);
      }
    };

    pullData();
  }, []);

  // --- TRANSLATION MODULE ---
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('ao_lang') as 'ar' | 'en') || 'ar';
  });

  const toggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem('ao_lang', nextLang);
  };

  const t = (ar: string, en: string) => {
    return lang === 'ar' ? ar : en;
  };

  // --- NAVIGATION & ROUTING ENGINE ---
  // We parse window.location.pathname dynamically.
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setMobileMenuOpen(false);
  };

  // --- DETECT ACTIVE PAGE MATCHES ---
  // Supports literal paths like '/free-session-stem'
  const activePage = useMemo(() => {
    if (currentPath === '/' || currentPath === '') return 'home';
    if (currentPath === '/courses') return 'courses';
    if (currentPath === '/stem-track') return 'stem-track';
    if (currentPath === '/free-sessions') return 'free-sessions';
    if (currentPath === '/news') return 'news';
    if (currentPath === '/contact') return 'contact';

    // check dynamic free sessions slugs, e.g. '/free-session-stem' or '/free-session/stem-prep'
    const cleanPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath; // e.g. 'free-session-stem'
    const foundSession = freeSessions.find(fs => fs.slug === cleanPath || `free-session/${fs.slug}` === cleanPath);
    if (foundSession) {
      return { type: 'free-session', data: foundSession };
    }

    // check news slugs, e.g. '/news/stem-2026'
    if (cleanPath.startsWith('news/')) {
      const slug = cleanPath.replace('news/', '');
      const foundNews = newsList.find(n => n.slug === slug);
      if (foundNews) {
        return { type: 'news-post', data: foundNews };
      }
    }

    return 'home';
  }, [currentPath, freeSessions, newsList]);

  // Synchronize free session if we are directly on its page to fix the submission bug
  useEffect(() => {
    if (typeof activePage === 'object' && activePage.type === 'free-session') {
      setActiveSessionForRegister(activePage.data);
    }
  }, [activePage]);

  // --- DYNAMIC SEO META UPDATE SYSTEM ---
  useEffect(() => {
    let title = "أكاديمية علّمني علوم - تعلّم اليوم، قُد الغد";
    let description = "أكاديمية علّمني علوم - المنصة الأولى لتأهيل طلاب الشهادة الإعدادية لاختبارات قبول مدارس المتفوقين STEM والضبعة النووية والتكنولوجيا التطبيقية بمصر.";
    
    if (activePage === 'home') {
      title = "علّمني علوم | منصة التأهيل الأولى لمدارس المتفوقين STEM والضبعة النووية";
      description = "سجل الآن في دورات علمني علوم التأهيلية لمدارس STEM والضبعة النووية. ندربك على اختبارات الذكاء IQ والعلوم والرياضيات والانجليزية لضمان القبول.";
    } else if (activePage === 'courses') {
      title = "الكورسات والبرامج المنهجية | أكاديمية علّمني علوم";
      description = "تصفح برامجنا وكورساتنا المتكاملة والمخصصة لتطوير مهارات التفكير العلمي والبرمجة والفيزياء الفلكية وتأهيل امتحانات المتفوقين.";
    } else if (activePage === 'stem-track') {
      title = "برنامج مسار المتفوقين والـ STEM الشامل | علّمني علوم";
      description = "برنامج مسار STEM والضبعة النووية المتكامل بمصر. محاضرات تفاعلية، امتحانات IQ، متابعة 24/7 وتدريب المقابلات الشخصية لضمان قبولك.";
    } else if (activePage === 'free-sessions') {
      title = "الندوات والمحاضرات التعريفية المجانية | علّمني علوم";
      description = "احجز مقعدك مجاناً في بثنا المباشر القادم للتعريف بشروط التقديم لمدارس المتفوقين STEM ومدرسة الضبعة النووية وطرق التأسيس.";
    } else if (activePage === 'news') {
      title = "أحدث الأخبار ومستجدات القبول لعام 2026 | علّمني علوم";
      description = "تابع آخر الشروط الوزارية الرسمية ومواعيد اختبارات القبول لمدارس المتفوقين STEM والضبعة والتكنولوجيا التطبيقية بمصر.";
    } else if (activePage === 'contact') {
      title = "تواصل معنا واستفسر | أكاديمية علّمني علوم";
      description = "هل لديك استفسار عن مسار المتفوقين أو طريقة الاشتراك؟ تواصل مع إدارة علمني علوم والمدربين مباشرة عبر الهاتف أو الواتساب.";
    } else if (typeof activePage === 'object' && activePage.type === 'free-session') {
      title = `${activePage.data.title} | ندوة مجانية`;
      description = activePage.data.description;
    } else if (typeof activePage === 'object' && activePage.type === 'news-post') {
      title = `${activePage.data.title} | أخبار الأكاديمية`;
      description = stripHtml(activePage.data.content).substring(0, 150);
    }
    
    document.title = title;
    
    // Update dynamic description meta tag for search engine indexing
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [activePage]);

  // --- WORKFLOW STATES ---
  // Registration Modals
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    phone: '',
    email: '',
    senderType: 'student' as 'student' | 'parent',
    currentSchool: '',
    governorate: 'القاهرة'
  });
  
  const [generatedCodeResult, setGeneratedCodeResult] = useState<{
    code: string;
    studentName: string;
    price: number | string;
    courseTitle: string;
    isStemCourse: boolean;
  } | null>(null);

  // States for direct inline enrollment on the STEM track page
  const [inlineEnrollForm, setInlineEnrollForm] = useState({
    name: '',
    phone: '',
    email: '',
    senderType: 'student' as 'student' | 'parent',
    currentSchool: '',
    governorate: 'القاهرة'
  });

  const [inlineGeneratedCode, setInlineGeneratedCode] = useState<{
    code: string;
    studentName: string;
    price: number | string;
    courseTitle: string;
    isStemCourse: boolean;
  } | null>(null);

  // Coupon state in enrollment modal
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
  }, [selectedCourseForEnroll]);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    senderType: 'student' as 'student' | 'parent',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Dynamic Free Session Enroll
  const [activeSessionForRegister, setActiveSessionForRegister] = useState<FreeSession | null>(null);
  const [dynamicFormSuccess, setDynamicFormSuccess] = useState(false);

  const GOVERNORATES = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الغربية", 
    "الشرقية", "القليوبية", "البحيرة", "المنوفية", "كفر الشيخ", 
    "الإسماعيلية", "السويس", "بورسعيد", "دمياط", "بني سويف", 
    "الفيوم", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", 
    "الوادي الجديد", "شمال سيناء", "جنوب سيناء", "البحر الأحمر", "مطروح"
  ];

  // Direct Inline STEM Course Enrollment
  const handleInlineEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineEnrollForm.name || !inlineEnrollForm.phone) {
      alert("يرجى تعبئة الحقول الأساسية: الاسم ورقم الهاتف.");
      return;
    }

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = `AO${randomDigits}`;

    const matchedCourse = getStemTrackCourse();
    if (!matchedCourse) return;

    const basePrice = matchedCourse.price;
    const isStem = true;
    let dbPricePaid = 0;
    let finalPriceDisplay: number | string = "؟؟ انتظر قريباً";

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      studentCode: newCode,
      studentName: inlineEnrollForm.name,
      studentPhone: inlineEnrollForm.phone,
      studentEmail: inlineEnrollForm.email || `${inlineEnrollForm.phone}@alimny.com`,
      senderType: inlineEnrollForm.senderType,
      currentSchool: inlineEnrollForm.currentSchool,
      governorate: inlineEnrollForm.governorate,
      courseId: matchedCourse.id,
      dynamicData: {},
      paymentStatus: 'Pending',
      paymentMethod: 'حجز مسبق (بانتظار التسعير النهائي)',
      registeredAt: new Date().toISOString(),
      pricePaid: dbPricePaid
    };

    setRegistrations([newRegistration, ...registrations]);

    setInlineGeneratedCode({
      code: newCode,
      studentName: inlineEnrollForm.name,
      price: finalPriceDisplay,
      courseTitle: matchedCourse.title,
      isStemCourse: true
    });

    // Reset Form
    setInlineEnrollForm({
      name: '',
      phone: '',
      email: '',
      senderType: 'student',
      currentSchool: '',
      governorate: 'القاهرة'
    });
  };

  // Paid Course Enrollment and Unique Student ID Generator (AOXXXXXXXX)
  const handleCourseEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.phone || !selectedCourseForEnroll) {
      alert("يرجى تعبئة الحقول الأساسية: الاسم ورقم الهاتف.");
      return;
    }

    // Generate automatic unique student code: AO followed by 6 random/sequential numbers
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = `AO${randomDigits}`;

    const isStem = isStemCourse(selectedCourseForEnroll);
    const basePrice = selectedCourseForEnroll.price;

    let dbPricePaid = basePrice;
    let finalPriceDisplay: number | string = basePrice;
    let appliedCodeName = '';

    if (isStem) {
      dbPricePaid = 0;
      finalPriceDisplay = "؟؟ انتظر قريباً";
    } else if (appliedCoupon) {
      appliedCodeName = appliedCoupon.code;
      if (appliedCoupon.discountType === 'percent') {
        dbPricePaid = Math.round(basePrice * (1 - appliedCoupon.discountValue / 100));
      } else {
        dbPricePaid = Math.max(0, basePrice - appliedCoupon.discountValue);
      }
      finalPriceDisplay = dbPricePaid;
    }

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      studentCode: newCode,
      studentName: enrollForm.name,
      studentPhone: enrollForm.phone,
      studentEmail: enrollForm.email || `${enrollForm.phone}@alimny.com`,
      senderType: enrollForm.senderType,
      currentSchool: enrollForm.currentSchool,
      governorate: enrollForm.governorate,
      courseId: selectedCourseForEnroll.id,
      dynamicData: {},
      paymentStatus: 'Pending',
      paymentMethod: isStem ? 'حجز مسبق (بانتظار التسعير النهائي)' : 'المحافظ الإلكترونية (فودافون كاش)',
      registeredAt: new Date().toISOString(),
      pricePaid: dbPricePaid,
      appliedCoupon: appliedCodeName || undefined
    };

    setRegistrations([newRegistration, ...registrations]);
    
    if (appliedCoupon && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('ao_coupons')
          .update({ usages: (appliedCoupon.usages || 0) + 1 })
          .eq('id', appliedCoupon.id);
      } catch (err) {
        console.warn("Failed to increment coupon usages", err);
      }
    }

    setGeneratedCodeResult({
      code: newCode,
      studentName: enrollForm.name,
      price: finalPriceDisplay,
      courseTitle: selectedCourseForEnroll.title,
      isStemCourse: isStem
    });

    // Reset Form
    setEnrollForm({
      name: '',
      phone: '',
      email: '',
      senderType: 'student',
      currentSchool: '',
      governorate: 'القاهرة'
    });
  };

  // Dynamic Form Registration Handler
  const handleDynamicFormSubmit = (data: Record<string, string>) => {
    const session = activeSessionForRegister || 
                    (typeof activePage === 'object' && activePage.type === 'free-session' ? activePage.data : null) ||
                    latestStemFreeSession;
    if (!session) return;
    
    // Find the phone number in the submitted form data (handles dynamic fields or direct values)
    const phoneField = forms.find(f => f.id === session.formId)?.fields.find(f => 
      f.type === 'phone' || 
      f.label.includes('هاتف') || 
      f.label.includes('موبايل') || 
      f.label.includes('تليفون') ||
      f.id.includes('phone')
    );
    
    let submittedPhone = "";
    if (phoneField && data[phoneField.id]) {
      submittedPhone = data[phoneField.id].trim();
    } else {
      const keys = Object.keys(data);
      const foundKey = keys.find(k => 
        k.toLowerCase().includes('phone') || 
        k.includes('هاتف') || 
        k.includes('موبايل') || 
        k.includes('تليفون')
      );
      if (foundKey) {
        submittedPhone = data[foundKey].trim();
      } else {
        submittedPhone = (data["f_phone"] || data["fn_phone"] || data["g_phone"] || data["رقم الهاتف"] || data["الهاتف"] || "غير متوفر").trim();
      }
    }

    if (!submittedPhone || submittedPhone === "غير متوفر") {
      alert("يرجى إدخال رقم الهاتف للتسجيل.");
      return;
    }

    // 1. Check if the student is already registered for this specific free session
    const isAlreadyRegistered = registrations.some(r => 
      r.freeSessionId === session.id && 
      (r.studentPhone.trim() === submittedPhone || (r.dynamicData && Object.values(r.dynamicData).includes(submittedPhone)))
    );

    if (isAlreadyRegistered) {
      const existingReg = registrations.find(r => 
        r.freeSessionId === session.id && 
        (r.studentPhone.trim() === submittedPhone || (r.dynamicData && Object.values(r.dynamicData).includes(submittedPhone)))
      );
      alert(`عذراً، هذا الرقم مسجل بالفعل في هذه المحاضرة. كود الطالب الخاص بك هو: ${existingReg?.studentCode}`);
      return;
    }

    // 2. Check if the student is already registered in the system (to reuse the student code)
    const existingSystemReg = registrations.find(r => 
      r.studentPhone.trim() === submittedPhone || (r.dynamicData && Object.values(r.dynamicData).includes(submittedPhone))
    );

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = existingSystemReg ? existingSystemReg.studentCode : `AO${randomDigits}`;
    
    const nameVal = data["f1"] || data["fn1"] || data["g1"] || data["اسم الطالب ثلاثي"] || data["الاسم بالكامل"] || data["الاسم"] || "طالب غير معرف";
    const schoolVal = data["f2"] || data["fn2"] || data["المدرسة الحالية"] || "";
    const govVal = data["f4"] || data["fn3"] || data["المحافظة"] || data["المحافظة السكنية"] || "القاهرة";
    const emailVal = data["البريد الإلكتروني"] || data["البريد"] || `${submittedPhone}@alimny.com`;

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      studentCode: newCode,
      studentName: nameVal,
      studentPhone: submittedPhone,
      studentEmail: emailVal,
      senderType: 'student',
      currentSchool: schoolVal,
      governorate: govVal,
      freeSessionId: session.id,
      dynamicFormId: session.formId,
      dynamicData: data,
      paymentStatus: 'Paid', // free sessions are automatically approved
      paymentMethod: 'حجز ندوة مجانية',
      registeredAt: new Date().toISOString(),
      pricePaid: 0
    };

    // Update registers and registeredCount count
    setRegistrations([newRegistration, ...registrations]);
    setFreeSessions(freeSessions.map(fs => {
      if (fs.id === session.id) {
        return { ...fs, registeredCount: fs.registeredCount + 1 };
      }
      return fs;
    }));

    setDynamicFormSuccess(true);
  };

  // Submit contact message
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      alert("الاسم ورقم الهاتف والرسالة حقول إلزامية للتواصل!");
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email || 'noreply@alimny.com',
      senderType: contactForm.senderType,
      message: contactForm.message,
      date: new Date().toLocaleDateString('ar-EG'),
      solved: false
    };

    setMessages([newMessage, ...messages]);
    setContactSuccess(true);

    // reset
    setContactForm({
      name: '',
      phone: '',
      email: '',
      senderType: 'student',
      message: ''
    });

    setTimeout(() => setContactSuccess(false), 5000);
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative select-none" dir="rtl">
        <div className="absolute inset-0 bg-[#2563EB]/5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          {!logoError ? (
            <img 
              src={logoImg} 
              alt="علّمني علوم" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain mx-auto animate-bounce filter drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-24 h-24 bg-blue-600/10 border-2 border-blue-500 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-blue-500/30 animate-bounce">
              ⚡
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden w-full max-w-full">
      {/* Visual background decor elements */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-20 left-12 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[800px] right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- MAIN HEADER / HERO BRANDING --- */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="relative w-14 h-14 flex items-center justify-center bg-sky-50 rounded-2xl border border-sky-100 overflow-hidden shadow-inner group">
              {!logoError ? (
                <img 
                  src={logoImg} 
                  alt="علّمني علوم" 
                  className="w-12 h-12 object-contain relative z-10"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <svg className="w-12 h-12 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Clean white/sky book pages */}
                  <path d="M15 68C30 61 45 64 50 68C55 64 70 61 85 68V38C70 31 55 34 50 38C45 34 30 31 15 38V68Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M50 38V68" stroke="#0284C7" strokeWidth="3" />
                  {/* Atomic Orbit Paths */}
                  <ellipse cx="50" cy="44" rx="26" ry="9" transform="rotate(-25 50 44)" stroke="#8B5CF6" strokeWidth="2" />
                  <ellipse cx="50" cy="44" rx="26" ry="9" transform="rotate(25 50 44)" stroke="#06B6D4" strokeWidth="2" />
                  <ellipse cx="50" cy="44" rx="26" ry="9" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="2 2" />
                  {/* Central upward green arrow */}
                  <path d="M50 52V22M50 22L42 30M50 22L58 30" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Color Nodes */}
                  <circle cx="28" cy="34" r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="72" cy="34" r="4.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="50" cy="44" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="58" cy="53" r="4" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1" />
                </svg>
              )}
              <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <h1 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {t("علّمني علوم", "Allimny Oloom")}
              </h1>
              <p className="text-[10px] text-amber-600 font-bold block leading-3 mt-0.5 tracking-tight">
                {t(settings.tagline, "Learn Today, Lead Tomorrow")}
              </p>
            </div>
          </div>

          {/* Large Screen Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { label: t("الرئيسية", "Home"), path: "/" },
              ...(settings.isStemTrackEnabled !== false ? [{ label: t("مسار المتفوقين (STEM)", "STEM Track"), path: "/stem-track" }] : []),
              { label: t("الكورسات والبرامج", "Courses & Programs"), path: "/courses" },
              { label: t("المحاضرات المجانية", "Free Lectures"), path: "/free-sessions" },
              { label: t("آخر الأخبار", "Latest News"), path: "/news" },
              { label: t("اتصل بنا", "Contact Us"), path: "/contact" },
            ].map((link) => {
              const isActive = (link.path === '/' && activePage === 'home') || 
                               (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative cursor-pointer ${
                    isActive 
                      ? 'text-[#2563EB] bg-[#DBEAFE]/60 border border-blue-200/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 right-1/4 left-1/4 h-[3px] bg-[#2563EB] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin CTA / Phone Action Block */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href={settings.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="bg-[#DCFCE7] hover:bg-emerald-100 text-[#166534] border border-[#DCFCE7] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{t("واتساب الأكاديمية", "Academy WhatsApp")}</span>
            </a>

            <button 
              type="button"
              onClick={toggleLang}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm h-9"
            >
              <span>🌐 {lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-slate-200 overflow-hidden shadow-sm"
            >
              <div className={`p-4 space-y-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {[
                  { label: t("الرئيسية", "Home"), path: "/" },
                  ...(settings.isStemTrackEnabled !== false ? [{ label: t("مسار المتفوقين (STEM)", "STEM Track"), path: "/stem-track" }] : []),
                  { label: t("الكورسات والبرامج", "Courses & Programs"), path: "/courses" },
                  { label: t("المحاضرات المجانية", "Free Lectures"), path: "/free-sessions" },
                  { label: t("آخر الأخبار", "Latest News"), path: "/news" },
                  { label: t("اتصل بنا", "Contact Us"), path: "/contact" },
                ].map((link) => {
                  const isActive = (link.path === '/' && activePage === 'home') || 
                                   (link.path !== '/' && currentPath.startsWith(link.path));
                  return (
                    <button
                      key={link.path}
                      onClick={() => navigateTo(link.path)}
                      className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} px-4 py-3 rounded-xl block font-bold text-sm ${
                        isActive 
                          ? 'bg-[#DBEAFE] text-[#2563EB] border-r-4 border-r-[#2563EB]' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button 
                    type="button"
                    onClick={toggleLang}
                    className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-center py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>🌐 {lang === 'ar' ? 'English' : 'العربية'}</span>
                  </button>
                  <a 
                    href={settings.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#DCFCE7] text-[#166534] text-center py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t("واتساب الأكاديمية", "Academy WhatsApp")}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- CORE CONTENT FRAME --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* VIEW ROUTER */}
        
        {/* A. HOME VIEW */}
        {activePage === 'home' && (
          <div className="space-y-16">
            
            {/* Redesigned Unified STEM & Nuclear Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
              {/* Background patterns */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right">
                
                {/* Right Column: Title, Subtitle, and CTAs */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap gap-2 justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                      ⚡ {t("المسار التأهيلي الأول لمدارس المتفوقين بمصر", "The #1 Prep Track for STEM in Egypt")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                      🚀 {t("مدارس STEM والضبعة النووية", "STEM & Nuclear Schools")}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                    {t("نصنع علماء المستقبل وعباقرة الـ STEM والضبعة", "We Shape Future Scientists & STEM Geniuses")}
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                    {settings.aboutText}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {/* Primary CTA: Paid/Prebooking Course */}
                    <button
                      onClick={() => {
                        const matched = getStemTrackCourse();
                        if (matched) setSelectedCourseForEnroll(matched);
                      }}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <span>
                        {settings.stemPreBookingEnded
                          ? t("اشترك الآن بالبرنامج التأهيلي الكامل", "Subscribe to Full Prep Program Now")
                          : t("احجز مقعدك بالمسار الشامل (حجز مسبق)", "Reserve Your Seat (Free Pre-Booking)")}
                      </span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>

                    {/* Secondary CTA: Scroll to Free Form */}
                    <a
                      href="#free-registration-form"
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base text-center"
                    >
                      <span>{t("التسجيل بالندوة التعريفية المجانية", "Register for Free Seminar")}</span>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </a>
                  </div>
                </div>

                {/* Left Column: Visual highlights and badges */}
                <div className="lg:col-span-5 w-full">
                  <div className="bg-slate-950/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-blue-400 border-b border-slate-800/60 pb-3 flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-blue-400" />
                      لماذا يختار المتفوقون أكاديمية علّمني علوم؟
                    </h3>
                    
                    <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>محتوى علمي مخصص يحاكي أسئلة القبول الفعلية تماماً.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>شرح مكثف لمادة الاستعداد العقلي (IQ) بأفكار ذكية ومتطورة.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>تدريب عملي على لجان التقييم والمقابلات الشخصية.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>متابعة وتنبيه دوري لولي الأمر لمستوى الطالب أولاً بأول.</span>
                      </li>
                    </ul>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/40">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="block text-2xl font-black text-amber-400 font-sans">{settings.stemLecturesCount || 49}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">محاضرة تفاعلية</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="block text-2xl font-black text-amber-400 font-sans">24/7</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">متابعة علمية</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Dual Pathway Registration Gateway */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {t("اختر مسار انضمامك وتألق معنا", "Choose Your Path to Join Us")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                  {t("سواء كنت تبحث عن تأسيس أولي أو تريد حجز مقعدك بالكامل بالبرنامج الشامل، نوفر لك خيارات مريحة ومحفزة للتقديم الفوري:", "Whether seeking preliminary foundation or reserving your full program seat, we offer motivating options for immediate registration:")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Gateway A: Comprehensive Program / Pre-booking */}
                <div className="bg-gradient-to-br from-white to-blue-50/20 p-6 sm:p-8 rounded-3xl border border-blue-200/50 shadow-md hover:shadow-lg transition-all flex flex-col justify-between text-right space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-150"></div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
                        {settings.stemPreBookingEnded ? "🔥 حجز فعال ومفتوح" : "📢 حجز مسبق معتمد"}
                      </span>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {t("برنامج التأهيل الشامل والكامل (الكورس الأساسي)", "Full Comprehensive Prep Program (Core Course)")}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      {settings.stemPreBookingEnded 
                        ? t("اشترك الآن بالبرنامج الشامل لتغطية كافة المناهج والأفكار المتوقعة في العلوم، الرياضيات، الاستعداد العقلي، والمصطلحات الإنجليزية لضمان القبول.", "Subscribe now to cover all expected concepts in Science, Math, IQ, and English terms for guaranteed admission.")
                        : t("حجز مقعد مسبق مجاني بالكامل وبدون أي دفع مالي حالياً. يمنحك الحجز الأولوية للمجموعات المغلقة وخصماً فورياً بقيمة 10% فور تفعيل وسداد الاشتراك عند الانطلاق.", "Reserve a free seat now with no payment obligation. Ensures priority placement and a 10% discount when prices launch.")}
                    </p>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/30 text-xs space-y-2 font-sans text-slate-650">
                      <div className="flex justify-between items-center">
                        <span>الدروس والمحاضرات:</span>
                        <span className="font-bold text-blue-755 font-mono">{settings.stemLecturesCount || 49} محاضرة تدريبية</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>قيمة الاشتراك:</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {settings.stemPreBookingEnded ? `${settings.stemPrice || 1200} ج.م` : "مجاني الآن (تنبيه مسبق)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const matched = getStemTrackCourse();
                      if (matched) setSelectedCourseForEnroll(matched);
                    }}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <span>
                      {settings.stemPreBookingEnded 
                        ? t("سجل واشترك بالبرنامج الشامل", "Register & Subscribe to Full Track")
                        : t("احجز مقعدك التحضيري مجاناً الآن", "Reserve Your Free Prep Seat Now")}
                    </span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>

                {/* Gateway B: Free Lectures & Seminars */}
                <div className="bg-gradient-to-br from-white to-amber-50/20 p-6 sm:p-8 rounded-3xl border border-amber-200/50 shadow-md hover:shadow-lg transition-all flex flex-col justify-between text-right space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-150"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black animate-pulse">
                        ⭐ ندوة بث حي مجانية
                      </span>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {t("المحاضرات والندوات الإرشادية المجانية", "Free Guidance Lectures & Seminars")}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      {t("انضم إلينا في ندواتنا التعريفية المفتوحة لتفهم شكل الامتحانات الرسمية للوزارة، وتتعلم استراتيجيات التفكير المنطقي IQ، وتجرب جودة الشرح العملي قبل أي التزام مالي.", "Join our open seminars to learn exam structures, IQ logical strategies, and experience class quality before any financial commitment.")}
                    </p>

                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/30 text-xs space-y-2 font-sans text-slate-650">
                      <div className="flex justify-between items-center">
                        <span>الندوة القادمة المنتظرة:</span>
                        <span className="font-bold text-amber-800">{latestStemFreeSession?.date || "قريباً"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>المقاعد المحجوزة للندوة:</span>
                        <span className="font-bold text-amber-850 font-mono">{latestStemFreeSession?.registeredCount || 0} طالب مسجل</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#free-registration-form"
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 text-center flex items-center justify-center gap-2 text-sm"
                  >
                    <span>{t("سجل واحجز مقعدك بالندوة مجاناً", "Book Your Free Seminar Seat Now")}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* STEM Exam Structure & Curriculum Requirements */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="inline-block bg-blue-100 text-[#2563EB] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  ماذا تشمل اختبارات القبول؟
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  تفاصيل اختبار القبول لمدارس المتفوقين
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                  منظومتنا التعليمية ليست مجرد تلقين، بل تدريب عملي مكثف على المحاور الأربعة لاختبارات الوزارة الرسمية:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    num: "01",
                    title: "الاستعداد الذهني والـ IQ",
                    desc: "بنشرح المفاهيم الأساسية للاختبار مع أسئلة معقدة لرفع ذكاء الطالب وقدرته على الحل.",
                    color: "border-t-4 border-t-amber-500"
                  },
                  {
                    num: "02",
                    title: "العلوم",
                    desc: "شرح جميع مناهج العلوم مع أسئلة تفاعلية ولضمان الدرجة النهائية في الامتحان.",
                    color: "border-t-4 border-t-blue-500"
                  },
                  {
                    num: "03",
                    title: "الرياضيات",
                    desc: "شرح جميع أساسيات والقواعد الرياضية مع أهم أسئلة الامتحان.",
                    color: "border-t-4 border-t-purple-500"
                  },
                  {
                    num: "04",
                    title: "اللغة الإنجليزية",
                    desc: "تطوير اللغة الإنجليزية للطالب لضمان ارتقاء مستواه اللغوي وليس فقط التركيز على الامتحان.",
                    color: "border-t-4 border-t-emerald-500"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-right space-y-3 ${item.color}`}>
                    <span className="text-slate-400 text-lg font-black font-sans block">{item.num}</span>
                    <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-3xl text-center space-y-2 mt-6">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed font-sans">
                  💡 <strong>مستقبلك يبدأ من هنا:</strong> هذا البرنامج مصمم ليرتقي بعقليتك وطريقة تفكيرك لتتحول إلى طالب بمواصفات عالمية؛ محتوى هذا الكورس سيفيدك بشكل مذهل في بناء عقلية قوية تفيدك طوال حياتك العلمية والعملية حتى وإن لم يحالفك الحظ بالقبول، ولكن مع التمارين الشاملة والمتابعة المستمرة معنا، ستشعر في كل محاضرة بجرعة يقين عالية وثقة متكاملة بأنك الأقرب لتخطي اختبار القبول وحجز مقعدك بمدارس المتفوقين!
                </p>
              </div>
            </section>

            {/* Direct Form Integration on the Homepage */}
            {latestStemFreeSession && (
              <section id="free-registration-form" className="scroll-mt-24 pt-6">
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-right">
                  {/* Decorative backgrounds */}
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Info details */}
                    <div className="lg:col-span-6 space-y-6 text-white order-1 lg:order-1">
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 animate-pulse">
                          ⚠️ بث تفاعلي مجاني - احجز مقعدك فوراً
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                          {latestStemFreeSession.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans">
                          {latestStemFreeSession.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-sans">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">
                            📅
                          </div>
                          <div>
                            <span className="block text-slate-400">موعد المحاضرة والندوة المباشرة:</span>
                            <span className="font-bold text-white text-sm">{latestStemFreeSession.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-lg">
                            👥
                          </div>
                          <div>
                            <span className="block text-slate-400">المقاعد المأخوذة للطلاب:</span>
                            <span className="font-bold text-amber-400 text-sm font-sans">{latestStemFreeSession.registeredCount} طالب مسجل معنا</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                        <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                          🛡️ تفعيل التسجيل المباشر والتلقائي:
                        </h4>
                        <p className="text-slate-450 leading-normal font-sans">
                          بمجرد ملء الاستمارة المجاورة بالبيانات الصحيحة، سيتم تسجيلك في قاعدة بيانات الأكاديمية لحضور الندوة مجاناً وتزويدك بـ كود الطالب الأكاديمي الحصري للولوج.
                        </p>
                      </div>
                    </div>

                    {/* Right: Form block */}
                    <div className="lg:col-span-6 w-full order-2 lg:order-2">
                      {dynamicFormSuccess ? (
                        <div className="bg-slate-900/90 border border-emerald-500/30 p-8 rounded-3xl text-center space-y-4 h-full flex flex-col justify-center items-center shadow-2xl backdrop-blur-sm min-h-[300px]">
                          <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
                          <h3 className="text-xl font-bold text-white">يا بطل، تم حجز مقعدك بنجاح!</h3>
                          <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
                            تم تسجيل بياناتك بنجاح في سجل الندوة المجانية. سنقوم بإرسال دعوة الحضور والتفاصيل ورابط البث المباشر عبر هاتف الواتساب المسجل. نتمنى لك التوفيق والتميز بمسار العباقرة!
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-800 w-full text-center">
                            <p className="text-sm font-semibold text-amber-400 mb-3">
                              ⭐ هل تود الانضمام للمسار الشامل المتكامل والتحضير الفعلي لمدارس المتفوقين؟
                            </p>
                            <button
                              onClick={() => {
                                const stemCourse = getStemTrackCourse();
                                setSelectedCourseForEnroll(stemCourse);
                                setDynamicFormSuccess(false);
                              }}
                              className="px-6 py-3 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full text-center"
                            >
                              <Award className="w-5 h-5" />
                              سجل في المسار الكامل الآن
                            </button>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const matchedForm = forms.find(f => f.id === latestStemFreeSession.formId) || forms[0];
                          return (
                            <div className="bg-white rounded-3xl p-1 shadow-xl border border-slate-200 overflow-hidden">
                              <DynamicFormRenderer
                                form={matchedForm}
                                onSubmit={handleDynamicFormSubmit}
                                submitLabel="سجل الآن مجاناً وانضم للمحاضرة"
                              />
                            </div>
                          );
                        })()
                      )}
                    </div>
                    
                  </div>
                </div>
              </section>
            )}

            {/* LATEST COURSES SECTION */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4 text-right">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{t("أحدث الكورسات والبرامج الممنهجة", "Latest Courses & Programs")}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t("نوفر لك تجربة تعليمية فريدة وتدريباً مستمراً بإشراف كوكبة من المعلمين المرموقين", "We provide a unique learning experience with top-tier educators")}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('/courses')}
                  className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{t("تصفح الكل", "Browse All")}</span>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {computedCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#2563EB]/40 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
                    <div className="relative h-44 bg-slate-100">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                        {course.priceDisplay}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs px-3 py-1 rounded-full font-bold">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-6 text-right flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="inline-block bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded text-[11px] font-bold uppercase mb-2">
                          {course.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#0F172A]">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-slate-650 font-mono justify-end">
                          <span>⏱️ المدة: {course.duration}</span>
                          <span>📚 المحاضرات: {course.lecturesCount} محاضره</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => setSelectedCourseForEnroll(course)}
                          className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          {t("احجز مقعدك الآن", "Enroll Now")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* DYNAMIC FREE SESSIONS SECTION */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4 text-right">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">الندوات والمحاضرات المجتمعية المجانية</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    لقاءات تفاعلية تعريفية هامة بحضور كبار المعلمين والخبراء لنمهد لك البداية
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('/free-sessions')}
                  className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>عرض الكل</span>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {freeSessions.slice(0, 2).map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 sm:grid-cols-12">
                    <div className="sm:col-span-5 h-48 sm:h-full bg-slate-100 relative">
                      <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        بث حي قريب مجاناً
                      </span>
                    </div>

                    <div className="sm:col-span-7 p-6 flex flex-col justify-between text-right space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{session.date}</span>
                          {session.isStemTrack !== undefined && (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${session.isStemTrack ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                              {session.isStemTrack ? "✨ مسار متفوقين (STEM)" : "📚 مسارات أخرى"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-1.5 leading-snug">
                          {session.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                          {session.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          حجز مقعداً حتى الآن: <span className="text-[#F59E0B] font-bold font-mono">{session.registeredCount}</span> طالب
                        </span>
                        
                        <button
                          onClick={() => navigateTo('/free-session/' + session.slug)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          التسجيل المجاني الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURED NEWS AND ANNOUNCEMENTS WITH PRETTY URL LINKS */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4 text-right">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">آخر المستجدات والأخبار الدراسية</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    أعلانات مهمة وتحديثات شروط القبول الرسمية لمدارس متفوقي المفاعلات والتكنيك مباشرة
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('/news')}
                  className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>قراءة الكل</span>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newsList.slice(0, 2).map((item) => (
                  <article key={item.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-sm">
                    <div className="p-6 text-right space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>🗓️ نشر في: {item.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] hover:text-[#2563EB] cursor-pointer transition-colors leading-snug" onClick={() => navigateTo('/news/' + item.slug)}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {stripHtml(item.content)}
                      </p>
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-mono">/news/{item.slug}</span>
                      <button 
                        onClick={() => navigateTo('/news/' + item.slug)}
                        className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>قراءة المقال الكامل</span>
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* TEACHERS TEAM SECTION */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">كوادر وخبراء علّمني علوم</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
                    <img src={teacher.image} alt={teacher.name} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-slate-100 bg-slate-50" />
                    <div>
                      <h4 className="text-base font-bold text-[#0F172A]">{teacher.name}</h4>
                      <p className="text-xs text-[#2563EB] font-bold mt-1">{teacher.specialty}</p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{teacher.bio}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* B. COURSES SYSTEM VIEW */}
        {activePage === 'courses' && (
          <div className="space-y-10">
            <div className="text-right border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-[#0F172A]">نظام البرامج الممنهجة والكورسات</h2>
              <p className="text-sm text-slate-500 mt-1.5">
                تصفح وسجّل في أقوى الكورسات المفتوحة للتأهيل العلمي والأكاديمي بإشراف نخبة المتخصصين
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Courses Grid Filterable list */}
              <div className="lg:col-span-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {computedCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                      <div className="relative h-44 bg-slate-100">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                          {course.priceDisplay}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-450 text-xs px-3 py-1 rounded-full font-bold">
                          {course.level}
                        </span>
                      </div>

                      <div className="p-6 text-right flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="inline-block bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded text-[11px] font-bold uppercase mb-2">
                            {course.category}
                          </span>
                          <h3 className="text-lg font-bold text-[#0F172A]">{course.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                            {course.description}
                          </p>
                          <div className="flex gap-4 mt-3 text-xs text-slate-600 font-mono">
                            <span>⏱️ المدة: {course.duration}</span>
                            <span>📚 المحاضرات: {course.lecturesCount} محاضره</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={() => setSelectedCourseForEnroll(course)}
                            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            احجز مقعدك الآن
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C. STEM TRACK SPECIAL DEDICATED HUB */}
        {activePage === 'stem-track' && settings.isStemTrackEnabled !== false && (
          <div className="space-y-12">
            
            {/* Banner detailing our Special Flagship Program */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center gap-8 justify-between relative overflow-hidden text-right text-white">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

              <div className="space-y-4 max-w-2xl relative z-10 w-full">
                <span className="inline-block bg-amber-500/20 text-amber-300 font-extrabold text-xs px-3.5 py-1 rounded-full border border-amber-500/30">
                  ⚡ البرنامج التدريبي المتكامل والتحضيري للأكاديمية
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">برنامج مسار المتفوقين والـ STEM</h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                  برنامج علمي وتأهيلي متكامل مخصص لطلاب الصف الثالث الإعدادي الراغبين في اعتلاء منصات متفوقي العلوم والتكنولوجيا STEM، ومدرسة الضبعة للطاقة النووية والتكنولوجيا التطبيقية الحديثة بمصر.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-right">
                    <span className="text-slate-500 text-[10px] block font-bold">📚 المنهج والمحتوى:</span>
                    <span className="text-slate-200 font-black text-xs block mt-0.5">🎓 {settings.stemLecturesCount || 49} محاضرة تفاعلية كاملة</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-right">
                    <span className="text-slate-500 text-[10px] block font-bold">💰 قيمة الاشتراك:</span>
                    <span className="text-emerald-400 font-black text-xs block mt-0.5 font-sans">
                      {settings.stemPreBookingEnded ? `${settings.stemPrice || 1200} ج.م` : "حجز مسبق (خصم 10% مجاناً)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto relative z-10 shrink-0 text-center">
                <a
                  href="#enroll-direct-card"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold py-4 px-8 rounded-xl text-sm transition-all shadow-lg hover:scale-[1.03] w-full lg:w-auto text-center block cursor-pointer"
                >
                  التحق بالمسار وسجّل الآن بالأسفل
                </a>
              </div>
              
              <div className="absolute top-0 bottom-0 left-0 right-0 opacity-5 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
            </div>

            {/* Direct Inline Registration Form Zone */}
            <div id="enroll-direct-card" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Info Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-white to-blue-50/20 p-6 sm:p-8 rounded-3xl border border-blue-200/50 shadow-md flex flex-col justify-between text-right space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                    💡
                    لماذا تسجل في هذا المسار معنا؟
                  </h3>
                  
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-650 font-sans">
                    <li className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#2563EB] font-bold">✔</span>
                      <span><strong>تدريب IQ شامل:</strong> بنشرح المفاهيم الأساسية للاختبار مع أسئلة معقدة لرفع ذكاء الطالب وقدرته على الحل.</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#2563EB] font-bold">✔</span>
                      <span><strong>العلوم:</strong> شرح جميع مناهج العلوم مع أسئلة تفاعلية ولضمان الدرجة النهائية في الامتحان.</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#2563EB] font-bold">✔</span>
                      <span><strong>الرياضيات:</strong> شرح جميع أساسيات والقواعد الرياضية مع أهم أسئلة الامتحان.</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#2563EB] font-bold">✔</span>
                      <span><strong>اللغة الإنجليزية:</strong> تطوير اللغة الإنجليزية للطالب لضمان ارتقاء مستواه اللغوي وليس فقط التركيز على الامتحان.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs">
                  <span className="text-blue-700 font-bold block mb-1">📢 تنبيه حجز المقعد:</span>
                  <p className="text-slate-600 leading-normal font-sans">
                    نسب القبول بمدارس STEM تتطلب الاستعداد المبكر والذكي. بتسجيلك الآن، تضمن مكاناً في مجموعاتنا التفاعلية وتحصل على أولوية المتابعة.
                  </p>
                </div>
              </div>

              {/* Form / Result Column */}
              <div className="lg:col-span-7">
                {inlineGeneratedCode ? (
                  <div className="bg-white border-2 border-emerald-500/20 p-8 rounded-3xl text-right space-y-6 shadow-lg">
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-8 h-8 text-emerald-500 animate-pulse" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {settings.stemPreBookingEnded ? "تم استقبال طلب الحجز بنجاح" : "تم حجز مقعدك المسبق بنجاح!"}
                      </h3>
                      <p className="text-xs text-slate-500">تم تسجيل بياناتك بقائمة مسار المتفوقين</p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 font-sans text-xs text-slate-700">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>الاسم المسجل:</span>
                        <span className="font-bold text-slate-900">{inlineGeneratedCode.studentName}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>قيمة الاشتراك المالي:</span>
                        <span className="font-bold text-amber-600 font-mono">
                          {settings.stemPreBookingEnded ? `${settings.stemPrice || 1200} ج.م` : "مجاني الآن (حجز مسبق)"}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center pt-2 text-center">
                        <span className="text-[10px] text-amber-600 font-extrabold uppercase">كود الطالب الخاص بك</span>
                        <span className="text-2xl font-mono font-black text-blue-600 tracking-wider bg-blue-50 px-6 py-2 rounded-xl border border-blue-100 mt-2 select-all">
                          {inlineGeneratedCode.code}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1">يرجى نسخ هذا الكود لتأكيد الدفع أو المتابعة معنا</span>
                      </div>
                    </div>

                    {!settings.stemPreBookingEnded ? (
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-xs sm:text-sm leading-relaxed">
                        🎉 <strong>تم تأكيد حجز مقعدك المسبق:</strong> لا توجد أي مدفوعات حالياً. سنقوم بالاتصال بك هاتفياً وتزويدك بمواعيد المجموعات وتفاصيل الدورة فور إطلاقها.
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-slate-805 p-4 rounded-2xl border border-amber-100 text-xs leading-relaxed space-y-2">
                        <h4 className="font-bold text-amber-800 flex items-center gap-1">
                          ⚠️ خطوات سداد قيمة الاشتراك وتفعيل الكود:
                        </h4>
                        <p>
                          يرجى تحويل قيمة الاشتراك ({settings.stemPrice || 1200} ج.م) عبر إحدى القنوات المتاحة بالأسفل، ثم أرسل لقطة الشاشة مع كود الطالب <strong>{inlineGeneratedCode.code}</strong> للواتساب:
                        </p>
                        <ul className="space-y-1 font-mono text-xs text-slate-700 text-right">
                          <li>📱 فودافون كاش: <strong>{parsePaymentInstructions(settings.paymentInstructions).walletNumber || "01274711669"}</strong></li>
                          <li>⚡ إنستاباي: <strong>{parsePaymentInstructions(settings.paymentInstructions).instapayLink || "sciteach@instapay"}</strong></li>
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={`${settings.whatsapp}?text=${encodeURIComponent(`مرحباً أكاديمية علّمني علوم. لقد سجلت في مسار المتفوقين STEM وكود الطالب الخاص بي هو: ${inlineGeneratedCode.code}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" />
                        <span>تأكيد الإرسال بالواتساب</span>
                      </a>
                      <button
                        onClick={() => setInlineGeneratedCode(null)}
                        className="bg-slate-200 hover:bg-slate-350 text-slate-700 px-6 py-3 rounded-xl text-xs font-bold"
                      >
                        حجز جديد
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInlineEnroll} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-right space-y-4">
                    <div className="border-b border-slate-100 pb-3 text-right">
                      <h3 className="text-lg font-bold text-slate-800">
                        {settings.stemPreBookingEnded ? "سجّل الآن بالمسار الأساسي" : "سجل الحجز المسبق مجاناً الآن"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        املأ بياناتك في دقيقة واحدة وسيتواصل معك منسقو المسار فوراً
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-655 font-bold">اسم الطالب بالكامل *</label>
                      <input
                        type="text"
                        required
                        value={inlineEnrollForm.name}
                        onChange={(e) => setInlineEnrollForm({ ...inlineEnrollForm, name: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="يرجى كتابة الاسم ثلاثي..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-655 font-bold">رقم الهاتف (النشط بالواتساب) *</label>
                        <input
                          type="text"
                          required
                          value={inlineEnrollForm.phone}
                          onChange={(e) => setInlineEnrollForm({ ...inlineEnrollForm, phone: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-left"
                          placeholder="01xxxxxxxxx"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-655 font-bold">نوع المسجل:</label>
                        <select
                          value={inlineEnrollForm.senderType}
                          onChange={(e) => setInlineEnrollForm({ ...inlineEnrollForm, senderType: e.target.value as 'student' | 'parent' })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="student">طالب</option>
                          <option value="parent">ولي أمر</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-650 font-bold">المدرسة الحالية:</label>
                        <input
                          type="text"
                          value={inlineEnrollForm.currentSchool}
                          onChange={(e) => setInlineEnrollForm({ ...inlineEnrollForm, currentSchool: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="اسم مدرستك الإعدادية..."
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-650 font-bold">المحافظة:</label>
                        <select
                          value={inlineEnrollForm.governorate}
                          onChange={(e) => setInlineEnrollForm({ ...inlineEnrollForm, governorate: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold rounded-xl text-sm transition-all shadow-md active:translate-y-[1px] cursor-pointer"
                    >
                      {settings.stemPreBookingEnded ? "تأكيد التسجيل والانتقال للدفع" : "تأكيد الحجز المسبق المجاني الآن"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Detailed components of the STEM program */}

            {/* Detailed components of the STEM program */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: `أكثر من ${settings.stemLecturesCount || 49} محاضرة علمية مكثفة`, desc: "تغطية مادة الاستعداد العقلي وعلم الأحياء والفيزياء الميكانيكية والكيمياء التطبيقية ومباني الرياضيات." },
                { title: "تأهيل شامل حقيقي لاختبار القبول", desc: "تمثيل يحاكي اختبارات (IQ) والاستعداد الذهني ومراجعات تراكمية للامتحانات السابقة للوزارة." },
                { title: "تدريب على المقابلات الشخصية", desc: "نصرف مخاوف الطلاب بمهارات التحدث وحل المشكلات التفاعلي أمام اللجان الأكاديمية وصياغة العروض." },
                { title: "متابعة وتقييم وتنبيه دوري", desc: "تقارير حضور متكاملة تطلع أولياء الأمور دورياً لمستوى أداء الطالب مع كشافات حلول." },
                { title: "الاختبارات الأسبوعية والواجبات", desc: "نصنع عقلية متكاملة لبيئة البحث العلمى بالدقة عبر حل أسئلة علمية غير نمطية وتنافسية." },
                { title: "دروس ومحاضرات تعريفية مجانية", desc: "بث برامج تعريفية مستمرة لإنارة الدرب وشرح الخطوات اللازمة للتقديم من اليوم الأول." },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors text-right space-y-2">
                  <span className="text-[#F59E0B] text-lg font-bold font-mono">0{idx + 1}.</span>
                  <h4 className="text-base font-bold text-[#0F172A]">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Embedded Free Sessions for STEM Track */}
            <section className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-right space-y-2">
                <span className="inline-block bg-blue-100 text-[#2563EB] font-black text-[10px] px-3 py-1 rounded-full uppercase">
                  المحاضرات والندوات المجتمعية المفتوحة
                </span>
                <h3 className="text-2xl font-extrabold text-[#0F172A]">المحاضرات والندوات المجانية</h3>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  احجز مكانك في المحاضرات التعريفية المفتوحة للاستعداد لاختبارات الذكاء والمفاهيم الكبرى
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {freeSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 sm:grid-cols-12">
                    <div className="sm:col-span-12 md:col-span-5 h-48 md:h-full bg-slate-100 relative">
                      <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        بث حي مجاني
                      </span>
                    </div>

                    <div className="sm:col-span-12 md:col-span-7 p-6 flex flex-col justify-between text-right space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{session.date}</span>
                          {session.isStemTrack !== undefined && (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${session.isStemTrack ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-[#2563EB]"}`}>
                              {session.isStemTrack ? "✨ مسار المتفوقين (STEM)" : "📚 مسارات أخرى"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-1.5 leading-snug">
                          {session.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                          {session.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 font-sans">
                        <span className="text-[11px] text-slate-500">
                          حجز مقعداً حتى الآن: <span className="text-[#F59E0B] font-bold font-mono">{session.registeredCount}</span> طالب
                        </span>
                        
                        <button
                          onClick={() => navigateTo('/free-session/' + session.slug)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          التسجيل المجاني الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* D. STANDALONE FREE SESSION LANDING PAGE (DYNAMICS FOR FREE SESSIONS) */}
        {typeof activePage === 'object' && activePage.type === 'free-session' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            
            {/* Back to free sessions */}
            <button
              onClick={() => navigateTo('/free-sessions')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الرجوع للمحاضرات والندوات</span>
            </button>

            {/* Standalone session profile */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-right space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="inline-block bg-red-600 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold animate-pulse mb-3">
                    ندوة واستشارة مجانية
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900">{activePage.data.title}</h2>
                  <p className="text-xs mx-auto text-slate-500 mt-2 font-mono flex items-center gap-1.5 justify-start">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>ميعاد الندوة المنتظر: {activePage.data.date}</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="block text-2xl font-black text-amber-600 font-mono">{activePage.data.registeredCount}</span>
                  <span className="text-[10px] text-slate-500 block font-bold">طالب مسجل حتى الآن</span>
                </div>
              </div>

              {/* Grid content and Reservation Form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Info detailing */}
                <div className="md:col-span-6 space-y-4">
                  <img src={activePage.data.image} alt={activePage.data.title} className="w-full h-48 sm:h-64 object-cover rounded-2xl border border-slate-200 opacity-95 shadow-sm" />
                  <p className="text-sm text-slate-650 leading-relaxed font-sans">
                    {activePage.data.description}
                  </p>
                  
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-blue-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      ملاحظة من إدارة علمني علوم:
                    </h4>
                    <p className="text-slate-600 text-xs leading-normal">
                      بمجرد ملء استمارة الحجز الديناميكية في الاتجاه المقابل، سيقوم النظام تلقائياً بربط بياناتك بالبث وتلقي رسالة الواتساب التعريفية بكود الطالب المخصص لك مجاناً.
                    </p>
                  </div>
                </div>

                {/* Form dynamic renderer */}
                <div className="md:col-span-6">
                  {dynamicFormSuccess ? (
                    <div className="bg-white border border-emerald-100 p-8 rounded-2xl text-center space-y-4 h-full flex flex-col justify-center items-center shadow-sm">
                      <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
                      <h3 className="text-xl font-bold text-slate-900">يا بطل، تم حجز مقعدك بنجاح!</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        تم تسجيل بياناتك بنجاح في سجل حضور الندوة مجاناً. كود الطالب المخصص لك تم تكوينه وإرفاقه بقائمة الطلبات. سنقوم بإرسال دعوة رابط البث على جروب الأكاديمية قريباً!
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-100 w-full text-center">
                        <p className="text-sm font-semibold text-blue-600 mb-3">
                          ⭐ هل تود الانضمام للمسار الشامل المتكامل والتحضير الفعلي لمدارس المتفوقين؟
                        </p>
                        <button
                          onClick={() => {
                            const stemCourse = getStemTrackCourse();
                            setSelectedCourseForEnroll(stemCourse);
                            setDynamicFormSuccess(false);
                          }}
                          className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full text-center"
                        >
                          <Award className="w-5 h-5 text-white" />
                          سجل في المسار الكامل الآن
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Match the form to formId or fallback to general form
                    (() => {
                      const matchedForm = forms.find(f => f.id === activePage.data.formId) || forms[0];
                      return (
                        <div key={matchedForm.id}>
                          <DynamicFormRenderer
                            form={matchedForm}
                            onSubmit={handleDynamicFormSubmit}
                            submitLabel="احجز الآن مجاناً وانضم للمحاضرة"
                          />
                        </div>
                      );
                    })()
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* E. LIST OF FREE SESSIONS */}
        {activePage === 'free-sessions' && (
          <div className="space-y-10">
            <div className="text-right border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-slate-900">الندوات والمحاضرات المجتمعية المفتوحة</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                يمكنك التسجيل في أي محاضرة تعريفية أو برنامج تأسيسي تم برمجته خصيصاً للتثقيف والإرشاد التربوي
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {freeSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-350 hover:shadow-md transition-all flex flex-col justify-between shadow-sm">
                  <div className="h-48 bg-slate-100 relative">
                    <img src={session.image} alt={session.title} className="w-full h-full object-cover opacity-95" />
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce">
                      بث مجاني
                    </span>
                  </div>

                  <div className="p-6 text-right flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{session.date}</span>
                        {session.isStemTrack !== undefined && (
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${session.isStemTrack ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-blue-50 text-blue-805 border border-blue-200"}`}>
                            {session.isStemTrack ? "✨ مسار متفوقين (STEM)" : "📚 مسارات أخرى"}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{session.title}</h3>
                      <p className="text-xs text-slate-650 line-clamp-3 mt-1.5 leading-relaxed">
                        {session.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] text-slate-600 font-bold">
                        المقاعد المأخوذة: {session.registeredCount} طالب
                      </span>
                      <button
                        onClick={() => navigateTo(`/free-session/${session.slug}`)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                      >
                        التسجيل وتعبئة الاستمارة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* F. STANDALONE SINGLE NEWS PAGE */}
        {typeof activePage === 'object' && activePage.type === 'news-post' && (
          <div className="space-y-8 max-w-3xl mx-auto text-right">
            
            {/* Back to news */}
            <button
              onClick={() => navigateTo('/news')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الرجوع لسجل الأخبار</span>
            </button>

            <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 sm:p-10 space-y-6 shadow-sm">
              
              <div className="space-y-3">
                <div className="flex items-center justify-start gap-4 text-xs text-slate-500 font-mono">
                  <span>🗓️ نشر في: {activePage.data.date}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {activePage.data.title}
                </h2>
              </div>

              <img src={activePage.data.image} alt={activePage.data.title} className="w-full h-64 sm:h-[400px] object-cover rounded-2xl border border-slate-200 opacity-95 shadow-sm" />

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed font-sans pt-4 space-y-4 border-t border-slate-100 text-right">
                {activePage.data.content && activePage.data.content.includes('<') && activePage.data.content.includes('>') ? (
                  <div dangerouslySetInnerHTML={{ __html: activePage.data.content }} className="rich-news-content space-y-4 text-slate-700" />
                ) : (
                  <div className="whitespace-pre-line text-slate-700">{activePage.data.content}</div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs gap-3">
                <span className="text-slate-500 font-mono">الرابط الفرعي للخبر: /news/{activePage.data.slug}</span>
                <span className="text-amber-600 font-bold">إدارة منظومة علّمني علوم العلمية</span>
              </div>

            </article>

          </div>
        )}

        {/* G. ALL NEWS SYSTEM */}
        {activePage === 'news' && (
          <div className="space-y-10">
            <div className="text-right border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-slate-900">بلاغات وأنباء علّمني علوم</h2>
              <p className="text-sm text-slate-600 mt-1.5">
                تابع أحدث الإعلانات والشروط الوزارية واللقاءات التأسيسية التي تخص مسارات التميز لعام 2026
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsList.map((news) => (
                <div key={news.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between text-right space-y-4 hover:border-slate-350 hover:shadow-md transition-all shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>🗓️ نشر في: {news.date}</span>
                    </div>
                    <img src={news.image} alt={news.title} className="w-full h-40 object-cover rounded-xl opacity-95" />
                    <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug" onClick={() => navigateTo(`/news/${news.slug}`)}>
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {stripHtml(news.content)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">/news/{news.slug}</span>
                    <button
                      onClick={() => navigateTo(`/news/${news.slug}`)}
                      className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>قراءة الخبر كاملاً</span>
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H. CONTACT VIEW PAGE */}
        {activePage === 'contact' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            <div className="text-right border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-black text-slate-900">تواصل معنا واستفسر</h2>
              <p className="text-sm text-slate-600 mt-1.5">
                يسعدنا الرد على جميع تساؤلات أولياء الأمور والطلاب وتوفير الدعم لتسجيل الكورسات
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Contact info info columns */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-right shadow-sm">
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">أكاديمية علّمني علوم</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    منظومة متكاملة لخدمة طلاب التفوق والـ STEM تحت إشراف نخبة من كبار ومستشاري المناهج.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <a href="tel:01274711669" className="text-sm font-mono text-slate-700 hover:text-blue-600 transition-colors">01274711669</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <a href="mailto:info@allimnyOloom.youssefhatem.com" className="text-xs sm:text-sm font-mono text-slate-700 hover:text-amber-600 transition-colors break-all block">info@allimnyOloom.youssefhatem.com</a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form submit input column */}
              <div className="md:col-span-7">
                {contactSuccess ? (
                  <div className="bg-white border border-emerald-100 p-8 rounded-3xl text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">وصلت رسالتك بسلام، يا بطل!</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      نشكرك على تواصلك مع إدارة "علّمني علوم". تم تسجيل استفسارك رقمياً وتم إضافته للوحة تحكم رسائل الإدارة. سنقوم بالتواصل والرد الهاتفي عليك وعلى البريد المرفق خلال 24 ساعة بحد أقصى!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-right shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">أرسل رسالة أو استفسار عاجل للاستاذ</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-bold">الاسم بالكامل *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="اكتب اسمك للمتابعة..."
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-bold">رقم الهاتف النشط (واتساب) *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder="01xxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-bold">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-bold">تفاصيل الاستفسار أو الرسالة بالتفصيل *</label>
                      <textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={5}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="ماذا تود معرفته عن المسار الشامل أو ندوة الضبعة والقبول؟..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-l from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 ml-1" />
                      <span>إرسال الرسالة لإدارة الأكاديمية</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}


      </main>

      {/* --- FOOTER GENERAL BRANDING --- */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-right text-sm">
          
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base">{t("علّمني علوم الأكاديمية", "Allimny Oloom Academy")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("منصة تعليمية مبتكرة تجمع بين جودة التعليم الأكاديمي وصناعة مهارات المستقبل. نؤازر رحلتكم للتفوق والدخول لمدارس متفوقي المفاعلات والعلوم.", "An innovative educational platform combining premium academic standards with futuristic skills. We support your strive to join STEM & elite nuclear schools.")}
            </p>
            <p className="text-[10px] text-amber-500 font-bold block">
              "{t("تعلم اليوم، قد الغد", "Learn Today, Lead Tomorrow")}"
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">{t("روابط سريعة", "Quick Links")}</h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => navigateTo('/')} className={`text-slate-400 hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} block cursor-pointer`}>{t("الصفحة الرئيسية", "Academy Home")}</button>
              {settings.isStemTrackEnabled !== false && (
                <button onClick={() => navigateTo('/stem-track')} className={`text-slate-400 hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} block cursor-pointer`}>{t("مسار المتفوقين STEM", "STEM Track")}</button>
              )}
              <button onClick={() => navigateTo('/courses')} className={`text-slate-400 hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} block cursor-pointer`}>{t("الكورسات والحقائب", "Courses & Kits")}</button>
              <button onClick={() => navigateTo('/free-sessions')} className={`text-slate-400 hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} block cursor-pointer`}>{t("الندوات التأسيسية المجانية", "Free Intro Workshops")}</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">{t("التواصل الاجتماعي", "Social Media")}</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400 font-mono">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className={`hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-1`}>🌐 {t("فيسبوك الأكاديمية", "Academy Facebook")}</a>
              {settings.whatsappChannel && (
                <a href={settings.whatsappChannel} target="_blank" rel="noreferrer" className={`hover:text-emerald-400 text-emerald-300 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-1`}>🟢 {t("قناة الواتساب الرسمية", "WhatsApp Channel")}</a>
              )}
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className={`hover:text-white ${lang === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-1`}>🎥 {t("قناة اليوتيوب الرسمية", "Official YouTube")}</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">{t("الدعم الفني والإداري", "Support & Admin")}</h4>
            <div className="text-xs text-white space-y-2 font-bold">
              <p className="flex items-center gap-1.5 text-white font-sans">
                {t("الهاتف", "Phone")}: <span className="underline">01274711669</span>
              </p>
              <p className="flex items-center gap-1.5 text-white font-sans">
                {t("البريد", "Email")}: <span className="underline select-all">info@allimnyOloom.youssefhatem.com</span>
              </p>
              <p className="text-[10px] bg-slate-900 p-2 rounded text-slate-500 border border-slate-800 font-normal">
                {t("جميع الحقوق محفوظة © " + new Date().getFullYear() + " لأكاديمية علمني علوم ومدرسيها.", "All rights reserved © " + new Date().getFullYear() + " Allimny Oloom Academy.")}
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* --- CONFIRMATION & BILLING MODAL (PAID COURSE BOOKING) --- */}
      <AnimatePresence>
        {selectedCourseForEnroll && !generatedCodeResult && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-right overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-blue-500/20 max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-5 relative"
            >
              <button 
                onClick={() => setSelectedCourseForEnroll(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] bg-blue-900/40 text-blue-400 border border-blue-900/20 px-3 py-1 rounded-full font-bold">
                  {selectedCourseForEnroll.category}
                </span>
                {isStemCourse(selectedCourseForEnroll) ? (
                  <>
                    <h3 className="text-xl font-black text-white mt-2">حجز مسبق معتمد لمسار المتفوقين</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      كورس: <span className="text-slate-200 font-bold">{selectedCourseForEnroll.title}</span> • قيمة الحجز: <span className="text-emerald-405 font-black text-emerald-400">؟؟ انتظر قريباً</span>
                    </p>
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs p-3 rounded-xl mt-2 leading-relaxed">
                      ⚠️ <strong>تنبيه الحجز المسبق:</strong> قيمة الحجز مجانية بالكامل ومؤجلة حالياً. لا حاجة لإرسال أي أموال أو تحصيل مالي الآن. ستنتظر حتى إصدار التسعير النهائي المخفض وإطلاق البث رسمياً.
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mt-2">تسجيل وحجز مقعد بالكورس الشامل</h3>
                    <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 mt-3 space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-xs text-slate-400">اسم الكورس:</span>
                        <span className="text-sm text-slate-200 font-bold">{selectedCourseForEnroll.title}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-xs text-slate-400">سعر الكورس:</span>
                        <span className="text-sm text-amber-500 font-extrabold">{selectedCourseForEnroll.price} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-xs text-slate-400">عدد المحاضرات:</span>
                        <span className="text-sm text-slate-300 font-bold">{selectedCourseForEnroll.lecturesCount} محاضرة</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">مدة السماح للدفع:</span>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">ثلاث ايام بحد اقصى ساعة قبل بدا الكورس</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleCourseEnroll} className="space-y-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-300 font-bold">اسم الطالب بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    placeholder="يرجى كتابة اسم الطالب بالكامل"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-300 font-bold">رقم هاتف الطالب *</label>
                    <input
                      type="text"
                      required
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 font-mono text-left"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-300 font-bold">نوع المسجل:</label>
                    <select
                      value={enrollForm.senderType}
                      onChange={(e) => setEnrollForm({ ...enrollForm, senderType: e.target.value as 'student' | 'parent' })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
                    >
                      <option value="student">طالب</option>
                      <option value="parent">ولي أمر طالب</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-300 font-bold">المحافظة السكنية:</label>
                    <select
                      value={enrollForm.governorate}
                      onChange={(e) => setEnrollForm({ ...enrollForm, governorate: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 text-right"
                    >
                      {GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-300 font-bold">البريد الإلكتروني المذكور (اختياري)</label>
                  <input
                    type="email"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 font-mono text-left"
                    placeholder="student@example.com"
                  />
                </div>

                {!isStemCourse(selectedCourseForEnroll) && (
                  <div className="bg-slate-950/75 p-4 rounded-xl border border-slate-800 space-y-2 text-right">
                    <label className="text-xs text-slate-300 font-bold block">🏷️ هل لديك كوبون خصم؟</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="أدخل كود الكوبون هنا..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono text-center uppercase"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const cleaned = couponCode.trim().toUpperCase();
                          if (!cleaned) return;
                          
                          setIsApplyingCoupon(true);
                          setCouponError('');
                          setCouponSuccess('');
                          setAppliedCoupon(null);

                          try {
                            // Query backend directly
                            const { data, error } = await supabase.from('ao_coupons').select('*').eq('code', cleaned).single();
                            
                            if (error || !data) {
                              setCouponError('كوبون الخصم غير صحيح أو غير موجود');
                              setIsApplyingCoupon(false);
                              return;
                            }

                            if (!data.isActive) {
                              setCouponError('هذا الكوبون تم إيقافه مؤقتاً');
                              setIsApplyingCoupon(false);
                              return;
                            }

                            if (data.expiryDate && new Date(data.expiryDate) < new Date(new Date().toDateString())) {
                              setCouponError('صلاحية هذا الكوبون قد انتهت');
                              setIsApplyingCoupon(false);
                              return;
                            }

                            if (data.maxUsages && data.maxUsages > 0 && (data.usages || 0) >= data.maxUsages) {
                              setCouponError('لقد وصل هذا الكوبون للحد الأقصى من الاستخدام');
                              setIsApplyingCoupon(false);
                              return;
                            }

                            setAppliedCoupon(data as Coupon);
                            setCouponSuccess(`تم تطبيق الخصم بنجاح: خصم ${data.discountType === 'percent' ? `${data.discountValue}%` : `${data.discountValue} ج.م`}`);
                          } catch (err) {
                            setCouponError('حدث خطأ أثناء التحقق من الكوبون. حاول مجدداً.');
                          } finally {
                            setIsApplyingCoupon(false);
                          }
                        }}
                        disabled={isApplyingCoupon}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-all shrink-0"
                      >
                        {isApplyingCoupon ? 'جاري التحقق...' : 'تطبيق'}
                      </button>
                    </div>

                    {couponError && <p className="text-[11px] text-red-400 font-semibold mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-emerald-400 font-bold mt-1">{couponSuccess}</p>}

                    {appliedCoupon && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-2.5 rounded-lg mt-2 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedCoupon(null);
                            setCouponCode('');
                            setCouponSuccess('');
                          }}
                          className="text-[10px] bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-red-400 px-2 py-0.5 rounded cursor-pointer transition-all"
                        >
                          إلغاء
                        </button>
                        <span>
                          السعر بعد الخصم: <strong className="text-amber-500 text-sm font-mono">{appliedCoupon.discountType === 'percent' ? Math.round(selectedCourseForEnroll.price * (1 - appliedCoupon.discountValue / 100)) : Math.max(0, selectedCourseForEnroll.price - appliedCoupon.discountValue)} ج.م</strong> بدلاً من <span className="line-through text-slate-500 font-mono">{selectedCourseForEnroll.price} ج.م</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 bg-gradient-to-l from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg active:translate-y-[1px] cursor-pointer"
                >
                  تاكيد البيانات والانتقال للدفع
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RECONCILIATION RESULT MODAL (GENERATE AOXXXXXXXX ENROLL CODE) --- */}
      <AnimatePresence>
        {generatedCodeResult && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 text-right">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/30 max-w-lg w-full max-h-[90vh] flex flex-col rounded-3xl p-6 sm:p-8 relative text-right"
            >
              <button 
                onClick={() => {
                  setGeneratedCodeResult(null);
                  setSelectedCourseForEnroll(null);
                }}
                className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto pr-1 pb-2 space-y-6 flex-1 stylish-scrollbar">
                <div className="text-center space-y-2 mt-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">مبارك تم حجز مقعدك يرجى الدفع كي لا تفقد المقعد</h3>
                <p className="text-xs text-slate-400">تم حجز طلب انتسابك للكورس وقيد تأكيد التحويل المالي</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                {generatedCodeResult.isStemCourse && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-right">
                    <span className="text-[10px] text-emerald-450 font-extrabold uppercase block font-sans">🎉 حجز مسبق مجاني معتمد</span>
                    <p className="text-[11px] text-slate-300 mt-1">تم تسجيل وحفظ مقعدك بنجاح لمسار المتفوقين. لا يتطلب منك دفع أي أموال حالياً حتى يتم تحديد السعر النهائي وتفعيل المسار رسمياً!</p>
                  </div>
                )}

                <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                  <span className="text-xs text-slate-400">الاسم المسجل:</span>
                  <span className="text-sm font-bold text-slate-100">{generatedCodeResult.studentName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                  <span className="text-xs text-slate-400 text-right">كورس ومسار التدريب:</span>
                  <span className="text-xs font-bold text-slate-100 text-left truncate max-w-[200px]">{generatedCodeResult.courseTitle}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                  <span className="text-xs text-slate-400">قيمة الاشتراك المطلوبة:</span>
                  <span className="text-sm font-bold text-amber-500">
                    {typeof generatedCodeResult.price === 'number' ? `${generatedCodeResult.price} ج.م` : generatedCodeResult.price}
                  </span>
                </div>

                {/* EXTREMELY UNIQUE STUDENT ID - AOXXXXXXXX */}
                <div className="flex flex-col items-center justify-center pt-2 text-center">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wide">كود الطالب الأكاديمي الحصري والفريد</span>
                  <span className="text-2xl font-mono font-black text-blue-400 tracking-wider select-all cursor-pointer bg-blue-950/40 px-6 py-2 rounded-xl border border-blue-900/30 mt-2">
                    {generatedCodeResult.code}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 font-mono">اضغط نقرتين لتحديد ونسخ الكود لاستخدامه في التحصيل والدفع والبحث</span>
                </div>
              </div>

              {(() => {
                const paymentSetup = parsePaymentInstructions(settings.paymentInstructions);
                if (generatedCodeResult.isStemCourse) {
                  return (
                    <div className="space-y-4 text-right bg-slate-950/85 p-5 rounded-3xl border border-slate-800/85">
                      <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 justify-start">
                        <CheckCircle className="w-4 h-4 text-emerald-405" />
                        حالة الحجز المسبق لبرنامج المتفوقين:
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        تم قبول وتسجيل بياناتك في قائمة الطلاب المعتمدين والمقرر بدء دراستهم في برنامج الـ STEM والتحضير لمدارس المتفوقين والضبعة النووية. لا حاجة لدفع أي أموال عبر المحافظ أو الحسابات البنكية حالياً. سنقوم بالاتصال بك فور انتهاء عملية التنسيق لتأكيد موعد المحاضرات والانطلاق.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-4 text-right bg-slate-950/85 p-5 rounded-3xl border border-slate-800/80">
                    <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 justify-start border-b border-slate-900 pb-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      خيارات وقنوات التحويل المالي المتاحة:
                    </h4>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3 rounded-xl text-xs leading-relaxed">
                      <strong>تعليمات هامة لتفعيل الحساب:</strong> يرجى إرسال صورة (سكرين شوت) لإيصال الدفع مع الكود الخاص بك <strong>{generatedCodeResult.code}</strong> على الواتساب ليتم تفعيل حسابك فوراً.
                    </div>

                    {/* Structured Channels Grid */}
                    <div className="space-y-2.5">
                      {/* Master Wallet */}
                      {paymentSetup.walletNumber && (
                        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl text-xs gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopy(paymentSetup.walletNumber, 'wallet')}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0"
                          >
                            {copiedText === paymentSetup.walletNumber ? '✓ تم النسخ' : '📋 نسخ الرقم'}
                          </button>
                          <div className="flex-1 min-w-0 text-right">
                            <span className="text-[10px] text-slate-500 block">📱 محفظة كاش (فودافون كاش / اتصالات)</span>
                            <span className="font-mono text-xs font-bold text-slate-200 select-all">{paymentSetup.walletNumber}</span>
                          </div>
                        </div>
                      )}

                      {/* Instapay */}
                      {paymentSetup.instapayLink && (
                        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl text-xs gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopy(paymentSetup.instapayLink, 'instapay')}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0"
                          >
                            {copiedText === paymentSetup.instapayLink ? '✓ تم النسخ' : '📋 نسخ العنوان'}
                          </button>
                          <div className="flex-1 min-w-0 text-right">
                            <span className="text-[10px] text-slate-500 block">⚡ حساب إنستاباي للدفع اللحظي (Instapay ID)</span>
                            <span className="font-mono text-xs font-bold text-slate-200 select-all">{paymentSetup.instapayLink}</span>
                          </div>
                        </div>
                      )}

                      {/* Fawry */}
                      {paymentSetup.fawryNumber && (
                        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl text-xs gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopy(paymentSetup.fawryNumber, 'fawry')}
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0"
                          >
                            {copiedText === paymentSetup.fawryNumber ? '✓ تم النسخ' : '📋 نسخ الكود'}
                          </button>
                          <div className="flex-1 min-w-0 text-right">
                            <span className="text-[10px] text-slate-500 block">⚡ رقم أو كود دفع فوري (Fawry Code)</span>
                            <span className="font-mono text-xs font-bold text-amber-400 select-all">{paymentSetup.fawryNumber}</span>
                          </div>
                        </div>
                      )}

                      {/* Dynamic added extra payment methods */}
                      {paymentSetup.methods && paymentSetup.methods.filter(m => m.id !== 'legacy-wallet' && m.id !== 'legacy-instapay' && m.id !== 'default-vdf' && m.id !== 'default-instapay').map((method) => (
                        <div key={method.id} className="bg-slate-900/40 border border-slate-800/60 px-3.5 py-2.5 rounded-xl text-xs flex flex-col gap-1.5 text-right">
                          <div className="flex items-center justify-between border-b border-slate-950 pb-1.5 gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(method.account, method.id)}
                              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0"
                            >
                              {copiedText === method.account ? '✓ تم النسخ' : '📋 نسخ الحساب'}
                            </button>
                            <div className="flex items-center gap-1.5 font-bold text-slate-300">
                              <span>
                                {method.type === 'wallet' ? '📱 محفظة كاش' :
                                 method.type === 'instapay' ? '💳 بي إنستاباي' :
                                 method.type === 'fawry' ? '⚡ فوري' : '📦 وسيلة'}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span>{method.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="font-mono font-bold text-slate-100 select-all">{method.account}</span>
                            {method.extraFees && (
                              <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                {method.extraFees}
                              </span>
                            )}
                          </div>
                          {method.instructions && (
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed bg-slate-950/20 p-1.5 rounded">{method.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* General/fallback guidelines */}
                    {paymentSetup.generalInstructions && (
                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                        <span className="text-[9px] text-slate-500 block mb-1">📝 تعليمات وإرشادات التفعيل:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {paymentSetup.generalInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
              </div>

              <div className="flex gap-2 pt-4 mt-2 shrink-0 border-t border-slate-800">
                <a
                  href={`${settings.whatsapp}?text=${encodeURIComponent(`مرحباً أكاديمية علّمني علوم. لقد قمت بالتسجيل في كورس ${generatedCodeResult.courseTitle} وكود الطالب الخاص بي هو: ${generatedCodeResult.code}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t("تأكيد الإرسال عبر الواتساب", "Confirm Sending via WhatsApp")}</span>
                </a>
                
                <button
                  onClick={() => {
                    setGeneratedCodeResult(null);
                    setSelectedCourseForEnroll(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
