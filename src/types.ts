export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number; // 0 for free
  level: string; // e.g. "الصف الثالث الإعدادي", "طلاب STEM"
  image: string;
  lecturesCount: number;
  duration: string; // e.g. "3 شهور"
  isPublished: boolean;
  category: string; // e.g. "STEM", "علوم", "برمجة", "لغات"
}

export interface FreeSession {
  id: string;
  title: string;
  slug: string; // e.g. "free-session-stem"
  date: string;
  description: string;
  formId: string; // references DynamicForm
  image: string;
  registeredCount: number;
  isStemTrack?: boolean;
}

export interface News {
  id: string;
  title: string;
  slug: string; // e.g. "stem-2026"
  content: string;
  image: string;
  date: string;
  readingTime?: string;
}

export interface Teacher {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  senderType: 'student' | 'parent';
  message: string;
  date: string;
  solved: boolean;
}

export type FieldType = 'text' | 'number' | 'email' | 'phone' | 'select' | 'textarea';

export interface DynamicField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for select type
}

export interface DynamicForm {
  id: string;
  title: string;
  description?: string;
  fields: DynamicField[];
}

export interface Registration {
  id: string;
  studentCode: string; // e.g. AO001234
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  senderType: 'student' | 'parent';
  currentSchool: string;
  governorate: string;
  courseId?: string; // empty if registered to free session or form
  freeSessionId?: string;
  dynamicFormId?: string;
  dynamicData: Record<string, string>; // custom form responses
  paymentStatus: 'Pending' | 'Paid';
  paymentMethod?: string;
  registeredAt: string;
  pricePaid?: number;
  appliedCoupon?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  isActive: boolean;
  expiryDate?: string;
  maxUsages?: number;
  usages?: number;
}

export interface AcademySettings {
  academyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  whatsappChannel?: string;
  paymentInstructions: string; // info about Vodafone Cash, Instapay etc.
  aboutText: string;
  visionText: string;
  missionText: string;
  stemPrice?: number;
  stemLecturesCount?: number;
  stemSchedule?: string;
  stemDiscountPercent?: number;
  stemPreBookingEnded?: boolean;
  isStemTrackEnabled?: boolean;
}

export interface ExamQuestion {
  id: string;
  subject: 'english' | 'iq' | 'math' | 'science';
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  image?: string;
}

export interface ExamSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  studentCode?: string;
  score: number;
  totalPoints: number;
  answers: Record<string, string>;
  submittedAt: string;
}

