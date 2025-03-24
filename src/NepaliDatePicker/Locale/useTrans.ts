import { englishToNepaliNumber, nepaliToEnglishNumber } from "nepali-number"
import { ENGLISH, TLocaleType } from "../Types"
import translations from "./translations"

const useTrans = (currentLocale: TLocaleType) => {
    return {
        trans: (key: string, locale?: TLocaleType) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!translations.hasOwnProperty(key)) {
                return key
            }

            // @ts-ignore
            return translations[key][locale || currentLocale]
        },

        numberTrans: (num: number | string, locale?: TLocaleType) => {
            return `${locale || currentLocale}` === ENGLISH
                ? nepaliToEnglishNumber(num as string)
                : englishToNepaliNumber(num)
        },
    }
}

export default useTrans
