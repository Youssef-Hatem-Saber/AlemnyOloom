import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Code,
  BookOpen,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Eye,
  FileCode,
  Check,
  X
} from 'lucide-react';
import { Registration } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface HtmlExamPageProps {
  registrations: Registration[];
  onNavigateHome: () => void;
}

interface QuestionMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionTF {
  id: string;
  question: string;
  correctAnswer: boolean;
}

interface QuestionFill {
  id: string;
  question: string;
  correctAnswers: string[]; // Accept lowercase, uppercase, and with/without brackets
}

interface QuestionOutput {
  id: string;
  code: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function HtmlExamPage({ registrations, onNavigateHome }: HtmlExamPageProps) {
  // Authentication / Student code verification states
  const [studentName, setStudentName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<Registration | null>(null);

  // Exam state
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // 120 minutes in seconds
  const [activeTab, setActiveTab] = useState<'q1' | 'q2' | 'q3' | 'q4' | 'q5'>('q1');

  // Answers state
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [outputAnswers, setOutputAnswers] = useState<Record<string, string>>({});
  
  // Practical question (Live Code Editor) state
  const [practicalCode, setPracticalCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My Profile</title>
</head>
<body>

  <!-- اكتب الكود الخاص بك هنا -->

</body>
</html>`);
  
  // Scoring results state
  const [scoreDetails, setScoreDetails] = useState<{
    mcqScore: number;
    tfScore: number;
    fillScore: number;
    outputScore: number;
    practicalScore: number;
    bonusScore: number;
    totalScore: number;
  } | null>(null);

  // Time spent
  const [timeSpentString, setTimeSpentString] = useState('');
  const [submittedAtStr, setSubmittedAtStr] = useState('');

  // Checklist for practical task validation
  const [practicalRequirements, setPracticalRequirements] = useState([
    { id: 'title', text: 'عنوان الصفحة My Profile', checked: false, weight: 1 },
    { id: 'heading', text: 'عنوان رئيسي باسمك باستخدام <h1>', checked: false, weight: 1 },
    { id: 'paragraph', text: 'فقرة تحتوي على نبذة قصيرة باستخدام <p>', checked: false, weight: 1 },
    { id: 'image', text: 'صورة شخصية باستخدام <img>', checked: false, weight: 1 },
    { id: 'list', text: 'قائمة غير مرتبة <ul> تحتوي على 3 مهارات <li> على الأقل', checked: false, weight: 1 },
    { id: 'github', text: 'رابط إلى GitHub يفتح في تبويب جديد target="_blank"', checked: false, weight: 1 },
    { id: 'cv', text: 'زر أو رابط لتحميل ملف باسم CV.pdf', checked: false, weight: 1 },
    { id: 'email', text: 'رابط لإرسال بريد إلكتروني mailto:', checked: false, weight: 1 },
    { id: 'phone', text: 'رابط لإجراء اتصال هاتفي tel:', checked: false, weight: 1 },
    { id: 'favicon', text: 'إضافة Favicon للموقع باستخدام <link rel="icon">', checked: false, weight: 1 },
  ]);

  const [bonusRequirements, setBonusRequirements] = useState([
    { id: 'youtube', text: 'مكافأة: أضف فيديو من YouTube باستخدام <iframe>', checked: false, weight: 2.5 },
    { id: 'gmaps', text: 'مكافأة: أدرج خريطة من Google Maps باستخدام <iframe>', checked: false, weight: 2.5 },
  ]);

  // Questions definitions
  const MCQ_QUESTIONS: QuestionMCQ[] = [
    { id: 'mcq1', question: 'HTML هي اختصار لـ:', options: ['أ) Hyper Text Markup Language', 'ب) Home Tool Markup Language', 'ج) Hyperlinks and Text Markup Language', 'د) High Tech Markup Language'], correctAnswer: 'أ) Hyper Text Markup Language' },
    { id: 'mcq2', question: 'الوسم المسؤول عن عنوان الصفحة هو:', options: ['أ) <body>', 'ب) <head>', 'ج) <title>', 'د) <meta>'], correctAnswer: 'ج) <title>' },
    { id: 'mcq3', question: 'أي وسم يستخدم لإضافة صورة؟', options: ['أ) <image>', 'ب) <img>', 'ج) <picture>', 'د) <photo>'], correctAnswer: 'ب) <img>' },
    { id: 'mcq4', question: 'الخاصية المستخدمة لتحديد مسار الصورة هي:', options: ['أ) href', 'ب) src', 'ج) path', 'د) file'], correctAnswer: 'ب) src' },
    { id: 'mcq5', question: 'أي وسم ينشئ قائمة غير مرتبة؟', options: ['أ) <ol>', 'ب) <ul>', 'ج) <li>', 'د) <list>'], correctAnswer: 'ب) <ul>' },
    { id: 'mcq6', question: 'أي خاصية تجعل الرابط يفتح في نافذة جديدة؟', options: ['أ) open', 'ب) blank', 'ج) target="_blank"', 'د) href'], correctAnswer: 'ج) target="_blank"' },
    { id: 'mcq7', question: 'يستخدم الوسم <hr> من أجل:', options: ['أ) إنشاء رابط', 'ب) إدراج صورة', 'ج) رسم خط أفقي', 'د) إنشاء جدول'], correctAnswer: 'ج) رسم خط أفقي' },
    { id: 'mcq8', question: 'يستخدم الوسم <br> من أجل:', options: ['أ) إنشاء فقرة', 'ب) الانتقال لسطر جديد', 'ج) إنشاء عنوان', 'د) إنشاء قائمة'], correctAnswer: 'ب) الانتقال لسطر جديد' },
    { id: 'mcq9', question: 'أي خاصية تستخدم عند تعذر تحميل الصورة (نص بديل)؟', options: ['أ) title', 'ب) width', 'ج) alt', 'د) src'], correctAnswer: 'ج) alt' },
    { id: 'mcq10', question: 'يستخدم <iframe> من أجل:', options: ['أ) إنشاء نموذج مدخلات', 'ب) إدراج صفحة أو فيديو أو خريطة داخل الصفحة', 'ج) رسم خطوط بيانية', 'د) إنشاء قائمة تنقل'], correctAnswer: 'ب) إدراج صفحة أو فيديو أو خريطة داخل الصفحة' }
  ];

  const TF_QUESTIONS: QuestionTF[] = [
    { id: 'tf1', question: 'HTML هي لغة برمجة.', correctAnswer: false },
    { id: 'tf2', question: 'يمكن وضع أكثر من <body> داخل الصفحة الواحدة.', correctAnswer: false },
    { id: 'tf3', question: 'الوسم <img> يحتاج إلى Closing Tag (وسم إغلاق منفرداً).', correctAnswer: false },
    { id: 'tf4', question: 'يمكن استخدام <ol> لإنشاء قائمة مرقمة.', correctAnswer: true },
    { id: 'tf5', question: 'الوسم <title> يظهر محتواه مباشرة داخل جسم الصفحة للمستخدم.', correctAnswer: false },
    { id: 'tf6', question: 'تستخدم الخاصية download لتنزيل ملف عند الضغط على الرابط.', correctAnswer: true },
    { id: 'tf7', question: 'يمكن استخدام mailto: في الخاصية href لإرسال بريد إلكتروني.', correctAnswer: true },
    { id: 'tf8', question: 'تستخدم tel: في الخاصية href لإجراء اتصال هاتفي.', correctAnswer: true },
    { id: 'tf9', question: 'المسار النسبي (Relative Path) يبدأ دائماً بـ https://', correctAnswer: false },
    { id: 'tf10', question: 'الـ favicon هو أيقونة الموقع التي تظهر بجانب عنوان الصفحة في لسان التصفح.', correctAnswer: true }
  ];

  const FILL_QUESTIONS: QuestionFill[] = [
    { id: 'fill1', question: 'الوسم المستخدم لإنشاء رابط تشعبي هو ................', correctAnswers: ['<a>', 'a', 'anchor'] },
    { id: 'fill2', question: 'الخاصية التي تحدد مسار أو رابط التوجيه للرابط هي ................', correctAnswers: ['href'] },
    { id: 'fill3', question: 'الوسم المستخدم لإنشاء وإدراج صورة هو ................', correctAnswers: ['<img>', 'img', 'image'] },
    { id: 'fill4', question: 'الوسم المستخدم لإنشاء قائمة مرتبة (مرقمة) هو ................', correctAnswers: ['<ol>', 'ol', 'ordered list'] },
    { id: 'fill5', question: 'الوسم المستخدم لتعريف عنصر فردي داخل القائمة هو ................', correctAnswers: ['<li>', 'li', 'list item'] },
    { id: 'fill6', question: 'الخاصية المسؤولة عن وصف الصورة عند عدم تحميلها هي ................', correctAnswers: ['alt'] },
    { id: 'fill7', question: 'الوسم المسؤول عن بيانات الصفحة الفنية والعنوان وغير الظاهرة للمستخدم هو ................', correctAnswers: ['<head>', 'head'] },
    { id: 'fill8', question: 'الوسم المسؤول عن محتوى الصفحة الرئيسي الظاهر للمستخدم هو ................', correctAnswers: ['<body>', 'body'] },
    { id: 'fill9', question: 'يستخدم الوسم ................ للانتقال لسطر جديد.', correctAnswers: ['<br>', 'br', '<br/>', '<br />'] },
    { id: 'fill10', question: 'يستخدم الوسم ................ لرسم خط أفقي فاصل.', correctAnswers: ['<hr>', 'hr', '<hr/>', '<hr />'] }
  ];

  const OUTPUT_QUESTIONS: QuestionOutput[] = [
    {
      id: 'out1',
      code: '<h1>Programming</h1><p>Welcome</p>',
      question: 'ما هو الشكل الناتج لعرض الكود السابق في المتصفح؟',
      options: [
        'أ) عنوان رئيسي كبير بكلمة Programming وتحته فقرة بكلمة Welcome',
        'ب) الكلمتان بجانب بعضهما بنفس الحجم والخط',
        'ج) رابط تشعبي أزرق اللون يوجه لصفحة الترحيب',
        'د) صورة لملف برمجي مكتوب عليه كلمة Welcome'
      ],
      correctAnswer: 'أ) عنوان رئيسي كبير بكلمة Programming وتحته فقرة بكلمة Welcome'
    },
    {
      id: 'out2',
      code: '<ul><li>HTML</li><li>CSS</li><li>JS</li></ul>',
      question: 'ما هو الشكل الناتج لعرض الكود السابق في المتصفح؟',
      options: [
        'أ) قائمة مرقمة بأرقام تسلسلية (1. HTML, 2. CSS, 3. JS)',
        'ب) قائمة نقطية (غير مرتبة) تسبق كل عنصر نقطة سوداء',
        'ج) جدول من ثلاثة أعمدة وعامود واحد لكل لغة',
        'د) فقرة نصية طويلة تفصل بين كلماتها علامات ناقص (-)'
      ],
      correctAnswer: 'ب) قائمة نقطية (غير مرتبة) تسبق كل عنصر نقطة سوداء'
    },
    {
      id: 'out3',
      code: '<a href="https://google.com" target="_blank">Google</a>',
      question: 'ما الذي يفعله هذا الكود عند النقر على الكلمة؟',
      options: [
        'أ) يفتح نموذج مراسلات خاص بالأكاديمية',
        'ب) يفتح موقع جوجل في نافذة/تبويب جديد بالكامل دون إغلاق الصفحة الحالية',
        'ج) يحمل ملفاً نصياً يحتوي على إعدادات محرك البحث جوجل',
        'د) يغلق الصفحة وينقلك لموقع جوجل في نفس التبويب'
      ],
      correctAnswer: 'ب) يفتح موقع جوجل في نافذة/تبويب جديد بالكامل دون إغلاق الصفحة الحالية'
    },
    {
      id: 'out4',
      code: '<img src="cat.jpg" alt="Cat" width="200">',
      question: 'ما هو دور الخاصية alt="Cat" في هذا السطر؟',
      options: [
        'أ) تكبير وتصغير حجم الصورة المعروضة',
        'ب) عرض نص "Cat" بدلاً من الصورة إذا فشل تحميلها أو للمساعدة الصوتية',
        'ج) تلوين خلفية الصورة باللون القططي',
        'د) توجيه المستخدم لصفحة ويب تسمى Cat'
      ],
      correctAnswer: 'ب) عرض نص "Cat" بدلاً من الصورة إذا فشل تحميلها أو للمساعدة الصوتية'
    },
    {
      id: 'out5',
      code: '<ol type="A"><li>One</li><li>Two</li></ol>',
      question: 'ما هو الشكل الناتج لعرض هذه القائمة؟',
      options: [
        'أ) قائمة نقطية مسبوقة بنقاط سوداء دائرية',
        'ب) قائمة مرتبة بالحروف الأبجدية الكبيرة: A. One ثم B. Two',
        'ج) قائمة مرتبة بالأرقام الرومانية: I. One ثم II. Two',
        'د) قائمة مرتبة بالأرقام العادية: 1. One ثم 2. Two'
      ],
      correctAnswer: 'ب) قائمة مرتبة بالحروف الأبجدية الكبيرة: A. One ثم B. Two'
    }
  ];

  // Run live checklist verification on practical code
  useEffect(() => {
    const code = practicalCode.toLowerCase();
    
    // Requirements checks
    const updatedReqs = practicalRequirements.map(req => {
      let checked = false;
      if (req.id === 'title') {
        checked = code.includes('<title>my profile</title>');
      } else if (req.id === 'heading') {
        // checks for <h1> tag with some content inside it
        checked = /<h1[^>]*>[\s\S]+?<\/h1>/.test(code);
      } else if (req.id === 'paragraph') {
        // checks for <p> tag with some content
        checked = /<p[^>]*>[\s\S]+?<\/p>/.test(code);
      } else if (req.id === 'image') {
        // checks for <img tag with src
        checked = /<img[^>]*src=["'][\s\S]+?["']/.test(code);
      } else if (req.id === 'list') {
        // checks for <ul> and at least 3 <li> tags
        const hasUl = code.includes('<ul');
        const liCount = (code.match(/<li/g) || []).length;
        checked = hasUl && liCount >= 3;
      } else if (req.id === 'github') {
        // checks for <a> tag with github and target="_blank"
        checked = code.includes('<a') && code.includes('github') && code.includes('target="_blank"');
      } else if (req.id === 'cv') {
        // checks for link to CV.pdf
        checked = code.includes('cv.pdf') && (code.includes('download') || code.includes('href'));
      } else if (req.id === 'email') {
        // mailto
        checked = code.includes('mailto:');
      } else if (req.id === 'phone') {
        // tel
        checked = code.includes('tel:');
      } else if (req.id === 'favicon') {
        // link rel="icon"
        checked = code.includes('<link') && (code.includes('rel="icon"') || code.includes('rel="shortcut icon"') || code.includes('rel=\'icon\'') || code.includes('rel=\'shortcut icon\''));
      }
      return { ...req, checked };
    });

    // Bonus checks
    const updatedBonus = bonusRequirements.map(bonus => {
      let checked = false;
      if (bonus.id === 'youtube') {
        checked = code.includes('<iframe') && code.includes('youtube.com');
      } else if (bonus.id === 'gmaps') {
        checked = code.includes('<iframe') && (code.includes('google.com/maps') || code.includes('google.co.in/maps'));
      }
      return { ...bonus, checked };
    });

    // Avoid infinite loops by checking differences
    const reqDiff = JSON.stringify(updatedReqs) !== JSON.stringify(practicalRequirements);
    const bonusDiff = JSON.stringify(updatedBonus) !== JSON.stringify(bonusRequirements);

    if (reqDiff) setPracticalRequirements(updatedReqs);
    if (bonusDiff) setBonusRequirements(updatedBonus);

  }, [practicalCode]);

  // Authenticate user with their student code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!studentCode.trim()) {
      setAuthError('الرجاء إدخال كود الطالب المسجل بالكورس.');
      return;
    }

    const cleanCode = studentCode.trim().toUpperCase();
    // Look for registration with courseId web01 or c3 (the pre-existing programming and web basics course)
    let match = registrations.find(r => {
      const regCode = (r.studentCode || '').trim().toUpperCase();
      return regCode === cleanCode && (r.courseId === 'web01' || r.courseId === 'c3');
    });

    // 3. Fallback for testing: if student code is AO_WEB_01 or AO100237
    if (!match && (cleanCode === 'AO_WEB_01' || cleanCode === 'AO100237')) {
      match = {
        id: "reg_web01_1",
        studentCode: cleanCode,
        studentName: cleanCode === 'AO_WEB_01' ? "طالب ويب تجريبي" : "كريم أحمد جلال",
        studentPhone: "01099998888",
        studentEmail: "web_student@example.com",
        senderType: "student",
        currentSchool: "مدرسة المتفوقين للعلوم والتكنولوجيا",
        governorate: "القاهرة",
        courseId: cleanCode === 'AO_WEB_01' ? "web01" : "c3",
        dynamicData: {},
        paymentStatus: "Paid",
        paymentMethod: "فودافون كاش",
        registeredAt: new Date().toISOString()
      };
    }

    if (match) {
      // Check if student already submitted the HTML exam in Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          // We need an async call, but since handleVerifyCode is async, we can await it!
          const { data: existingSub, error: subError } = await supabase
            .from('ao_exam_submissions')
            .select('id, score')
            .eq('studentCode', match.studentCode)
            .like('name', '%(امتحان HTML)%');

          if (!subError && existingSub && existingSub.length > 0) {
            setAuthError(`عذراً! هذا الكود قام بتسليم امتحان HTML بالفعل وحصل على درجة (${existingSub[0].score}/50). لا يمكن إعادة دخول الامتحان.`);
            return;
          }
        } catch (e) {
          console.error("Error checking existing submissions:", e);
        }
      }

      setMatchedStudent(match);
      setStudentName(match.studentName);
      setIsAuthenticated(true);
    } else {
      if (!authError) {
        setAuthError('عذراً! هذا الكود غير مسجل في كورس تطوير الويب. للتمكن من دخول الامتحان، يجب أن تكون مشتركاً ومفعلاً في الكورس. يرجى مراجعة إدارة الأكاديمية.');
      }
    }
  };

  // Start exam
  const handleStartExam = () => {
    setStarted(true);
    setTimeLeft(7200);
  };

  // Timer countdown
  useEffect(() => {
    if (!started || completed) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed]);

  // Autocomplete formatting time string
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Grading calculations
  const calculateFinalGrade = (finalTimeRemaining: number) => {
    let mcqScore = 0;
    MCQ_QUESTIONS.forEach(q => {
      if (mcqAnswers[q.id] === q.correctAnswer) mcqScore += 1;
    });

    let tfScore = 0;
    TF_QUESTIONS.forEach(q => {
      if (tfAnswers[q.id] === q.correctAnswer) tfScore += 1;
    });

    let fillScore = 0;
    FILL_QUESTIONS.forEach(q => {
      const ans = (fillAnswers[q.id] || '').trim().toLowerCase();
      // check if student answer matches any of the allowed variants
      const isCorrect = q.correctAnswers.some(correct => {
        const cleanCorrect = correct.toLowerCase();
        // matches exactly or without HTML brackets
        return ans === cleanCorrect || ans === cleanCorrect.replace('<', '').replace('>', '').replace('/', '').trim();
      });
      if (isCorrect) fillScore += 1;
    });

    let outputScore = 0;
    OUTPUT_QUESTIONS.forEach(q => {
      if (outputAnswers[q.id] === q.correctAnswer) outputScore += 2; // Each is 2 marks
    });

    // Practical score (weight-based)
    let practicalScore = 0;
    practicalRequirements.forEach(req => {
      if (req.checked) practicalScore += req.weight;
    });

    // Bonus score
    let bonusScore = 0;
    bonusRequirements.forEach(req => {
      if (req.checked) bonusScore += req.weight;
    });

    // Make totals
    const totalScore = mcqScore + tfScore + fillScore + outputScore + practicalScore;

    setScoreDetails({
      mcqScore,
      tfScore,
      fillScore,
      outputScore,
      practicalScore,
      bonusScore,
      totalScore
    });

    // Calculate time spent (2 hours = 7200 seconds)
    const spentSecs = 7200 - finalTimeRemaining;
    const spentMins = Math.floor(spentSecs / 60);
    const spentSecsRem = spentSecs % 60;
    setTimeSpentString(`${spentMins} دقيقة و ${spentSecsRem} ثانية`);
    const dateStr = new Date().toLocaleString('ar-EG');
    setSubmittedAtStr(dateStr);

    // Save submission to Supabase
    if (matchedStudent) {
      const submission = {
        id: `html_exam_${matchedStudent.studentCode}_${Date.now()}`.toLowerCase(),
        name: `${matchedStudent.studentName} (امتحان HTML)`,
        phone: matchedStudent.studentPhone || "N/A",
        email: matchedStudent.studentEmail || "N/A",
        studentCode: matchedStudent.studentCode,
        score: totalScore,
        totalPoints: 50,
        answers: {
          q1: JSON.stringify(mcqAnswers),
          q2: JSON.stringify(tfAnswers),
          q3: JSON.stringify(fillAnswers),
          q4: JSON.stringify(outputAnswers),
          q5: practicalCode
        },
        submittedAt: dateStr
      };

      if (isSupabaseConfigured && supabase) {
        supabase.from('ao_exam_submissions').upsert([submission]).then(({ error }) => {
          if (error) console.error("Error saving exam submission to Supabase:", error);
          else console.log("Exam submission saved successfully to Supabase!");
        });
      }
    }

    setCompleted(true);
  };

  // Submit Exam
  const handleSubmitExam = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في تسليم الامتحان وإنهاء المحاولة؟')) {
      calculateFinalGrade(timeLeft);
    }
  };

  // Auto submit when timer runs out
  const handleAutoSubmit = () => {
    alert('انتهى الوقت المحدد للامتحان! سيتم حفظ وتسليم إجاباتك الحالية تلقائياً.');
    calculateFinalGrade(0);
  };

  // Helper template code injector for the editor
  const injectCode = (templateType: string) => {
    let codeToInject = '';
    if (templateType === 'base') {
      codeToInject = `<!DOCTYPE html>
<html>
<head>
  <title>My Profile</title>
  <link rel="icon" href="https://example.com/favicon.ico">
</head>
<body>
  <h1>اسمك الكريم هنا</h1>
  <p>نبذة سريعة عن حياتك واهتماماتك المهنية هنا...</p>
</body>
</html>`;
    } else if (templateType === 'link') {
      codeToInject = `\n  <a href="https://github.com/yourusername" target="_blank">رابط GitHub الشخصي</a>\n`;
    } else if (templateType === 'image') {
      codeToInject = `\n  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" alt="Profile Picture" width="150">\n`;
    } else if (templateType === 'list') {
      codeToInject = `\n  <h3>مهاراتي الأساسية:</h3>
  <ul>
    <li>تطوير مواقع الويب HTML5</li>
    <li>تنسيق الصفحات CSS3</li>
    <li>البرمجة التفاعلية JavaScript</li>
  </ul>\n`;
    } else if (templateType === 'contact') {
      codeToInject = `\n  <a href="mailto:yourname@example.com">أرسل لي بريداً إلكترونياً</a>
  <br>
  <a href="tel:+201012345678">اتصل بي هاتفياً</a>
  <br>
  <a href="CV.pdf" download>تحميل ملف السيرة الذاتية CV.pdf</a>\n`;
    } else if (templateType === 'bonus') {
      codeToInject = `\n  <!-- وسم iframe لليوتيوب ومخرجات خريطة جوجل -->
  <iframe width="400" height="250" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0"></iframe>
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.64998246473!2d31.2584!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTUnMzAuMiJF!5e0!3m2!1sar!2seg!4v1620000000000" width="400" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>\n`;
    }

    if (codeToInject) {
      setPracticalCode(prev => {
        if (templateType === 'base') return codeToInject;
        // insert inside body if template type is element
        const bodyIndex = prev.toLowerCase().indexOf('</body>');
        if (bodyIndex !== -1) {
          return prev.substring(0, bodyIndex) + codeToInject + prev.substring(bodyIndex);
        }
        return prev + codeToInject;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Verification Screen */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-slate-800 rounded-3xl border border-slate-700/80 shadow-2xl p-8 mt-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-blue-600 via-indigo-500 to-cyan-500"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl text-blue-400 mb-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">امتحان أساسيات HTML</h2>
              <p className="text-sm text-slate-400 mt-1">كورس البرمجة الشامل وتطوير الويب - دفعة web01</p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">


              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>كود الطالب المسجل بالكورس (Student Code)</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="مثال: AO_WEB_01"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-right font-mono"
                />
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-2.5 text-xs text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-l from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>التحقق ودخول منصة الامتحان</span>
              </button>


            </form>
          </motion.div>
        )}

        {/* Start Exam Screen */}
        {isAuthenticated && !started && !completed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-slate-800 rounded-3xl border border-slate-700/80 shadow-2xl p-8 mt-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-indigo-600 via-purple-500 to-pink-500"></div>
            
            <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">أهلاً بك، {studentName}</h2>
            <p className="text-slate-400 text-sm mb-6">لقد تم التحقق بنجاح من تسجيلك بالكورس.</p>

            {/* Student Details Card */}
            {matchedStudent && (
              <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6 text-right space-y-2 text-xs">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-2 mb-2 flex items-center gap-1.5 text-blue-400">👤 بيانات الطالب المسجلة بالكورس:</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الاسم:</span>
                  <span className="text-white font-bold">{matchedStudent.studentName}</span>
                </div>
                {matchedStudent.studentCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">كود الطالب:</span>
                    <span className="text-slate-200 font-mono">{matchedStudent.studentCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">المدرسة:</span>
                  <span className="text-slate-200">{matchedStudent.currentSchool || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">المحافظة:</span>
                  <span className="text-slate-200">{matchedStudent.governorate || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الكورس المسجل:</span>
                  <span className="text-emerald-400 font-bold">
                    {matchedStudent.courseId === 'web01' ? 'تطوير الويب الشامل web01' : 'تطوير الويب c3'}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 mb-8 text-right space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-1.5 text-indigo-400">📝 معلومات وتوجيهات الامتحان:</h3>
              <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside leading-relaxed pr-1">
                <li><strong>الدرجة الكلية:</strong> 50 درجة + 5 درجات مكافأة إضافية للعملي.</li>
                <li><strong>الزمن المتاح:</strong> ساعتان كاملتان (120 دقيقة) من تاريخ بدء المحاولة.</li>
                <li><strong>هيكل الامتحان:</strong> يحتوي على 5 أقسام رئيسية (اختيارات، صح وخطأ، أكمل، تحليل كود، وسؤال تطبيقي عملي).</li>
                <li><strong>القسم العملي:</strong> يحتوي على محرر أكواد متقدم لتكتب فيه كود صفحة موقعك الشخصي، وسيقوم المتصفح بتقييم الكود الخاص بك لحظياً وعرض النتيجة بشكل فوري!</li>
                <li>بمجرد الضغط على زر "ابدأ الامتحان الآن" سيبدأ عداد الوقت التنازلي مباشرة ولا يمكن إيقافه مؤقتاً.</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onNavigateHome}
                className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                العودة للرئيسية
              </button>
              <button
                onClick={handleStartExam}
                className="flex-1 py-3.5 bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer"
              >
                ابدأ الامتحان الآن
              </button>
            </div>
          </motion.div>
        )}

        {/* Active Exam Interface */}
        {started && !completed && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar info & Navigation */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Timer Block */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
                <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${timeLeft < 300 ? 'from-red-600 to-rose-500' : 'from-blue-600 to-indigo-500'} animate-pulse`}></div>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400' : 'text-blue-400'}`} />
                  <span className="text-xs font-bold text-slate-400">الوقت المتبقي</span>
                </div>
                <div className={`text-3xl font-black font-mono tracking-wider ${timeLeft < 300 ? 'text-red-400 animate-bounce' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
                {timeLeft < 300 && (
                  <p className="text-[10px] text-red-400 font-bold mt-1 animate-pulse">⚠️ شارف الوقت على الانتهاء!</p>
                )}
              </div>

              {/* Student Metadata Card */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">الطالب:</span>
                  <span className="text-white font-bold">{studentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2 font-mono">
                  <span className="text-slate-400">الكود:</span>
                  <span className="text-slate-300">{studentCode}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">المسار:</span>
                  <span className="text-green-400 font-bold">web01 (مؤهل)</span>
                </div>
              </div>

              {/* Tabs Buttons Navigation */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-xl space-y-2">
                <div className="text-xs font-bold text-slate-400 px-2 mb-3">أقسام الامتحان:</div>
                {[
                  { id: 'q1', label: 'السؤال الأول (اختياري)', score: '10 درجات' },
                  { id: 'q2', label: 'السؤال الثاني (صح/خطأ)', score: '10 درجات' },
                  { id: 'q3', label: 'السؤال الثالث (أكمل)', score: '10 درجات' },
                  { id: 'q4', label: 'السؤال الرابع (مخرجات)', score: '10 درجات' },
                  { id: 'q5', label: 'السؤال الخامس (العملي)', score: '10+5 درجات' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-slate-900/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>{tab.score}</span>
                  </button>
                ))}
              </div>

              {/* Final Submit Button */}
              <button
                onClick={handleSubmitExam}
                className="w-full py-4 bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20"
              >
                <Send className="w-4 h-4 ml-1" />
                <span>تسليم وإنهاء الامتحان</span>
              </button>

            </div>

            {/* Exam Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 min-h-[500px] flex flex-col justify-between">
                
                <div>
                  
                  {/* Tab header */}
                  <div className="border-b border-slate-700 pb-4 mb-6">
                    {activeTab === 'q1' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <HelpCircle className="w-5.5 h-5.5 text-blue-400" />
                          <span>السؤال الأول: اختر الإجابة الصحيحة</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">اختر الخيار المناسب من بين الخيارات الأربعة (10 نقاط، نقطة لكل سؤال)</p>
                      </div>
                    )}

                    {activeTab === 'q2' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <HelpCircle className="w-5.5 h-5.5 text-indigo-400" />
                          <span>السؤال الثاني: أسئلة الصواب والخطأ</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">حدد ما إذا كانت العبارة صحيحة تماماً أم خاطئة (10 نقاط، نقطة لكل سؤال)</p>
                      </div>
                    )}

                    {activeTab === 'q3' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <HelpCircle className="w-5.5 h-5.5 text-cyan-400" />
                          <span>السؤال الثالث: أكمل العبارات التالية</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">اكتب اسم الوسم أو اسم الخاصية بدقة داخل المستطيل الفارغ (10 نقاط، نقطة لكل سؤال)</p>
                      </div>
                    )}

                    {activeTab === 'q4' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <Code className="w-5.5 h-5.5 text-amber-400" />
                          <span>السؤال الرابع: ما ناتج الكود التالي؟</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">قم بتحليل كود الـ HTML المكتوب واختر الطريقة الصحيحة لعرضه في المتصفح (10 نقاط، نقطتان لكل سؤال)</p>
                      </div>
                    )}

                    {activeTab === 'q5' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <Sparkles className="w-5.5 h-5.5 text-emerald-400" />
                          <span>السؤال الخامس (العملي): بناء الصفحة الشخصية بالتصحيح الفوري</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">اكتب كود الـ HTML لبناء صفحتك الشخصية في المحرر، وتابع شروط الاختبار على الجانب الأيسر (10 درجات + 5 درجات بونص)</p>
                      </div>
                    )}
                  </div>

                  {/* Tab Contents */}
                  
                  {/* Q1 MCQ */}
                  {activeTab === 'q1' && (
                    <div className="space-y-8">
                      {MCQ_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-5 space-y-4">
                          <h4 className="text-sm font-bold text-white flex items-start gap-2 leading-relaxed">
                            <span className="bg-blue-600/10 text-blue-400 text-xs px-2 py-0.5 rounded-md font-mono">{idx + 1}</span>
                            <span>{q.question}</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {q.options.map(opt => (
                              <button
                                key={opt}
                                onClick={() => setMcqAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className={`text-right px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                                  mcqAnswers[q.id] === opt
                                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Q2 True/False */}
                  {activeTab === 'q2' && (
                    <div className="space-y-6">
                      {TF_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm">
                          <h4 className="font-bold text-white flex items-start gap-2 leading-relaxed max-w-xl">
                            <span className="bg-indigo-600/10 text-indigo-400 text-xs px-2 py-0.5 rounded-md font-mono shrink-0 mt-0.5">{idx + 1}</span>
                            <span>{q.question}</span>
                          </h4>
                          <div className="flex gap-2.5 text-xs font-bold shrink-0">
                            <button
                              onClick={() => setTfAnswers(prev => ({ ...prev, [q.id]: true }))}
                              className={`px-6 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                tfAnswers[q.id] === true
                                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                                  : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-400'
                              }`}
                            >
                              صح ✔
                            </button>
                            <button
                              onClick={() => setTfAnswers(prev => ({ ...prev, [q.id]: false }))}
                              className={`px-6 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                tfAnswers[q.id] === false
                                  ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                                  : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-400'
                              }`}
                            >
                              خطأ ✖
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Q3 Fill In The Blanks */}
                  {activeTab === 'q3' && (
                    <div className="space-y-6">
                      {FILL_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <h4 className="font-bold text-white flex items-start gap-2 leading-relaxed max-w-xl">
                            <span className="bg-cyan-600/10 text-cyan-400 text-xs px-2 py-0.5 rounded-md font-mono shrink-0 mt-0.5">{idx + 1}</span>
                            <span>{q.question}</span>
                          </h4>
                          <input
                            type="text"
                            value={fillAnswers[q.id] || ''}
                            onChange={(e) => setFillAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="اكتب الإجابة هنا..."
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-center max-w-xs w-full sm:w-64"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Q4 Code Output Analysis */}
                  {activeTab === 'q4' && (
                    <div className="space-y-8">
                      {OUTPUT_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-5 space-y-4">
                          
                          {/* Label Question */}
                          <h4 className="text-sm font-bold text-white flex items-start gap-2 leading-relaxed">
                            <span className="bg-amber-600/10 text-amber-400 text-xs px-2 py-0.5 rounded-md font-mono">{idx + 1}</span>
                            <span>{q.question}</span>
                          </h4>

                          {/* Code Display Panel */}
                          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 direction-ltr text-left overflow-x-auto shadow-inner">
                            <code>{q.code}</code>
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 gap-2.5 text-xs">
                            {q.options.map(opt => (
                              <button
                                key={opt}
                                onClick={() => setOutputAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className={`text-right px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                                  outputAnswers[q.id] === opt
                                    ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Q5 Practical Live Coding */}
                  {activeTab === 'q5' && (
                    <div className="space-y-6">
                      
                      {/* Description & helper buttons */}
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 text-xs space-y-3">
                        <p className="leading-relaxed">
                          💡 <strong>تعليمات السؤال العملي:</strong> قم بكتابة كود الـ HTML الكامل لبناء صفحة السيرة الذاتية الخاصة بك. يمكنك استخدام الأزرار المساعدة التالية لإدراج قوالب الأكواد الجاهزة وتعديلها لتسريع عملك:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button onClick={() => injectCode('base')} className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>إعادة تعيين الهيكل الأساسي</span>
                          </button>
                          <button onClick={() => injectCode('image')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                            📷 إدراج صورة
                          </button>
                          <button onClick={() => injectCode('list')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                            📋 قائمة مهارات
                          </button>
                          <button onClick={() => injectCode('link')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                            🔗 رابط GitHub
                          </button>
                          <button onClick={() => injectCode('contact')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                            ✉ روابط التواصل و CV
                          </button>
                          <button onClick={() => injectCode('bonus')} className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                            🎁 إدراج يوتيوب وخريطة (بونص)
                          </button>
                        </div>
                      </div>

                      {/* Work Area Split Screen */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Requirements checklist panel */}
                        <div className="xl:col-span-4 bg-slate-900/60 border border-slate-700/80 rounded-2xl p-4 space-y-4">
                          
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400">متطلبات التقييم العملي:</span>
                              <span className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                {practicalRequirements.filter(r => r.checked).length} / 10 مكتملة
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full transition-all duration-500" 
                                style={{ width: `${(practicalRequirements.filter(r => r.checked).length / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-2 text-[11px] max-h-[350px] overflow-y-auto pr-1">
                            {practicalRequirements.map(req => (
                              <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-800 font-sans">
                                <span className={req.checked ? 'text-emerald-400 font-medium line-through opacity-80' : 'text-slate-300'}>
                                  {req.text}
                                </span>
                                <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                                  req.checked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-950/40 text-slate-500'
                                }`}>
                                  {req.checked ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Bonus checks list */}
                          <div className="border-t border-slate-800 pt-3 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 block">درجات المكافأة الإضافية (+5 درجات):</span>
                            {bonusRequirements.map(bonus => (
                              <div key={bonus.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[11px] font-sans">
                                <span className={bonus.checked ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                                  {bonus.text}
                                </span>
                                <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                                  bonus.checked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-950/40 text-slate-500'
                                }`}>
                                  {bonus.checked ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                                </span>
                              </div>
                            ))}
                          </div>

                        </div>

                        {/* Editor and Preview Split */}
                        <div className="xl:col-span-8 flex flex-col gap-4">
                          
                          {/* Code Editor textarea */}
                          <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs">
                              <span className="text-slate-400 font-mono flex items-center gap-1.5">
                                <FileCode className="w-4 h-4 text-blue-400" />
                                <span>index.html</span>
                              </span>
                              <span className="text-[10px] text-slate-500">محرر الأكواد المباشر للطلاب</span>
                            </div>
                            
                            <textarea
                              value={practicalCode}
                              onChange={(e) => setPracticalCode(e.target.value)}
                              rows={15}
                              className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-4 focus:outline-none resize-y direction-ltr text-left leading-relaxed"
                              placeholder="أدخل كود HTML هنا..."
                            />
                          </div>

                          {/* Live Preview Panel */}
                          <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-lg h-[250px] flex flex-col">
                            <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex justify-between items-center text-xs text-slate-800 font-bold">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-slate-500" />
                                <span>معاينة مخرجات الكود الفورية</span>
                              </span>
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">Live Rendering</span>
                            </div>
                            <iframe
                              srcDoc={practicalCode}
                              title="Live Output Preview"
                              className="w-full flex-1 bg-white border-none"
                              sandbox="allow-scripts"
                            />
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* Section Navigation Buttons */}
                <div className="border-t border-slate-700/80 pt-6 mt-8 flex justify-between items-center">
                  
                  {activeTab !== 'q1' ? (
                    <button
                      onClick={() => {
                        if (activeTab === 'q5') setActiveTab('q4');
                        else if (activeTab === 'q4') setActiveTab('q3');
                        else if (activeTab === 'q3') setActiveTab('q2');
                        else if (activeTab === 'q2') setActiveTab('q1');
                      }}
                      className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السؤال السابق</span>
                    </button>
                  ) : <div />}

                  {activeTab !== 'q5' ? (
                    <button
                      onClick={() => {
                        if (activeTab === 'q1') setActiveTab('q2');
                        else if (activeTab === 'q2') setActiveTab('q3');
                        else if (activeTab === 'q3') setActiveTab('q4');
                        else if (activeTab === 'q4') setActiveTab('q5');
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10"
                    >
                      <span>السؤال التالي</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/10 border border-emerald-500/20"
                    >
                      <Send className="w-4 h-4 ml-1 animate-pulse" />
                      <span>تسليم الامتحان الآن</span>
                    </button>
                  )}

                </div>

              </div>
            </div>

          </div>
        )}

        {/* Results / Success Screen */}
        {completed && scoreDetails && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-slate-800 rounded-3xl border border-slate-700/80 shadow-2xl p-8 mt-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-emerald-500 via-teal-400 to-green-500"></div>
            
            <div className="inline-flex p-4 bg-emerald-500/10 rounded-full text-emerald-400 mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="text-2xl font-black text-white mb-1">تهانينا! تم تسليم الامتحان بنجاح</h2>
            <p className="text-slate-400 text-xs mb-6">شكراً لك على أداء المحاولة، لقد تم تسجيل وتصحيح إجاباتك إلكترونياً بنجاح.</p>

            {/* Score Grid Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              
              <div className="bg-slate-900/50 p-4 border border-slate-700/50 rounded-2xl">
                <span className="text-[10px] text-slate-400 block mb-1">النتيجة النهائية</span>
                <span className="text-2xl font-black font-mono text-blue-400">
                  {scoreDetails.totalScore} <span className="text-xs text-slate-500">/ 50</span>
                </span>
              </div>

              <div className="bg-slate-900/50 p-4 border border-slate-700/50 rounded-2xl">
                <span className="text-[10px] text-slate-400 block mb-1">النسبة المئوية</span>
                <span className="text-2xl font-black font-mono text-indigo-400">
                  {Math.round((scoreDetails.totalScore / 50) * 100)}%
                </span>
              </div>

              <div className="bg-slate-900/50 p-4 border border-slate-700/50 rounded-2xl col-span-2 md:col-span-1">
                <span className="text-[10px] text-slate-400 block mb-1">درجات المكافأة (البونص)</span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  +{scoreDetails.bonusScore} <span className="text-xs text-slate-500">درجات</span>
                </span>
              </div>

            </div>

            {/* Detailed breakdowns */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 text-right text-xs space-y-3.5 mb-8">
              <h3 className="font-bold text-white border-b border-slate-800 pb-2 mb-2 flex items-center gap-1.5 text-blue-400 font-sans">📊 تفاصيل الدرجات حسب الأقسام:</h3>
              
              <div className="flex justify-between items-center text-slate-300">
                <span>السؤال الأول (الأسئلة الاختيارية):</span>
                <span className="font-mono font-bold text-white">{scoreDetails.mcqScore} / 10 درجات</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>السؤال الثاني (أسئلة الصواب والخطأ):</span>
                <span className="font-mono font-bold text-white">{scoreDetails.tfScore} / 10 درجات</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>السؤال الثالث (أكمل الفراغات):</span>
                <span className="font-mono font-bold text-white">{scoreDetails.fillScore} / 10 درجات</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>السؤال الرابع (تحليل مخرجات الكود):</span>
                <span className="font-mono font-bold text-white">{scoreDetails.outputScore} / 10 درجات</span>
              </div>

              <div className="flex justify-between items-center text-slate-300 border-b border-slate-800/50 pb-3 font-sans">
                <span>السؤال الخامس (التطبيق العملي):</span>
                <span className="font-mono font-bold text-white">{scoreDetails.practicalScore} / 10 درجات</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pt-1 text-[11px] font-sans">
                <span>الوقت المستغرق لحل الامتحان:</span>
                <span className="font-bold text-slate-300">{timeSpentString}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 text-[11px] font-sans">
                <span>تاريخ ووقت تسليم الإجابات:</span>
                <span className="font-bold text-slate-300">{submittedAtStr}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onNavigateHome}
                className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                العودة للرئيسية
              </button>
              <button
                onClick={() => {
                  // Reset states to let them restart (if they want to retake/retest for review)
                  setIsAuthenticated(false);
                  setStarted(false);
                  setCompleted(false);
                  setMcqAnswers({});
                  setTfAnswers({});
                  setFillAnswers({});
                  setOutputAnswers({});
                  setPracticalCode(`<!DOCTYPE html>
<html>
<head>
  <title>My Profile</title>
</head>
<body>

  <!-- اكتب الكود الخاص بك هنا -->

</body>
</html>`);
                  setStudentName('');
                  setStudentPhone('');
                }}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer"
              >
                محاولة جديدة للتدريب
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
