export interface CustomPaymentChannel {
  id: string;
  type: 'wallet' | 'instapay' | 'fawry' | 'custom';
  name: string; // e.g. "محفظة فودافون كاش", "انستاباي"
  account: string; // value e.g. "01553514081", "sciteach@instapay"
  instructions: string; // specific checkout instructions
  extraFees?: string; // extra fee if any
}

export interface StructuredPaymentSetup {
  instapayLink: string;
  fawryNumber: string;
  walletNumber: string;
  generalInstructions: string;
  methods: CustomPaymentChannel[];
}

/**
 * Parses payment instructions from database or default settings.
 * Handles both classic multi-line text format and new structured JSON formats safely.
 */
export function parsePaymentInstructions(raw: string): StructuredPaymentSetup {
  if (!raw) {
    return getFallbackSetup();
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        return {
          instapayLink: parsed.instapayLink || '',
          fawryNumber: parsed.fawryNumber || '',
          walletNumber: parsed.walletNumber || '',
          generalInstructions: parsed.generalInstructions || '',
          methods: Array.isArray(parsed.methods) ? parsed.methods : [],
        };
      }
    } catch (e) {
      console.warn("Failed to parse paymentInstructions JSON. Falling back to plain text parser.", e);
    }
  }

  // Fallback pattern parser for plain-text databases
  const lines = raw.split('\n');
  let instapay = 'sciteach@instapay';
  let wallet = '01553514081';
  let fawry = '';

  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes('instapay')) {
      const parts = line.split(':');
      if (parts.length > 1) instapay = parts[1].trim();
    } else if (l.includes('vodafone') || l.includes('cash') || l.includes('محفظة')) {
      const parts = line.split(':');
      if (parts.length > 1) wallet = parts[1].trim().replace(/[^0-9+]/g, '');
    } else if (l.includes('fawry') || l.includes('فوري')) {
      const parts = line.split(':');
      if (parts.length > 1) fawry = parts[1].trim();
    }
  }

  return {
    instapayLink: instapay,
    fawryNumber: fawry,
    walletNumber: wallet,
    generalInstructions: raw,
    methods: [
      {
        id: 'legacy-wallet',
        type: 'wallet',
        name: 'محفظة موبايل (فودافون كاش / اتصالات كاش)',
        account: wallet,
        instructions: 'قم بتحويل المبلغ المطلوب إلى رقم المحفظة الموضح أعلاه.',
        extraFees: 'بدون رسوم إضافية'
      },
      {
        id: 'legacy-instapay',
        type: 'instapay',
        name: 'حساب إنستاباي مباشر (Instapay)',
        account: instapay,
        instructions: 'اكتب كود الطالب الفريد الموضح في تفاصيل التحويل مباشرة لتسريع المراجعة.',
        extraFees: 'بدون رسوم'
      }
    ]
  };
}

/**
 * Packs structured setup back into a serialized JSON string for db text column storage.
 */
export function stringifyPaymentInstructions(setup: StructuredPaymentSetup): string {
  return JSON.stringify(setup);
}

function getFallbackSetup(): StructuredPaymentSetup {
  return {
    instapayLink: 'sciteach@instapay',
    fawryNumber: '',
    walletNumber: '01553514081',
    generalInstructions: 'يرجى إرسال لقطة شاشة لعملية التحويل مع كود الطالب للمتابعة وتفعيل الحساب.',
    methods: [
      {
        id: 'default-vdf',
        type: 'wallet',
        name: 'فودافون كاش (Vodafone Cash)',
        account: '01553514081',
        instructions: 'برجاء إرسال تأكيد التحويل في رسالة على الواتساب مع كود الطالب لمراجعة وتأكيد حسابك.',
        extraFees: 'لا توجد'
      },
      {
        id: 'default-instapay',
        type: 'instapay',
        name: 'حساب إنستاباي مباشر (Instapay)',
        account: 'sciteach@instapay',
        instructions: 'اكتب كود المعاملة أو كود الطالب للمراجعة المباشرة وتأكيد الحساب.',
        extraFees: 'لا توجد'
      }
    ]
  };
}
