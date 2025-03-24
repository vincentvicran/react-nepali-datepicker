import { ADToBS, BSToAD } from "bikram-sambat-js"
import { CalenderData } from "../Config"
import { BS, ParsedDate, SplittedDate, TDateFormatOptions, TDateSeparator, voidFunction } from "../Types"
import {
    giveValidAdDay,
    giveValidAdMonth,
    giveValidAdYear,
    validateAdDay,
    validateAdMonth,
    validateAdYear,
    validateBsDay,
    validateBsMonth,
    validateBsYear,
    validatedBsDay,
    validatedBsMonth,
    validatedBsYear,
} from "./DateValidations"

export const defaultFormatOptions: TDateFormatOptions<TDateSeparator> = {
    separator: "-",
    format: "YYYY-MM-DD",
}

export const range = (start: number, end: number, step: number = 1): number[] => {
    const list = []

    for (let i = start; i <= end; i = i + step) {
        list.push(i)
    }

    return list
}

export const zeroPad = (num: number): string => `${num > 9 ? num : "0" + num}`

export const executionDelegation = (execution: voidFunction, delegatedExecution: voidFunction) => {
    new Promise<void>((resolve) => {
        execution()
        resolve()
    }).then(() => {
        delegatedExecution()
    })
}

export const splitDate = (
    date: string,
    { separator, format }: TDateFormatOptions<TDateSeparator> = defaultFormatOptions,
): SplittedDate => {
    const parts = date.split(separator)
    let year: string, month: string, day: string

    if (format === `YYYY${separator}MM${separator}DD`) {
        ;[year, month, day] = parts
    } else if (format === `DD${separator}MM${separator}YYYY`) {
        ;[day, month, year] = parts
    } else if (format === `MM${separator}DD${separator}YYYY`) {
        ;[month, day, year] = parts
    } else {
        throw new Error(`Unsupported date format: ${format}`)
    }

    return {
        day: parseInt(day, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
    }
}

export const stitchDate = (
    date: SplittedDate,
    { separator, format }: TDateFormatOptions<TDateSeparator> = defaultFormatOptions,
): string => {
    let returnDate: string = `${date.year}${separator}${zeroPad(date.month)}${separator}${zeroPad(date.day)}`
    if (format === `YYYY${separator}MM${separator}DD`) {
        returnDate = `${date.year}${separator}${zeroPad(date.month)}${separator}${zeroPad(date.day)}`
    } else if (format === `DD${separator}MM${separator}YYYY`) {
        returnDate = `${zeroPad(date.day)}${separator}${zeroPad(date.month)}${separator}${date.year}`
    } else if (format === `MM${separator}DD${separator}YYYY`) {
        returnDate = `${zeroPad(date.day)}${separator}${zeroPad(date.month)}${separator}${date.year}`
    } else {
        throw new Error(`Unsupported date format: ${format}`)
    }
    return returnDate
}

export const validateDateObject = (date: SplittedDate, type: string = BS) => {
    const { year, month, day } = date

    if (type === BS) {
        validateBsYear(year)
        validateBsMonth(month)
        validateBsDay(day)

        return
    }

    validateAdYear(year)
    validateAdMonth(month)
    validateAdDay(day)
}

export const giveValidDateObject = (date: SplittedDate, type: string = BS): SplittedDate => {
    const today = parseBSDate(ADToBS(new Date()))

    const splittedDate = splitDate(today.adDate.toString())
    const { year, month, day } = date

    const validBufferYear = isNaN(year) ? splittedDate.year : year
    const validBufferMonth = isNaN(month) ? splittedDate.month : month
    const validBufferDay = isNaN(day) ? splittedDate.day : day

    if (type === BS) {
        return {
            year: validatedBsYear(validBufferYear),
            month: validatedBsMonth(validBufferMonth),
            day: validatedBsDay(validBufferDay),
        }
    }

    return {
        year: giveValidAdYear(validBufferYear),
        month: giveValidAdMonth(validBufferMonth),
        day: giveValidAdDay(validBufferDay),
    }
}

export const getNumberOfDaysInBSMonth = (yearMonth: { year: number; month: number }): number => {
    const { year, month } = yearMonth
    validateBsYear(year)
    validateBsMonth(month)

    let yearCount = 0
    const totalYears = year + 1 - CalenderData.minBSYear
    const bsMonthData: number[] = CalenderData.bsMonthCalculatedData[month - 1]

    return bsMonthData.reduce((numberOfDays: number, monthData: number, index: number) => {
        if (monthData === 0 || numberOfDays !== 0) {
            return numberOfDays
        }

        const bsMonthUpperDaysIndex = index % 2
        yearCount += monthData
        if (totalYears > yearCount) {
            return numberOfDays
        }

        if (year === 2081 && month === 2) {
            return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex + 1]
        }

        if (year === 2081 && month === 3) {
            return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex - 1]
        }

        if (year === 2081 && month === 11) {
            return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex] - 1
        }

        if (year === 2081 && month === 12) {
            return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex] + 1
        }

        if ((year === 2085 && month === 5) || (year === 2088 && month === 5)) {
            return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex] - 2
        }

        return CalenderData.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex]
    }, 0)
}

export const parseBSDate = (
    date: string,
    formatOptions: TDateFormatOptions<TDateSeparator> = defaultFormatOptions,
): ParsedDate => {
    const { year, month, day }: SplittedDate = splitDate(date, formatOptions)

    validateDateObject({ year, month, day })

    const adDate = new Date(BSToAD(date))
    const firstAdDateInBSMonth = new Date(BSToAD(stitchDate({ year, month, day: 1 }, formatOptions)))
    const numberOfDaysInMonth = getNumberOfDaysInBSMonth({ year, month })

    return {
        adDate,
        bsDay: day,
        bsMonth: month,
        bsYear: year,
        firstAdDayInBSMonth: firstAdDateInBSMonth,
        numberOfDaysInBSMonth: numberOfDaysInMonth,
        weekDay: adDate.getDay(),
    }
}

export const childOf = (childNode: any, parentNode: any): boolean => parentNode.contains(childNode)
