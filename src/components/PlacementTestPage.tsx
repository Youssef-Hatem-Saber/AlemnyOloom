import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Award, 
  HelpCircle,
  BookOpen,
  BrainCircuit,
  Binary,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PlacementQuestion, PlacementSubmission } from '../types';
import { 
  GENERAL_QUESTIONS, 
  INTEREST_QUESTIONS, 
  runRecommendationEngine, 
  selectAdaptiveQuestions 
} from '../data/placementQuestions';

interface PlacementTestPageProps {
  submissions: PlacementSubmission[];
  onAddSubmission: (submission: PlacementSubmission) => Promise<void>;
  onNavigateHome: () => void;
}

export default function PlacementTestPage({ 
  submissions = [], 
  onAddSubmission, 
  onNavigateHome 
}: PlacementTestPageProps) {
  // Candidate form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [chosenTrack, setChosenTrack] = useState('');
  
  // Workflow states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Test states
  const [examQuestions, setExamQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOption }
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Results states
  const [finalScore, setFinalScore] = useState(0);
  const [assignedLevel, setAssignedLevel] = useState('');
  const [suggestedTrack, setSuggestedTrack] = useState<string | undefined>(undefined);
  const [trackReason, setTrackReason] = useState<string | undefined>(undefined);
  const [submissionDate, setSubmissionDate] = useState('');
  const [whatsappTriggered, setWhatsappTriggered] = useState(false);

  // Check LocalStorage on mount to resume in-progress placement test
  useEffect(() => {
    const isRunning = localStorage.getItem('ao_pt_running') === 'true';
    if (isRunning) {
      const savedName = localStorage.getItem('ao_pt_name') || '';
      const savedPhone = localStorage.getItem('ao_pt_phone') || '';
      const savedEmail = localStorage.getItem('ao_pt_email') || '';
      const savedTrack = localStorage.getItem('ao_pt_chosen_track') || '';
      const savedQuestionsStr = localStorage.getItem('ao_pt_questions') || '[]';
      const savedIndexStr = localStorage.getItem('ao_pt_index') || '0';
      const savedAnswersStr = localStorage.getItem('ao_pt_answers') || '{}';
      const savedStartTimeStr = localStorage.getItem('ao_pt_start_time') || '0';
      
      try {
        const parsedQuestions = JSON.parse(savedQuestionsStr);
        const parsedAnswers = JSON.parse(savedAnswersStr);
        const parsedIndex = parseInt(savedIndexStr, 10);
        const parsedStartTime = parseInt(savedStartTimeStr, 10);
        
        if (parsedQuestions.length > 0) {
          setName(savedName);
          setPhone(savedPhone);
          setEmail(savedEmail);
          setChosenTrack(savedTrack);
          setExamQuestions(parsedQuestions);
          setCurrentQuestionIndex(parsedIndex);
          setAnswers(parsedAnswers);
          setStartTime(parsedStartTime);
          setFormSubmitted(true);
          setStarted(true);
          
          // Calculate elapsed time from start time
          const elapsed = Math.floor((Date.now() - parsedStartTime) / 1000);
          setElapsedSeconds(elapsed > 0 ? elapsed : 0);
        }
      } catch (e) {
        console.error("Failed to restore saved test progress:", e);
      }
    }
  }, []);

  // Timer interval hook
  useEffect(() => {
    if (!started || completed) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        localStorage.setItem('ao_pt_elapsed', next.toString());
        return next;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [started, completed]);

  // Sync answers & position to LocalStorage to save progress
  useEffect(() => {
    if (started && !completed) {
      localStorage.setItem('ao_pt_answers', JSON.stringify(answers));
      localStorage.setItem('ao_pt_index', currentQuestionIndex.toString());
    }
  }, [answers, currentQuestionIndex, started, completed]);

  // Prevent multiple attempts within 24 hours
  const checkEmailAttempts = (targetEmail: string): boolean => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    // Check locally in memory (synced DB submissions)
    const localDuplicate = submissions.some(sub => {
      if (sub.email.trim().toLowerCase() === cleanEmail) {
        const submitTime = new Date(sub.submittedAt).getTime();
        return submitTime > oneDayAgo;
      }
      return false;
    });

    // Check localStorage saved submission timestamp
    const savedLastSubTime = localStorage.getItem(`ao_pt_sub_time_${cleanEmail}`);
    let storageDuplicate = false;
    if (savedLastSubTime) {
      const lastTime = parseInt(savedLastSubTime, 10);
      if (lastTime > oneDayAgo) {
        storageDuplicate = true;
      }
    }

    return localDuplicate || storageDuplicate;
  };

  // Form Validation and starting the exam
  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("يرجى إدخال الاسم بالكامل.");
      return;
    }
    if (!phone.trim() || !/^01[0-9]{9}$/.test(phone.trim())) {
      alert("يرجى إدخال رقم هاتف مصري صحيح يتكون من 11 رقماً ويبدأ بـ 01.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    if (!chosenTrack) {
      alert("يرجى اختيار التخصص أو تحديد خيار لا أستطيع التحديد.");
      return;
    }

    // Check duplicate attempt
    if (checkEmailAttempts(email)) {
      alert("🚨 تنبيه: عذراً، لا يُسمح بإجراء اختبار تحديد المستوى أكثر من مرة واحدة خلال 24 ساعة لنفس البريد الإلكتروني. يرجى الانتظار والمحاولة لاحقاً.");
      return;
    }

    // Prepare questions
    const generatedQuestions = selectAdaptiveQuestions(chosenTrack);
    setExamQuestions(generatedQuestions);
    
    // Set timing
    const nowTime = Date.now();
    setStartTime(nowTime);
    setElapsedSeconds(0);
    
    // Set states
    setFormSubmitted(true);
    setStarted(true);

    // Save states to prevent cheating on reload
    localStorage.setItem('ao_pt_running', 'true');
    localStorage.setItem('ao_pt_name', name);
    localStorage.setItem('ao_pt_phone', phone);
    localStorage.setItem('ao_pt_email', email.trim().toLowerCase());
    localStorage.setItem('ao_pt_chosen_track', chosenTrack);
    localStorage.setItem('ao_pt_questions', JSON.stringify(generatedQuestions));
    localStorage.setItem('ao_pt_answers', JSON.stringify({}));
    localStorage.setItem('ao_pt_index', '0');
    localStorage.setItem('ao_pt_start_time', nowTime.toString());
  };

  // Question selection helper
  const handleSelectOption = (option: string) => {
    const currentQ = isAnsweringInterests() 
      ? INTEREST_QUESTIONS[currentQuestionIndex - examQuestions.length]
      : examQuestions[currentQuestionIndex];
      
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const isAnsweringInterests = () => {
    return chosenTrack === 'لا أستطيع تحديد المسار' && currentQuestionIndex >= examQuestions.length;
  };

  const getCurrentQuestionText = () => {
    if (isAnsweringInterests()) {
      return INTEREST_QUESTIONS[currentQuestionIndex - examQuestions.length].question;
    }
    return examQuestions[currentQuestionIndex]?.question;
  };

  const getCurrentOptions = () => {
    if (isAnsweringInterests()) {
      return INTEREST_QUESTIONS[currentQuestionIndex - examQuestions.length].options.map(opt => opt.text);
    }
    return examQuestions[currentQuestionIndex]?.options || [];
  };

  const isAnswered = () => {
    const currentQ = isAnsweringInterests()
      ? INTEREST_QUESTIONS[currentQuestionIndex - examQuestions.length]
      : examQuestions[currentQuestionIndex];
    return !!answers[currentQ?.id];
  };

  const handleNext = () => {
    if (!isAnswered()) {
      alert("الرجاء الإجابة على السؤال الحالي للانتقال للتالي.");
      return;
    }

    const totalSteps = chosenTrack === 'لا أستطيع تحديد المسار' 
      ? examQuestions.length + INTEREST_QUESTIONS.length
      : examQuestions.length;

    if (currentQuestionIndex < totalSteps - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinalSubmission();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Final submit handler
  const handleFinalSubmission = async () => {
    setCompleted(true);
    
    // 1. Calculate Score
    let score = 0;
    examQuestions.forEach(q => {
      const studentAns = answers[q.id];
      if (studentAns && studentAns.trim() === q.correctAnswer.trim()) {
        score += q.points || 5;
      }
    });

    // Score conversion out of 100
    const maxScore = examQuestions.reduce((acc, curr) => acc + (curr.points || 5), 0);
    const convertedScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    setFinalScore(convertedScore);

    // 2. Determine Level
    let levelName = 'Level 0 - Beginner';
    if (convertedScore >= 90) {
      levelName = 'Level 4 - Professional';
    } else if (convertedScore >= 80) {
      levelName = 'Level 3 - Advanced';
    } else if (convertedScore >= 65) {
      levelName = 'Level 2 - Intermediate';
    } else if (convertedScore >= 40) {
      levelName = 'Level 1 - Foundation';
    }
    setAssignedLevel(levelName);

    // 3. Recommendation Engine if track is undecided
    let suggested: string | undefined = undefined;
    let reason: string | undefined = undefined;
    if (chosenTrack === 'لا أستطيع تحديد المسار') {
      const recommendation = runRecommendationEngine(answers);
      suggested = recommendation.track;
      reason = recommendation.reason;
      setSuggestedTrack(suggested);
      setTrackReason(reason);
    }

    // 4. Set submission date & time details
    const submissionDateStr = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('ar-EG');
    const formattedTime = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    setSubmissionDate(formattedDate + ' ' + formattedTime);

    // 5. Construct Submission Object
    const submissionId = `sub_pt_${Date.now()}`;
    const newSubmission: PlacementSubmission = {
      id: submissionId,
      name,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      chosenTrack,
      suggestedTrack: suggested,
      trackReason: reason,
      score: convertedScore,
      level: levelName,
      submittedAt: submissionDateStr,
      endTime: formattedTime,
      whatsappOpened: false, // Updated if they complete redirection
      durationSeconds: elapsedSeconds
    };

    // 6. Push to DB (Supabase / local sync)
    try {
      await onAddSubmission(newSubmission);
    } catch (err) {
      console.warn("Failed to sync submission to Cloud DB:", err);
    }

    // 7. Save attempts locally to enforce 24-hour limit
    localStorage.setItem(`ao_pt_sub_time_${email.trim().toLowerCase()}`, Date.now().toString());

    // 8. Clean up exam states in LocalStorage
    localStorage.removeItem('ao_pt_running');
    localStorage.removeItem('ao_pt_name');
    localStorage.removeItem('ao_pt_phone');
    localStorage.removeItem('ao_pt_email');
    localStorage.removeItem('ao_pt_chosen_track');
    localStorage.removeItem('ao_pt_questions');
    localStorage.removeItem('ao_pt_answers');
    localStorage.removeItem('ao_pt_index');
    localStorage.removeItem('ao_pt_start_time');
    localStorage.removeItem('ao_pt_elapsed');

    // 9. Save last completed result to local storage for persistence on refresh
    localStorage.setItem('ao_pt_completed_status', 'true');
    localStorage.setItem('ao_pt_last_result', JSON.stringify({
      name,
      phone,
      email,
      chosenTrack,
      suggestedTrack: suggested,
      trackReason: reason,
      score: convertedScore,
      level: levelName,
      date: formattedDate + ' ' + formattedTime,
      durationSeconds: elapsedSeconds
    }));

    // 10. Trigger WhatsApp redirection timer (2 seconds delay)
    triggerWhatsAppRedirect(newSubmission);
  };

  // WhatsApp redirection constructor
  const triggerWhatsAppRedirect = (sub: PlacementSubmission) => {
    setTimeout(() => {
      let message = '';
      if (sub.chosenTrack !== 'لا أستطيع تحديد المسار') {
        message = `ازيك يبشمهندس 👋\n\nخلصت امتحان تحديد المستوى.\n\n👤 الاسم: ${sub.name}\n💻 التخصص: ${sub.chosenTrack}\n📊 النتيجة: ${sub.score}/100\n🏆 مستوايا: ${sub.level}\n\nأنا حابب أكمل تعليم.\nتنصحني أبدأ إزاي؟\nوإيه الكورسات المناسبة لمستوايا؟`;
      } else {
        message = `ازيك يبشمهندس 👋\n\nأنا مش قادر أحدد مساري.\n📊 نتيجة الامتحان: ${sub.score}/100\n🏆 مستوايا: ${sub.level}\n\nوالذكاء الاصطناعي اقترحلي مسار:\n${sub.suggestedTrack}\n\nإيه رأيك أبدأ بإيه؟\nوإيه الكورسات المناسبة ليا؟`;
      }

      // Mark as opened in state
      setWhatsappTriggered(true);
      
      // Update local storage representation
      const lastResult = localStorage.getItem('ao_pt_last_result');
      if (lastResult) {
        try {
          const parsed = JSON.parse(lastResult);
          parsed.whatsappOpened = true;
          localStorage.setItem('ao_pt_last_result', JSON.stringify(parsed));
        } catch (e) {}
      }

      // Update submission object itself in database
      const updatedSub = { ...sub, whatsappOpened: true };
      onAddSubmission(updatedSub).catch(err => console.error("Error updating whatsapp status:", err));

      const whatsappUrl = `https://wa.me/201553514081?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  // Helper to format elapsed time string
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check if completed status already exists in localStorage on reload
  useEffect(() => {
    const isCompleted = localStorage.getItem('ao_pt_completed_status') === 'true';
    const lastResultStr = localStorage.getItem('ao_pt_last_result');
    if (isCompleted && lastResultStr) {
      try {
        const lastResult = JSON.parse(lastResultStr);
        setName(lastResult.name);
        setPhone(lastResult.phone);
        setEmail(lastResult.email);
        setChosenTrack(lastResult.chosenTrack);
        setFinalScore(lastResult.score);
        setAssignedLevel(lastResult.level);
        setSuggestedTrack(lastResult.suggestedTrack);
        setTrackReason(lastResult.trackReason);
        setSubmissionDate(lastResult.date);
        setElapsedSeconds(lastResult.durationSeconds || 0);
        setCompleted(true);
        setFormSubmitted(true);
        setStarted(false);
      } catch (e) {
        console.error("Failed to load completed status:", e);
      }
    }
  }, []);

  // Return level description in Arabic
  const getLevelDescription = (levelStr: string) => {
    if (levelStr.includes('Level 4')) {
      return 'مستواك احترافي! تمتلك خبرة ممتازة تؤهلك لسوق العمل وبناء أنظمة برمجية معقدة مباشرة.';
    }
    if (levelStr.includes('Level 3')) {
      return 'مستواك ممتاز ومتقدم! تمتلك فهماً عميقاً للمفاهيم البرمجية وبحاجة للتركيز على المشاريع والحلول الاحترافية الكاملة.';
    }
    if (levelStr.includes('Level 2')) {
      return 'مستواك الحالي متوسط، لديك فهم جيد للمنطق البرمجي والأساسيات وتحتاج لتطوير مهارات التطبيق والتخصص الفعلي.';
    }
    if (levelStr.includes('Level 1')) {
      return 'لديك أساسيات جيدة، لكنك بحاجة لتطوير مهارات التطبيق العملي، كتابة الأكواد بيدك، وفهم المفاهيم الهيكلية العميقة.';
    }
    return 'مستواك الحالي مبتدئ، لا داعي للقلق، حان الوقت لتبدأ رحلتك التأسيسية الصحيحة والممنهجة في عالم البرمجة من الصفر.';
  };

  const totalSteps = chosenTrack === 'لا أستطيع تحديد المسار' 
    ? examQuestions.length + INTEREST_QUESTIONS.length
    : examQuestions.length;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2 sm:p-6" dir="rtl">
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        
        {/* VIEW 1: REGISTRATION / WELCOME SCREEN */}
        {!formSubmitted && (
          <div className="p-6 sm:p-12 space-y-8 text-right">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <BrainCircuit className="w-10 h-10 animate-pulse text-[#2563EB]" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                اختبار تحديد مستوى البرمجة
              </h1>
              <p className="text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                اختبر مستواك الحقيقي في البرمجة خلال دقائق، واحصل على تقييم احترافي يحدد مستواك الحالي، والمسار الأنسب لك، والمستوى الذي يمكنك البدء منه داخل الأكاديمية.
              </p>
            </div>

            {/* Support Warning Banner */}
            <div className="bg-blue-50/70 border border-blue-200/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Phone className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold">لأي استفسارات عن الامتحان أو البرمجة يمكنك التواصل على:</span>
                  <a href="tel:01553514081" className="text-sm font-black font-mono text-blue-700 hover:underline">01553514081</a>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">الامتحان مجاني بالكامل ويستغرق حوالي 15-20 دقيقة.</div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleStartTest} className="space-y-6 max-w-2xl mx-auto pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 border-r-4 border-blue-600 pr-3.5 leading-none">
                أدخل بياناتك لبدء الاختبار التقييمي
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-650 font-bold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-855 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="اكتب اسمك الثلاثي أو الرباعي..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-655 font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    رقم الهاتف (النشط بالواتساب) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-855 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-left font-bold"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-650 font-bold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-left font-medium"
                  placeholder="yourname@domain.com"
                />
              </div>

              {/* Track choice radios */}
              <div className="flex flex-col gap-3">
                <label className="text-xs text-slate-650 font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-500" />
                  اختر تخصص البرمجة الذي تود دراسته أو تحديد مستواك به:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: 'Web Development', label: 'Web Development', desc: 'تطوير المواقع والصفحات التفاعلية' },
                    { id: 'Mobile Development', label: 'Mobile Development', desc: 'بناء تطبيقات الاندرويد والايفون' },
                    { id: 'Artificial Intelligence', label: 'Artificial Intelligence', desc: 'الذكاء الاصطناعي وعلوم البيانات' },
                    { id: 'Robotics & Arduino', label: 'Robotics & Arduino', desc: 'الروبوتات والقطع المادية والانترنت الذكي' },
                    { id: 'لا أستطيع تحديد المسار', label: 'لا أستطيع تحديد المسار', desc: 'تريد ترشيح مسار ذكي بناءً على اهتماماتك' }
                  ].map((track) => (
                    <label 
                      key={track.id} 
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50 select-none ${
                        chosenTrack === track.id 
                          ? 'border-blue-500 bg-blue-50/20 shadow-sm shadow-blue-500/5' 
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="track"
                        checked={chosenTrack === track.id}
                        onChange={() => setChosenTrack(track.id)}
                        className="mt-1 accent-blue-600"
                      />
                      <div className="text-right">
                        <span className="block text-sm font-black text-slate-800">{track.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-bold font-sans">{track.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-4 px-8 rounded-2xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 text-center flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <span>دخول وبدء الاختبار الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-2xl transition-all text-sm cursor-pointer"
                >
                  إلغاء والعودة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 2: EXAM PANEL */}
        {started && !completed && (
          <div className="p-6 sm:p-10 space-y-8 text-right">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <BrainCircuit className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">
                    {isAnsweringInterests() ? "المرحلة الثانية: اختبار الاهتمامات لتحديد المسار" : "اختبار التحديد التقييمي"}
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 font-mono text-sm shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>الوقت المستغرق: {formatTime(elapsedSeconds)}</span>
                </div>
                
                <div className="bg-blue-600 text-white font-black px-3.5 py-1.5 rounded-xl shadow-sm">
                  السؤال {currentQuestionIndex + 1} / {totalSteps}
                </div>
              </div>
            </div>

            {/* Progress line */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex) / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Question Screen Card */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center shrink-0">
                  Q
                </span>
                <div className="flex-1 space-y-2">
                  {/* Subject Badge */}
                  {!isAnsweringInterests() && (
                    <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200/40 uppercase">
                      {examQuestions[currentQuestionIndex]?.category === 'general' ? 'منطق وخوارزميات عامة' : `تخصص ${chosenTrack}`}
                    </span>
                  )}
                  {isAnsweringInterests() && (
                    <span className="inline-block bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200/40 uppercase">
                      ميول واهتمامات شخصية
                    </span>
                  )}
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed whitespace-pre-line font-sans">
                    {getCurrentQuestionText()}
                  </h2>
                </div>
              </div>

              {/* Options selection */}
              <div className="grid grid-cols-1 gap-3.5 pt-4">
                {getCurrentOptions().map((opt, idx) => {
                  const currentQ = isAnsweringInterests()
                    ? INTEREST_QUESTIONS[currentQuestionIndex - examQuestions.length]
                    : examQuestions[currentQuestionIndex];
                  const isSelected = answers[currentQ.id] === opt;
                  
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-right p-4 rounded-xl border-2 transition-all font-sans font-medium text-sm flex items-center justify-between select-none cursor-pointer ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/10 text-blue-900 shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="leading-relaxed flex-1">{opt}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mr-3 ${
                        isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl transition-all text-xs sm:text-sm font-bold flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered()}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl transition-all text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {currentQuestionIndex === totalSteps - 1 ? 'إنهاء وتسجيل الامتحان' : 'التالي'}
                </span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: RESULTS / COMPLETED SCREEN */}
        {completed && (
          <div className="p-6 sm:p-12 space-y-8 text-right text-slate-800">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                مبارك تم إنهاء اختبار تحديد المستوى بنجاح!
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 font-bold max-w-xl mx-auto leading-relaxed">
                شكراً لمشاركتك يا {name}. تم حفظ نتيجتك وأدائك في قاعدة البيانات بنجاح وتصنيف مستواك الحالي.
              </p>
            </div>

            {/* Results breakdown sheet card */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 max-w-2xl mx-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                <span className="text-xs text-slate-550 font-bold">اسم الطالب:</span>
                <span className="text-sm sm:text-base font-black text-slate-900">{name}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                <span className="text-xs text-slate-550 font-bold">التخصص المختار:</span>
                <span className="text-xs sm:text-sm font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-mono">
                  {chosenTrack}
                </span>
              </div>

              {/* If undecided track, show suggested track */}
              {suggestedTrack && (
                <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/60 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-700 font-extrabold">المسار البرمجي المقترح (توصية الذكاء الاصطناعي):</span>
                    <span className="text-xs sm:text-sm font-black text-purple-800 bg-purple-100 px-3 py-1 rounded-lg border border-purple-200/60 font-mono">
                      {suggestedTrack}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    💡 <strong>سبب الترشيح:</strong> {trackReason}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wide">الدرجة الحاصل عليها</span>
                  <span className="text-3xl font-black text-blue-600 font-sans mt-1.5">{finalScore} / 100</span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wide">المستوى المستحق</span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 mt-2 font-mono">
                    {assignedLevel}
                  </span>
                </div>
              </div>

              {/* Level custom message */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/40 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                💡 {getLevelDescription(assignedLevel)}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-450 gap-2 pt-2">
                <span>تاريخ وقت تقديم المحاولة: {submissionDate}</span>
                <span>مدة حل الأسئلة: {formatTime(elapsedSeconds)}</span>
              </div>
            </div>

            {/* WhatsApp notification banner */}
            <div className="max-w-2xl mx-auto bg-emerald-50 border border-emerald-200/50 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-black text-emerald-800">
                    جاري توجيهك وفتح محادثة الواتساب تلقائياً...
                  </h4>
                  <p className="text-xs text-emerald-700 leading-normal font-sans font-medium mt-0.5">
                    الآن يقوم النظام بتوجيهك للدردشة المباشرة مع الأكاديمية لحجز استشارة برمجية مجانية والاتفاق على الكورسات والمسار المناسب لمستواك.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/70 border border-emerald-100 rounded-2xl p-4 text-xs font-mono text-slate-650 text-right space-y-1 select-all">
                <span className="text-[10px] text-slate-400 block font-sans font-bold">الرسالة التلقائية المرسلة للمدير:</span>
                {chosenTrack !== 'لا أستطيع تحديد المسار' ? (
                  <p className="whitespace-pre-line text-slate-800 text-xs">
                    ازيك يبشمهندس 👋
                    خلصت امتحان تحديد المستوى.
                    👤 الاسم: {name}
                    💻 التخصص: {chosenTrack}
                    📊 النتيجة: {finalScore}/100
                    🏆 مستوايا: {assignedLevel}
                    أنا حابب أكمل تعليم.
                    تنصحني أبدأ إزاي؟
                    وإيه الكورسات المناسبة لمستوايا؟
                  </p>
                ) : (
                  <p className="whitespace-pre-line text-slate-800 text-xs">
                    ازيك يبشمهندس 👋
                    أنا مش قادر أحدد مساري.
                    📊 نتيجة الامتحان: {finalScore}/100
                    🏆 مستوايا: {assignedLevel}
                    والذكاء الاصطناعي اقترحلي مسار:
                    {suggestedTrack}
                    إيه رأيك أبدأ بإيه؟
                    وإيه الكورسات المناسبة ليا؟
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/201553514081?text=${encodeURIComponent(
                    chosenTrack !== 'لا أستطيع تحديد المسار' 
                      ? `ازيك يبشمهندس 👋\n\nخلصت امتحان تحديد المستوى.\n\n👤 الاسم: ${name}\n💻 التخصص: ${chosenTrack}\n📊 النتيجة: ${finalScore}/100\n🏆 مستوايا: ${assignedLevel}\n\nأنا حابب أكمل تعليم.\nتنصحني أبدأ إزاي؟\nوإيه الكورسات المناسبة لمستوايا؟`
                      : `ازيك يبشمهندس 👋\n\nأنا مش قادر أحدد مساري.\n📊 نتيجة الامتحان: ${finalScore}/100\n🏆 مستوايا: ${assignedLevel}\n\nوالذكاء الاصطناعي اقترحلي مسار:\n${suggestedTrack}\n\nإيه رأيك أبدأ بإيه؟\nوإيه الكورسات المناسبة ليا؟`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setWhatsappTriggered(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>اضغط هنا إذا لم يتم توجيهك تلقائياً للواتساب</span>
                </a>
                
                <button
                  type="button"
                  onClick={() => {
                    // Reset all state to give a fresh start (clears localStorage results)
                    localStorage.removeItem('ao_pt_completed_status');
                    localStorage.removeItem('ao_pt_last_result');
                    setCompleted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setChosenTrack('');
                    setFormSubmitted(false);
                    setStarted(false);
                  }}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-xs"
                >
                  إعادة الاختبار من جديد
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-xs sm:text-sm cursor-pointer"
              >
                العودة للصفحة الرئيسية للموقع
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
