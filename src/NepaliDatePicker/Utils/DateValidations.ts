import { CalenderConfig } from "../Config"

type TValidDateOutput = {
    validity: boolean
    message: number
}

export const getTodayADDate = () => {
    return new Date().toISOString().split("T")[0]
}

export const validateAdYear = (year: number) => {
    const minAdYear = CalenderConfig.minBSYear - 57
    const maxAdYear = CalenderConfig.maxBSYear - 57

    if (year < minAdYear || year > maxAdYear) {
        throw new RangeError(`AD year should be in range of ${minAdYear} to ${maxAdYear}`)
    }
}

export const giveValidAdYear = (year: number): TValidDateOutput => {
    const minAdYear = CalenderConfig.minBSYear - 57
    const maxAdYear = CalenderConfig.maxBSYear - 57

    return {
        message: Math.min(Math.max(year, minAdYear), maxAdYear),
        validity: !(year < minAdYear || year > maxAdYear),
    }
}

export const validateAdMonth = (month: number) => {
    if (month < 1 || month > 12) {
        throw new RangeError("AD month should be in range of 1 to 12")
    }
}

export const giveValidAdMonth = (month: number): TValidDateOutput => {
    return { message: Math.min(Math.max(month, 1), 12), validity: !(month < 1 || month > 12) }
}

export const validateAdDay = (day: number) => {
    if (day < 1 || day > 31) {
        throw new RangeError("AD day should be in range of 1 to 31")
    }
}

export const giveValidAdDay = (day: number): TValidDateOutput => {
    return { message: Math.min(Math.max(day, 1), 31), validity: !(day < 1 || day > 31) }
}

export const validateBsYear = (year: number) => {
    const minBsYear = CalenderConfig.minBSYear
    const maxBsYear = CalenderConfig.maxBSYear

    if (year < minBsYear || year > maxBsYear) {
        throw new RangeError(`BS year should be in range of ${minBsYear} to ${maxBsYear}`)
    }
}

export const giveValidBsYear = (year: number): TValidDateOutput => {
    const minBsYear = CalenderConfig.minBSYear
    const maxBsYear = CalenderConfig.maxBSYear

    return {
        message: Math.min(Math.max(year, minBsYear), maxBsYear),
        validity: !(year < minBsYear || year > maxBsYear),
    }
}

export const validateBsMonth = (month: number) => {
    if (month < 1 || month > 12) {
        throw new RangeError("BS month should be in range of 1 to 12")
    }
}

export const giveValidBsMonth = (month: number): TValidDateOutput => {
    return { message: Math.min(Math.max(month, 1), 12), validity: !(month < 1 || month > 12) }
}

export const validateBsDay = (day: number) => {
    if (day < 1 || day > 32) {
        throw new RangeError("BS day should be in range of 1 to 32")
    }
}

export const giveValidBsDay = (day: number): TValidDateOutput => {
    return { message: Math.min(Math.max(day, 1), 32), validity: !(day < 1 || day > 32) }
}
