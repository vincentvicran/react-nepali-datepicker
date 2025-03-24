import React, { FunctionComponent, useMemo } from "react"
import { CalenderData, useConfig } from "../../../Config"
import { TLocaleType, WeekDayLabelSize } from "../../../Types"

const DayPickerHeader: FunctionComponent = () => {
    const { getConfig } = useConfig()
    const currentLocale: TLocaleType = useMemo(() => getConfig("currentLocale"), [getConfig])

    const currentWeeksVal =
        getConfig<WeekDayLabelSize>("weekDayLabelSize") === "md"
            ? CalenderData.weeksAbbr[currentLocale]
            : getConfig<WeekDayLabelSize>("weekDayLabelSize") === "sm"
            ? CalenderData.weeks[currentLocale]
            : CalenderData.weeksLarge[currentLocale]

    return (
        <thead>
            <tr>
                {currentWeeksVal.map((weekDay: string, index: number) => (
                    <td key={index}>{weekDay}</td>
                ))}
            </tr>
        </thead>
    )
}

export default DayPickerHeader
