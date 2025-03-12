import React, { FunctionComponent, useMemo } from "react"
import { CalenderData, useConfig } from "../../../Config"
import { localeType } from "../../../Types"

const DayPickerHeader: FunctionComponent = () => {
    const { getConfig } = useConfig()
    const currentLocale: localeType = useMemo(() => getConfig("currentLocale"), [getConfig])

    return (
        <thead>
            <tr>
                {CalenderData.weeks[currentLocale].map((weekDay: string, index: number) => (
                    <td key={index}>{weekDay}</td>
                ))}
            </tr>
        </thead>
    )
}

export default DayPickerHeader
