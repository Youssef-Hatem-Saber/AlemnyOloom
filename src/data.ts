import { Course, FreeSession, News, Teacher, DynamicForm, AcademySettings, Registration, ContactMessage, Coupon } from './types';

export const INITIAL_SETTINGS: AcademySettings = {
  academyName: "علّمني علوم",
  tagline: "وجهتك الاولى للعبور الى جميع مدارس المتفوقين",
  phone: "01274711669",
  whatsapp: "https://wa.me/201274711669",
  email: "info@allimnyOloom.youssefhatem.com",
  facebookUrl: "https://www.facebook.com/AllimnyOloom/",
  youtubeUrl: "https://youtube.com/@alimny.oloom",
  telegramUrl: "https://t.me/alimny_oloom",
  whatsappChannel: "https://whatsapp.com/channel/0029VbD70Hv2kNFjYSp9XT3y",
  paymentInstructions: "Vodafone Cash: 01274711669\nInstapay ID: sciteach@instapay\nبرجاء إرسال لقطة شاشة لعملية التحويل مع كود الطالب للمتابعة وتفعيل الحساب.",
  aboutText: "نؤهلك لاجتياز اختبارات القبول والتميز في مدارس STEM والضبعة النووية ومدارس التكنولوجيا التطبيقية، مع تنمية مهاراتك العلمية والأكاديمية من خلال برنامج متكامل ومتابعة مستمرة على مدار الساعة لتحقيق أفضل فرص النجاح والقبول.",
  visionText: "بناء جيلٍ من القادة والمبتكرين وصنّاع التغيير، يمتلك المعرفة والمهارات والثقة اللازمة للمنافسة محليًا وعالميًا، ويقود مستقبلًا قائمًا على العلم والإبداع والابتكار.",
  missionText: "تقديم تعليم نوعي يجمع بين التميز الأكاديمي والتطبيق العملي، ويُنمّي مهارات التفكير النقدي وحل المشكلات والإبداع والتكنولوجيا، من خلال بيئة تعليمية حديثة وبرامج متخصصة ومتابعة مستمرة، لتمكين كل طالب من الوصول إلى أقصى إمكاناته وتحقيق أهدافه العلمية والمهنية.",
  stemPrice: 1200,
  stemLecturesCount: 49,
  stemSchedule: "الأحد والأربعاء الساعة 7:00 مساءً",
  stemDiscountPercent: 10,
  stemPreBookingEnded: false
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "أ. أحمد عبد الغني",
    specialty: "كبير معلمي العلوم والفيزياء بمسار STEM",
    bio: "خبرة أكثر من 15 عاماً في تدريب الطلاب على اختبارات القبول لمدارس المتفوقين ومسابقات العلوم الدولية، حائز على دبلومة في مناهج الـ STEM.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "t2",
    name: "د. هبة الشافعي",
    specialty: "أخصائية مهارات التفكير والحل الإبداعي للمشكلات",
    bio: "دكتوراة في التربية وتنمية الذكاء الإبداعي، قامت بتدريب مئات الطلاب على مخرجات القيادة وحل المشكلات المعاصرة بمقاييس عالمية.",
    image: "https://images.unsplash.com/photo-1580894732444-8febeb78fb3e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "t3",
    name: "م. محمد رأفت",
    specialty: "رئيس قسم البرمجة والذكاء الاصطناعي والتقني",
    bio: "مهندس برمجيات متخصص في نمذجة الروبوتات وتطبيقات الويب، شغوف بتبسيط تكنولوجيا الغد للأجيال الناشئة من خلال تطبيقات عملية مبتكرة.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "c1",
    title: "برنامج مسار المتفوقين الشامل (STEM & الضبعة)",
    description: "أقوى برامج الأكاديمية لتأهيل الطلاب لاختبارات قبول مدارس STEM ومدرسة الضبعة النووية والتكنولوجيا التطبيقية.",
    longDescription: "يضم المسار الشامل أكثر من 40 محاضرة تفاعلية تدريبية تركز على شرح مادة الاستعداد الذهني (IQ) والعلوم التطبيقية والرياضيات المتقدمة، بالاضافة الى التدريب الشامل على المقابلات الشخصية التفاعلية وكيفية اجتيازها بثقة. يحتوي الكورس على نماذج امتحانات فعلية دورية وواجبات تصحح الكترونياً لضمان تحقيق التفوق والالتحاق بالمدرسة المستهدفة.",
    price: 1200,
    level: "الصف الثالث الإعدادي",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 42,
    duration: "4 شهور",
    isPublished: true,
    category: "STEM"
  },
  {
    id: "c2",
    title: "مبادئ الفيزياء الفلكية والطاقة النووية",
    description: "بوابة المعرفة المخصصة للتحضير لمدرسة الضبعة للطاقة النووية السلمية والعلوم الهندسية المتطورة.",
    longDescription: "يستهدف هذا الكورس تمليك الطلاب المفاتيح الأساسية للفيزياء الحديثة، تركيب الذرة، وتطبيقات الطاقة النووية السلمية، والرياضيات الفيزيائية. الكورس يشمل تجارب معملية ومحاكاة رقمية تلتزم بأعلى قدر من الجودة العلمية.",
    price: 800,
    level: "الشهادة الإعدادية والثانوية",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 20,
    duration: "2 شهر",
    isPublished: true,
    category: "علوم"
  },
  {
    id: "c3",
    title: "أساسيات البرمجة وتطوير الويب للفتيان",
    description: "منهج عملي لبناء أولى تطبيقاتك وموقعك الإلكتروني باستخدام التفكير المنطقي ولغة جافاسكريبت.",
    longDescription: "المنهج مصمم للأعمار من 11 لـ 16 سنة لتعليم لغات المستقبل وتطوير المواقع التفاعلية وحل المشكلات بطريقة خوارزمية. يحصل كل طالب في نهاية البرنامج على مشروع تخرج متكامل ينشر أونلاين.",
    price: 650,
    level: "من سن 11 إلى 16 سنة",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 16,
    duration: "1.5 شهر",
    isPublished: true,
    category: "برمجة"
  }
];

export const INITIAL_FORMS: DynamicForm[] = [
  {
    id: "form-stem",
    title: "طلب التسجيل في محاضرة STEM التعريفية المجانية",
    description: "املأ البيانات التالية لحجز مقعدك في البث المباشر القادم للتعريف بمدارس المتفوقين ونظام الامتحانات.",
    fields: [
      { id: "f1", label: "اسم الطالب ثلاثي", type: "text", required: true },
      { id: "f2", label: "المدرسة الحالية", type: "text", required: true },
      { id: "f3", label: "نسبة المجموع المتوقعة (إرشادية %)", type: "number", required: false },
      { id: "f4", label: "المحافظة", type: "select", required: true, options: ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الغربية", "القليوبية", "الشرقية", "محافظة أخرى"] },
      { id: "f5", label: "نوع التقديم المستهدف", type: "select", required: true, options: ["مدارس STEM للمتفوقين", "مدرسة الضبعة النووية", "مدارس التكنولوجيا التطبيقية", "أخرى"] }
    ]
  },
  {
    id: "form-nuclear",
    title: "الندوة الإرشادية لفرص الالتحاق بمدرسة الضبعة النووية",
    description: "سجل الآن لحضور اللقاء المفتوح مع خبراء الطاقة والمسؤولين لمعرفة شروط التقديم لعام 2026.",
    fields: [
      { id: "fn1", label: "الاسم بالكامل", type: "text", required: true },
      { id: "fn2", label: "مجموع الصف الثالث الإعدادي (اختياري)", type: "number", required: false },
      { id: "fn3", label: "المحافظة السكنية", type: "text", required: true },
      { id: "fn4", label: "هل تريد الانضمام للجروب الخاص بـ علّمني علوم؟", type: "select", required: true, options: ["نعم، بالتأكيد", "لا، أكتفي بحضور اللقاء"] }
    ]
  },
  {
    id: "form-generic",
    title: "استبيان قياس الاهتمام بمسارات التكنولوجيا والذكاء الاصطناعي",
    description: "تساعدنا إجاباتك على تطوير البرامج الجديدة الملائمة لشغفك وتطلعاتك المستقبلية.",
    fields: [
      { id: "g1", label: "الاسم", type: "text", required: true },
      { id: "g2", label: "أكثر مجال يثير اهتمامك", type: "select", required: true, options: ["علم الروبوتات", "برمجة تطبيقات الهاتف", "تصميم الألعاب", "الذكاء الاصطناعي التوليدي"] },
      { id: "g3", label: "ملاحظات أو أسئلة تود طرحها", type: "textarea", required: false }
    ]
  }
];

export const INITIAL_FREE_SESSIONS: FreeSession[] = [
  {
    id: "fs1",
    title: "المحاضرة التأسيسية المجانية لاختبارات القبول لمدارس STEM",
    slug: "free-session-stem",
    date: "25 يونيو 2026 - الساعة 7:00 مساءً",
    description: "فرصة رائعة للتعرف على شكل الأسئلة، واستراتيجيات الحل السريع لمادة الاستعداد الذهني والمنطقي IQ ومحاور مادة العلوم العامة.",
    formId: "form-stem",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600",
    registeredCount: 142,
    isStemTrack: true
  },
  {
    id: "fs2",
    title: "ندوة تعريفية خاصة بشروط ومزايا مدرسة الضبعة النووية",
    slug: "free-session-nuclear",
    date: "28 يونيو 2026 - الساعة 8:00 مساءً",
    description: "من يملك حق التقديم؟ وكيف تستعد لاختبارات التقييم النفسي والذكاء؟ لقاء مفتوح يجيب عن تساؤلات أولياء الأمور والطلاب.",
    formId: "form-nuclear",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
    registeredCount: 89,
    isStemTrack: false
  }
];

export const INITIAL_NEWS: News[] = [
  {
    id: "n1",
    title: "صدور الشروط الرسمية للتقديم بمدارس STEM لعام 2026",
    slug: "stem-2026",
    content: "أعلنت وزارة التربية والتعليم والتعليم الفني اليوم الشروط المسبقة لحجز واختبارات التقدم لمدارس المتفوقين في العلوم والتكنولوجيا (STEM). تشمل المعايير حصول الطالب على 98% في المجموع الكلي أو الحصول على الدرجات النهائية في مادتين من ثلاث مواد أساسية: (العلوم - الرياضيات - اللغة الإنجليزية). يبدأ التسجيل الإلكتروني في الأول من يوليو القادم ونعد طلابنا الأعزاء بتأهيل شامل واحترافي كما عهدونا لنجتاز هذه العقبة معاً نحو حلم العباقرة.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600",
    date: "18 يونيو 2026"
  },
  {
    id: "n2",
    title: "تحديثات هامة لمدرستنا النووية بالضبعة وزيادة أعداد المقبولين",
    slug: "nuclear-update",
    content: "صرح مصدر رسمي بالإدارة العامة للتعليم الصناعي بوجود خطة لتوسيع الطاقة الاستيعابية لمدرسة الضبعة النووية هذا العام نتيجة لزيادة الكوادر والمنح والاتفاقات. سيتيح هذا زيادة فرصة قبول المتميزين في الرياضيات والذكاء التكنولوجي. تقدم منصة علّمني علوم تدريباً خاصاً يمتد لأكثر من 40 ساعة مكثفة للقبول بالضبعة النووية.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    date: "14 يونيو 2026"
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: "reg1",
    studentCode: "AO100234",
    studentName: "يوسف إبراهيم محمد",
    studentPhone: "01124567890",
    studentEmail: "youssef.ibrahim@example.com",
    senderType: "student",
    currentSchool: "مدرسة طه حسين الإعدادية",
    governorate: "القاهرة",
    courseId: "c1",
    dynamicData: {},
    paymentStatus: "Paid",
    paymentMethod: "فودافون كاش",
    registeredAt: "2026-06-15T14:32:00.000Z",
    pricePaid: 1200
  },
  {
    id: "reg2",
    studentCode: "AO100235",
    studentName: "سارة محمود علي",
    studentPhone: "01598765432",
    studentEmail: "sarah.parent@example.com",
    senderType: "parent",
    currentSchool: "مدرسة أم الأبطال التجريبية",
    governorate: "الجيزة",
    courseId: "c1",
    dynamicData: {},
    paymentStatus: "Pending",
    paymentMethod: "إنستاباي",
    registeredAt: "2026-06-19T09:12:00.000Z",
    pricePaid: 1200
  },
  {
    id: "reg3",
    studentCode: "AO100236",
    studentName: "أدهم هاني محمود",
    studentPhone: "01211122233",
    studentEmail: "adham.coder@example.com",
    senderType: "student",
    currentSchool: "مدرسة اللغات القومية بالرمل",
    governorate: "الإسكندرية",
    courseId: "c3",
    dynamicData: {},
    paymentStatus: "Paid",
    paymentMethod: "تحويل بنكي",
    registeredAt: "2026-06-10T18:45:00.000Z",
    pricePaid: 650
  },
  {
    id: "reg4",
    studentCode: "AO100237",
    studentName: "كريم أحمد جلال",
    studentPhone: "01034343434",
    studentEmail: "karim.stem.free@gmail.com",
    senderType: "student",
    currentSchool: "مدرسة جمال عبد الناصر",
    governorate: "الدقهلية",
    freeSessionId: "fs1",
    dynamicFormId: "form-stem",
    dynamicData: {
      "f1": "كريم أحمد جلال",
      "f2": "مدرسة جمال عبد الناصر",
      "f3": "98.5",
      "f4": "الدقهلية",
      "f5": "مدارس STEM للمتفوقين"
    },
    paymentStatus: "Paid",
    paymentMethod: "مجاني",
    registeredAt: "2026-06-20T11:05:00.000Z",
    pricePaid: 0
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "m1",
    name: "م. أشرف الحسيني (ولي أمر)",
    phone: "01022233344",
    email: "ashraf.parent@yahoo.com",
    senderType: "parent",
    message: "ابني حصل على مجموع 98.7% في الشهادة الإعدادية هذا العام، ونريد الاشتراك مباشرة في مسار المتفوقين للتأهيل لاختمبارات STEM. هل الكورس يبدأ أونلاين بالكامل أم هناك لقاءات تفاعلية؟ شكراً لكم.",
    date: "19 يونيو 2026",
    solved: false
  },
  {
    id: "m2",
    name: "ندى خالد شعبان",
    phone: "01155555555",
    email: "nada.khalid@gmail.com",
    senderType: "student",
    message: "هل يمكنني الالتحاق بكورس البرمجة وأنا أدرس حالياً بالمرحلة الثانوية وليس الإعدادية؟ وهل الشهادة الممنوحة معتمدة من الأكاديمية؟",
    date: "17 يونيو 2026",
    solved: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cp1",
    code: "STEM10",
    discountType: "percent",
    discountValue: 10,
    isActive: true
  },
  {
    id: "cp2",
    code: "EXCEL20",
    discountType: "percent",
    discountValue: 20,
    isActive: true
  },
  {
    id: "cp3",
    code: "OLM100",
    discountType: "fixed",
    discountValue: 100,
    isActive: true
  }
];
