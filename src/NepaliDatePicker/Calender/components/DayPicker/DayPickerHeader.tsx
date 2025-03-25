import React, { FunctionComponent, useMemo } from "react"
import { CalenderData, useConfig } from "../../../Config"
import { TLocaleType } from "../../../Types"

const DayPickerHeader: FunctionComponent = () => {
    const { getConfig } = useConfig()
    const currentLocale: TLocaleType = useMemo(() => getConfig("currentLocale"), [getConfig])

    const currentWeeksVal = CalenderData.weekDaysLabel[getConfig("weekDayLabelSize") ?? "sm"][currentLocale]

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
