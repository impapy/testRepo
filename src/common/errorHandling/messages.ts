import { PASSWORD_MIN_LENGTH } from '../../constants'

export default {
  PHONE_EXIST: {
    en: 'Phone number already exists',
    ar: 'رقم التليفون مستخدم مسبقًا',
  },
  ERROR_WHILE_CREATING_USER: {
    en: 'Error while creating User',
    ar: 'خطأ أثناء إنشاء المستخدم',
  },
  INVALID_EMAIL: {
    en: 'Email address is not valid',
    ar: 'ادخل البريد الإلكتروني بشكل صحيح',
  },
  SERVER_ERROR: { en: 'Server Error', ar: 'خطأ في الخادم' },
  EMAIL_EXIST: {
    en: 'Email already exists',
    ar: 'البريد الإلكتروني مستخدم مسبقًا',
  },
  USERNAME_EXIST: { en: 'Username already exists', ar: 'اسم المستخدِم مستخدَم مسبقًا' },
  ACCOUNT_NOT_FOUND: { en: 'Account not found', ar: 'حساب غير موجود' },
  NOT_FOUND_STUDENT: { en: 'Account not found', ar: 'حساب غير موجود' },
  INCORRECT_CODE: { en: 'Incorrect verification code', ar: 'كود غير صحيح' },
  INCORRECT_CREDENTIALS: { en: 'Incorrect username or password', ar: 'خطأ في اسم المستخدم/ كلمة المرور' },
  UNAUTHORIZED: { en: 'Unauthorized Action', ar: 'خطوة غير مسموح بها' },
  INCORRECT_PASSWORD: { en: 'Incorrect password', ar: 'كلمة مرور خاطئة' },
  FILE_TYPE_NOT_ALLOWED: { en: 'File Type not allowed', ar: 'نوع الملف غير مسموح به' },
  MAX_FILE_SIZE_EXCEEDED: { en: 'File size must be smaller than {size}MB', ar: 'حجم الملف لا يجب ان يتعدى {size}ميجا' },
  NAME_EXISTS: { en: 'name already exists', ar: 'الاسم مستخدم مسبقا' },
  USER_EXISTS: { en: 'User is already exists', ar: 'الاسم مستخدم مسبقا' },
  YOUR_NEW_PASSWORD: {
    en: 'Your new password for doctalk is: ',
    ar: 'كلمة السر الجديدة:',
  },
  TERMS_AND_CONDITIONS_NOT_FOUND: {
    en: 'Terms and conditions are not found',
    ar: 'لم يتم العثور على الشروط والأحكام',
  },
  PRIVACY_POLICY_NOT_FOUND: {
    en: 'Privacy policy are not found',
    ar: 'لم يتم العثور على سياية الخصوصية',
  },
  USERNAME_REQUIRED: { en: 'username is required', ar: 'اسم المستخدم مطلوب' },
  NOTIFICATION_NOT_FOUND: {
    en: 'Notification is not found',
    ar: 'اشعار غير موجود',
  },
  CONTACT_FORM_NOT_FOUND: {
    en: 'Contact form is not found',
    ar: 'نموذج الاتصال غير موجود',
  },
  NOT_FOUND: {
    en: 'Not found',
    ar: 'غير موجود',
  },
  PASSWORD_TOO_SHORT: {
    en: `Password should be longer than ${PASSWORD_MIN_LENGTH} characters.`,
    ar: `احرف ${PASSWORD_MIN_LENGTH}يجب ان يكون الرقم السري اطول من `,
  },
  INVALID_URL: {
    en: `The provided url is not valid`,
    ar: `غير صحيح url`,
  },
  USER_NOT_FOUND: {
    en: 'User NOT FOUND',
    ar: 'المستخدم غير موجود',
  },
  PHONE_REQUIRED: {
    en: 'Phone is required',
    ar: 'رقم الهاتف مطلوب',
  },
  COULD_NOT_INITIATE_PAYMENT: {
    en: 'could not initiate payment with paymob',
    ar: 'لا يمكن تحديد الدفع مع بيموب',
  },
  DEACTIVATED_USER: {
    en: 'This User has been diactivated',
    ar: 'تم إلغاء تنشيط هذا المستخدم',
  },
  MAXIMUM_DURATION: {
    en: 'Dutarion Should Not Exceed 2 Hours',
    ar: 'المده لا يسمح ان تذيد عن ساعتين',
  },
  MAXIMUM_SECTIONS_AT_CLASSES: {
    en: 'The maximum Number of Sessions In Classes is 4',
    ar: 'اقصي عدد 4',
  },
  END_TIME_ERROR: {
    en: 'End Time Must Be Grate Than Start Time',
    ar: 'يجب ان يكون انتهاء السيشن بعد البدايه',
  },
  SESSION_BOOKED: {
    en: 'this session is already booked',
    ar: 'تم حجز تلك السيشن من قبل',
  },
  COUNTRY_NOT_FOUND: {
    en: `Country not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  GOVERNORATE_NOT_FOUND: {
    en: `Governorate not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  DISTRICT_NOT_FOUND: {
    en: `District not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  INVALID_COUNT_SESSION: {
    en: `Number of session not exists`,
    ar: `هذة العدد غير موجودة`,
  },
}
