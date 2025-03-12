import { englishToNepaliNumber, nepaliToEnglishNumber } from "nepali-number"
import { ENGLISH, localeType } from "../Types"
import translations from "./translations"

const useTrans = (currentLocale: localeType) => {
    return {
        trans: (key: string, locale?: localeType) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!translations.hasOwnProperty(key)) {
                return key
            }

            // @ts-ignore
            return translations[key][locale || currentLocale]
        },

        numberTrans: (num: number | string, locale?: localeType) => {
            return `${locale || currentLocale}` === ENGLISH
                ? nepaliToEnglishNumber(num as string)
                : englishToNepaliNumber(num)
        },
    }
}

export default useTrans
