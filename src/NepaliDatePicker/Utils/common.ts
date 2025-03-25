import { BSToAD } from "bikram-sambat-js"
import { CalenderData } from "../Config"
import { BS, ParsedDate, SplittedDate, TDateFormatOptions, TDateSeparator, voidFunction } from "../Types"
import {
    getTodayADDate,
    giveValidAdDay,
    giveValidAdMonth,
    giveValidAdYear,
    giveValidBsDay,
    giveValidBsMonth,
    giveValidBsYear,
    validateAdDay,
    validateAdMonth,
    validateAdYear,
    validateBsDay,
    validateBsMonth,
    validateBsYear,
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

export const dateSplitterWithSeparator = (date: string, separator: TDateSeparator): [string, string, string] => {
    const parts = date.replaceAll(separator, "-").split("-")

    return parts as [string, string, string]
}

export const splitDate = (date: string, { separator, format }: TDateFormatOptions<TDateSeparator>): SplittedDate => {
    const parts = dateSplitterWithSeparator(date, separator)

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

export const stitchDate = (date: SplittedDate, { separator, format }: TDateFormatOptions<TDateSeparator>): string => {
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

export const giveValidateObject = (date: SplittedDate, type: string = BS) => {
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

export const giveValidDateObject = (date: SplittedDate, type: "BS" | "AD" = BS): SplittedDate => {
    const todayADDate = getTodayADDate()

    const splittedADDate = splitDate(todayADDate, {
        separator: "-",
        format: "YYYY-MM-DD",
    })
    const { year, month, day } = date

    if (type === BS) {
        const todayBSDate = BSToAD(todayADDate)

        const splittedBSDate = splitDate(todayBSDate, {
            separator: "-",
            format: "YYYY-MM-DD",
        })

        const bsYearValidity = giveValidBsYear(year || splittedBSDate.year)
        const bsMonthValidity = giveValidBsMonth(month || splittedBSDate.month)
        const bsDayValidity = giveValidBsDay(day || splittedBSDate.day)

        const validBufferYear = isNaN(year) || !bsYearValidity.validity ? bsYearValidity.message : year
        const validBufferMonth = isNaN(month) || !bsMonthValidity.validity ? bsMonthValidity.message : month
        const validBufferDay = isNaN(day) || !bsDayValidity.validity ? bsDayValidity.message : day

        return {
            year: giveValidBsYear(validBufferYear).message,
            month: giveValidBsMonth(validBufferMonth).message,
            day: giveValidBsDay(validBufferDay).message,
        }
    }

    const adYearValidity = giveValidAdYear(year || splittedADDate.year)
    const adMonthValidity = giveValidAdMonth(month || splittedADDate.month)
    const adDayValidity = giveValidAdDay(day || splittedADDate.day)

    const validBufferYear = isNaN(year) || !adYearValidity.validity ? adYearValidity.message : year
    const validBufferMonth = isNaN(month) || !adMonthValidity.validity ? adMonthValidity.message : month
    const validBufferDay = isNaN(day) || !adDayValidity.validity ? adDayValidity.message : day

    return {
        year: giveValidAdYear(validBufferYear).message,
        month: giveValidAdMonth(validBufferMonth).message,
        day: giveValidAdDay(validBufferDay).message,
    }
}

export const getNumberOfDaysInBSMonth = (yearMonth: { year: number; month: number }): number => {
    const { year, month } = yearMonth
    validateBsYear(year)
    validateBsMonth(month)

    let yearCount = 0
    const totalYears = year + 1 - CalenderData.minBSYear
    const bsMonthData: number[] = CalenderData.bsMonthCalculatedData[month - 1]

    return bsMonthData?.reduce((numberOfDays: number, monthData: number, index: number) => {
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

export const parseBSDate = (date: string, formatOptions: TDateFormatOptions<TDateSeparator>): ParsedDate => {
    const ogSplittedDate: SplittedDate = splitDate(date, formatOptions)

    const { year, month, day } = giveValidDateObject(ogSplittedDate, "BS")

    const validStitchedDate = stitchDate(
        { year, month, day },
        {
            separator: "-",
            format: "YYYY-MM-DD",
        },
    )

    const adDate = new Date(BSToAD(validStitchedDate))

    // ! This is the first date of the month in BS, format options are hardcoded because BSToAD does not support separator ".".
    const firstBsDateInBSMonth = stitchDate(
        { year, month, day: 1 },
        {
            separator: "-",
            format: "YYYY-MM-DD",
        },
    )
    const firstAdDateInBSMonth = new Date(BSToAD(firstBsDateInBSMonth))
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
