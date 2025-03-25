import { ADToBS } from "bikram-sambat-js"
import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from "react"
import { useConfig } from "../Config"
import {
    NepaliDatepickerEvents,
    ParsedDate,
    parsedDateInitialValue,
    SplittedDate,
    TDateFormatOptions,
    TDateSeparator,
} from "../Types"
import { defaultFormatOptions, executionDelegation, parseBSDate, stitchDate } from "../Utils/common"
import CalenderController from "./components/CalenderController"
import { DayPicker } from "./components/DayPicker"

interface ICalenderProps {
    value: string | null
    events: NepaliDatepickerEvents
    formatOptions?: TDateFormatOptions<TDateSeparator>
}

const Calender: FunctionComponent<ICalenderProps> = ({ value, events, formatOptions = defaultFormatOptions }) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<ParsedDate | null>(null)
    const [calenderDate, setCalenderDate] = useState<ParsedDate>(parsedDateInitialValue)
    const { getConfig } = useConfig()

    const currentTheme = getConfig("theme")

    useEffect(() => {
        const parsedDateValue = value ? parseBSDate(value, formatOptions) : null

        if (parsedDateValue) {
            setSelectedDate(parsedDateValue)
            setCalenderDate(parsedDateValue)
        } else {
            // Set to current date if no valid value is provided
            const today = parseBSDate(ADToBS(new Date()), formatOptions)
            setCalenderDate(today)
            setSelectedDate(null)
        }
        setIsInitialized(true)
    }, [])

    useEffect(() => {
        if (isInitialized && selectedDate) {
            events.change(
                stitchDate(
                    {
                        year: selectedDate.bsYear,
                        month: selectedDate.bsMonth,
                        day: selectedDate.bsDay,
                    },
                    formatOptions,
                ),
            )
        }
    }, [selectedDate, formatOptions, isInitialized])

    const onPreviousMonthHandler = useCallback(() => {
        executionDelegation(
            () => {
                setCalenderDate((date) => {
                    let year = date.bsYear
                    let month = date.bsMonth - 1

                    if (month < 1) {
                        month = 12
                        year--
                    }
                    if (year < (getConfig("minYear") ?? 0) || year > (getConfig("maxYear") ?? 0)) {
                        return date
                    }

                    return parseBSDate(
                        stitchDate(
                            {
                                day: date.bsDay,
                                month,
                                year,
                            },
                            formatOptions,
                        ),
                        formatOptions,
                    )
                })
            },
            () => {
                if (events.previousMonthSelect) {
                    events.previousMonthSelect({ month: calenderDate.bsMonth, year: calenderDate.bsYear })
                }
            },
        )
    }, [formatOptions])

    const onNextMonthClickHandler = useCallback(() => {
        executionDelegation(
            () => {
                setCalenderDate((date) => {
                    let year = date.bsYear
                    let month = date.bsMonth + 1

                    if (month > 12) {
                        month = 1
                        year++
                    }

                    return parseBSDate(
                        stitchDate(
                            {
                                day: date.bsDay,
                                month,
                                year,
                            },
                            formatOptions,
                        ),
                        formatOptions,
                    )
                })
            },
            () => {
                if (events.nextMonthSelect) {
                    events.nextMonthSelect({ year: calenderDate.bsYear, month: calenderDate.bsMonth })
                }
            },
        )
    }, [formatOptions])

    const onTodayClickHandler = useCallback(() => {
        const today = parseBSDate(ADToBS(new Date()), formatOptions)

        executionDelegation(
            () => {
                setCalenderDate(today)
                setSelectedDate(today)
            },
            () => {
                if (events.todaySelect) {
                    events.todaySelect({ year: today.bsYear, month: today.bsMonth, day: today.bsDay })
                }
            },
        )
    }, [formatOptions])

    const onYearSelectHandler = useCallback(
        (year: number) => {
            executionDelegation(
                () => {
                    setCalenderDate(
                        parseBSDate(
                            stitchDate(
                                {
                                    year,
                                    month: calenderDate.bsMonth,
                                    day: calenderDate.bsDay,
                                },
                                formatOptions,
                            ),
                            formatOptions,
                        ),
                    )
                },
                () => {
                    if (events.yearSelect) {
                        events.yearSelect(year)
                    }
                },
            )
        },
        [calenderDate, formatOptions],
    )

    const onMonthSelectHandler = useCallback(
        (month: number) => {
            executionDelegation(
                () => {
                    setCalenderDate(
                        parseBSDate(
                            stitchDate(
                                {
                                    year: calenderDate.bsYear,
                                    month,
                                    day: calenderDate.bsDay,
                                },
                                formatOptions,
                            ),
                            formatOptions,
                        ),
                    )
                },
                () => {
                    if (events.monthSelect) {
                        events.monthSelect({ year: calenderDate.bsYear, month })
                    }
                },
            )
        },
        [calenderDate, formatOptions],
    )

    const onDaySelectHandler = useCallback((date: SplittedDate) => {
        executionDelegation(
            () => {
                const newDate = parseBSDate(stitchDate(date, formatOptions), formatOptions)

                setCalenderDate(newDate)
                setSelectedDate(newDate)
            },
            () => {
                if (events.daySelect) {
                    events.daySelect(date)
                }
            },
        )
    }, [])

    return (
        <div className={`calender ${currentTheme}`}>
            <div className='calendar-wrapper'>
                {isInitialized && (
                    <Fragment>
                        <CalenderController
                            onPreviousMonth={onPreviousMonthHandler}
                            onNextMonth={onNextMonthClickHandler}
                            calenderDate={calenderDate}
                            onToday={onTodayClickHandler}
                            onYearSelect={onYearSelectHandler}
                            onMonthSelect={onMonthSelectHandler}
                        />

                        <DayPicker
                            selectedDate={selectedDate}
                            calenderDate={calenderDate}
                            onDaySelect={onDaySelectHandler}
                        />
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default Calender
