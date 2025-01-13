import { I18n } from 'i18n-js';

import { TRANSLATIONS_EN } from '@/lib/translations/translations_en';
import { TRANSLATIONS_ID } from '@/lib/translations/translations_id';
import { TRANSLATIONS_JP } from '@/lib/translations/translations_jp';
import { TRANSLATIONS_CHT } from '@/lib/translations/translations_cht';
import { TRANSLATIONS_TH } from '@/lib/translations/translations_th';

import type { TypeLanguageCodes } from '@/lib/types/app';

const translations = {
	en: TRANSLATIONS_EN,
	id: TRANSLATIONS_ID,
	jp: TRANSLATIONS_JP,
	cht: TRANSLATIONS_CHT,
	th: TRANSLATIONS_TH,
};

const i18nInstance = new I18n(translations);

i18nInstance.enableFallback = true;

function changeLanguage(lang: TypeLanguageCodes) {
	i18nInstance.locale = lang;
}

export { i18nInstance, changeLanguage };
