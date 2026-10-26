import type { LangCode } from '@/engine/types';

// Vietnamese-only letters / tone marks
const VI_CHARS = /[ăâđêôơưàảãáạằẳẵắặầẩẫấậèẻẽéẹềểễếệìỉĩíịòỏõóọồổỗốộờởỡớợùủũúụừửữứựỳỷỹýỵ]/i;

// Cheap EN/VI guess; replaced by ML Kit identifyLanguage in phase 4
export const detectLang = (text: string): LangCode => (VI_CHARS.test(text) ? 'vi' : 'en');

export const otherLang = (lang: LangCode): LangCode => (lang === 'en' ? 'vi' : 'en');
