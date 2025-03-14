import { ADToBS } from "bikram-sambat-js"
import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from "react"
import { useConfig } from "../Config"
import { NepaliDatepickerEvents, ParsedDate, parsedDateInitialValue, SplittedDate } from "../Types"
import { executionDelegation, parseBSDate, stitchDate } from "../Utils/common"
import CalenderController from "./components/CalenderController"
import { DayPicker } from "./components/DayPicker"

interface CalenderProps {
    value: string | null
    events: NepaliDatepickerEvents
}

const Calender: FunctionComponent<CalenderProps> = ({ value, events }) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<ParsedDate | null>(null)
    const [calenderDate, setCalenderDate] = useState<ParsedDate>(parsedDateInitialValue)
    const { getConfig } = useConfig()

    useEffect(() => {
        const parsedDateValue = value ? parseBSDate(value) : null

        if (parsedDateValue) {
            setSelectedDate(parsedDateValue)
            setCalenderDate(parsedDateValue)
        } else {
            // Set to current date if no valid value is provided
            const today = parseBSDate(ADToBS(new Date()))
            setCalenderDate(today)
            setSelectedDate(null)
        }
        setIsInitialized(true)
    }, [value])

    useEffect(() => {
        if (isInitialized && selectedDate) {
            events.change(
                stitchDate({
                    year: selectedDate.bsYear,
                    month: selectedDate.bsMonth,
                    day: selectedDate.bsDay,
                }),
            )
        }
    }, [selectedDate, isInitialized])

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
                    if (year < getConfig<number>("minYear") || year > getConfig<number>("maxYear")) {
                        return date
                    }

                    return parseBSDate(
                        stitchDate(
                            {
                                day: date.bsDay,
                                month,
                                year,
                            },
                            "-",
                        ),
                    )
                })
            },
            () => {
                if (events.previousMonthSelect) {
                    events.previousMonthSelect({ month: calenderDate.bsMonth, year: calenderDate.bsYear })
                }
            },
        )
    }, [])

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
                            "-",
                        ),
                    )
                })
            },
            () => {
                if (events.nextMonthSelect) {
                    events.nextMonthSelect({ year: calenderDate.bsYear, month: calenderDate.bsMonth })
                }
            },
        )
    }, [])

    const onTodayClickHandler = useCallback(() => {
        const today = parseBSDate(ADToBS(new Date()))

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
    }, [])

    const onYearSelectHandler = useCallback(
        (year: number) => {
            executionDelegation(
                () => {
                    setCalenderDate(
                        parseBSDate(
                            stitchDate({
                                year,
                                month: calenderDate.bsMonth,
                                day: calenderDate.bsDay,
                            }),
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
        [calenderDate],
    )

    const onMonthSelectHandler = useCallback(
        (month: number) => {
            executionDelegation(
                () => {
                    setCalenderDate(
                        parseBSDate(
                            stitchDate({
                                year: calenderDate.bsYear,
                                month,
                                day: calenderDate.bsDay,
                            }),
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
        [calenderDate],
    )

    const onDaySelectHandler = useCallback((date: SplittedDate) => {
        executionDelegation(
            () => {
                const newDate = parseBSDate(stitchDate(date))

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
        <div className='calender'>
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
