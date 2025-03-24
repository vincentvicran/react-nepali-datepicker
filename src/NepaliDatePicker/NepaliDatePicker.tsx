import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { ADToBS } from "bikram-sambat-js"
import { Calender } from "./Calender"
import { useConfig } from "./Config"
import { useTrans } from "./Locale"
import { ENGLISH, NepaliDatepickerEvents, TDateSeparator, TLocaleType, TNepaliDatePicker } from "./Types"
import { childOf, executionDelegation, stitchDate } from "./Utils/common"

const NepaliDatePicker = <GDateSeparator extends TDateSeparator>(props: TNepaliDatePicker<GDateSeparator>) => {
    const {
        className,
        inputClassName,
        value,
        onChange,
        onSelect,
        options,
        todayIfEmpty,
        placeholder,
        style,
        inputStyle,
        formatOptions,
    } = props

    const nepaliDatePickerWrapper = useRef<HTMLDivElement>(null)
    const nepaliDatePickerInput = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<string>("")
    const [showCalendar, setShowCalendar] = useState<boolean>(false)

    const { setConfig, getConfig } = useConfig()

    const { numberTrans } = useTrans(getConfig<TLocaleType>("currentLocale"))

    const toEnglish = useCallback((val: string): string => numberTrans(val, ENGLISH), [])
    const returnDateValue = useCallback(
        (val: string): string => numberTrans(val, options?.valueLocale),
        [options?.valueLocale],
    )

    useEffect(() => {
        setConfig("currentLocale", options?.calenderLocale ?? "ne")
    }, [options?.calenderLocale])

    useEffect(() => {
        setDate(toEnglish(value || (todayIfEmpty ? ADToBS(new Date()) : "")))
    }, [value])

    const handleClickOutside = useCallback((event: any) => {
        if (nepaliDatePickerWrapper.current && childOf(event.target, nepaliDatePickerWrapper.current)) {
            return
        }

        setShowCalendar(false)
    }, [])

    useLayoutEffect(() => {
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showCalendar])

    useLayoutEffect(() => {
        if (showCalendar && nepaliDatePickerWrapper.current) {
            const nepaliDatePicker = nepaliDatePickerWrapper.current.getBoundingClientRect()
            const screenHeight = window.innerHeight

            const calender: HTMLDivElement | null = nepaliDatePickerWrapper.current.querySelector(".calender")
            if (calender) {
                setTimeout(() => {
                    const calenderHeight = calender.clientHeight

                    if (calenderHeight + nepaliDatePicker.bottom > screenHeight) {
                        if (calenderHeight < nepaliDatePicker.top) {
                            calender.style.bottom = `${nepaliDatePicker.height}px`
                        }
                    }
                }, 0)
            }
        }
    }, [showCalendar])

    const handleOnChange = useCallback(
        (changedDate: string) => {
            executionDelegation(
                () => {
                    setDate(changedDate)
                },
                () => {
                    if (onChange) {
                        onChange(returnDateValue(changedDate))
                    }
                },
            )
        },
        [onChange],
    )

    const handleOnDaySelect = useCallback(
        (selectedDate: any) => {
            executionDelegation(
                () => {
                    if (options?.closeOnSelect) {
                        setShowCalendar(false)
                    }
                },
                () => {
                    if (onSelect) {
                        onSelect(returnDateValue(stitchDate(selectedDate)))
                    }
                },
            )
        },
        [onSelect],
    )

    const datepickerEvents: NepaliDatepickerEvents = {
        change: handleOnChange,
        daySelect: handleOnDaySelect,
        todaySelect: handleOnDaySelect,
    }

    const onInputChange = useCallback(
        (changedDate: string) => {
            executionDelegation(
                () => {
                    setDate(changedDate)
                },
                () => {
                    if (onChange) {
                        onChange(returnDateValue(changedDate))
                    }
                },
            )
        },
        [onChange],
    )

    // Function to determine positions and patterns based on format
    const getSeparatorPositionsAndPatterns = useCallback(() => {
        // Escape separator for regex use
        const escapedSeparator = formatOptions?.separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

        let positions: [number, number] = [2, 5]
        let pattern: string = ""

        // Improved regex patterns for day, month, year
        const dayPattern = "(0[1-9]|[1-2][0-9]|3[01])"
        const monthPattern = "(0[1-9]|1[0-2])"
        const yearPattern = "\\d{4}"

        switch (formatOptions?.format) {
            case `DD${formatOptions?.separator}MM${formatOptions?.separator}YYYY`:
                positions = [3, 5]
                pattern = `^${dayPattern}${escapedSeparator}${monthPattern}${escapedSeparator}${yearPattern}$`
                break
            case `MM${formatOptions?.separator}DD${formatOptions?.separator}YYYY`:
                positions = [3, 5]
                pattern = `^${monthPattern}${escapedSeparator}${dayPattern}${escapedSeparator}${yearPattern}$`
                break
            case `YYYY${formatOptions?.separator}MM${formatOptions?.separator}DD`:
            default:
                positions = [4, 6]
                pattern = `^${yearPattern}${escapedSeparator}${monthPattern}${escapedSeparator}${dayPattern}$`
        }

        return { positions, pattern }
    }, [formatOptions])

    const { positions, pattern } = getSeparatorPositionsAndPatterns()

    // Function to format input value with separators
    const formatDateString = useCallback(
        (value: string): string => {
            // Remove all non-numeric characters
            const digitsOnly = value.replace(/\D/g, "")

            let result = ""
            let digitIndex = 0

            // Maximum number of digits based on format
            const maxDigits = 8

            // Build the formatted string
            for (let i = 0; i < 10; i++) {
                console.log({ i, result, digitIndex, digitsOnly, positionTrue: positions.includes(i) })
                if (
                    positions.includes(i) &&
                    digitIndex > 0 &&
                    i !== digitsOnly.length &&
                    digitIndex >= (positions.find((p) => p === i) ?? 0)
                ) {
                    result += formatOptions?.separator
                }

                if (digitIndex < digitsOnly.length && digitIndex < maxDigits) {
                    result += digitsOnly[digitIndex]
                    digitIndex++
                }
            }

            return result
        },
        [formatOptions, positions],
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowCalendar(false)
        const newValue = e.target.value

        // Remove unwanted characters (anything that isn't a digit or the separator)
        const sanitized = newValue.replace(new RegExp(`[^0-9${formatOptions?.separator}]`, "g"), "")

        // Count digits
        const digitCount = sanitized.length

        // Only format if we have digits
        if (digitCount > 0) {
            let formatted = formatDateString(sanitized)

            console.log({ formatted })
            setDate(formatted)

            onInputChange(formatted)
        } else {
            setDate("")
            onInputChange("")
        }
    }

    return (
        <div ref={nepaliDatePickerWrapper} className={`nepali-date-picker ${className}`} style={style}>
            <input
                type='text'
                ref={nepaliDatePickerInput}
                className={inputClassName}
                value={numberTrans(date)}
                onClick={() => setShowCalendar((visible) => !visible)}
                style={inputStyle}
                placeholder={placeholder || formatOptions?.format}
                onInput={handleInputChange}
                maxLength={10} // DD/MM/YYYY format has 10 characters
                pattern={pattern}
            />

            {showCalendar && <Calender value={date && date} events={datepickerEvents} formatOptions={formatOptions} />}
        </div>
    )
}

export default NepaliDatePicker
