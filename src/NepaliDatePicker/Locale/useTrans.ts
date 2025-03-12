import { englishToNepaliNumber, nepaliToEnglishNumber } from "nepali-number"
import { ENGLISH, localeType } from "../Types"
import translations from "./translations"

const useTrans = (currentLocale: localeType) => {
    return {
        trans: (key: string, locale?: localeType) => {
            if (!translations.hasOwnProperty(key)) {
                return key
            }

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
