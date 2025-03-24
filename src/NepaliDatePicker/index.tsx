import React, { useMemo } from "react"
import "../NepaliDatePicker.scss"
import { ConfigProvider } from "./Config"
import NepaliDatePicker from "./NepaliDatePicker"
import { ENGLISH, NEPALI, TDateSeparator, TNepaliDatePicker } from "./Types"

const NepaliDatePickerWrapper = <GDateSeparator extends TDateSeparator>(props: TNepaliDatePicker<GDateSeparator>) => {
    const calenderOptions = useMemo(
        () => ({
            closeOnSelect: true,
            calenderLocale: NEPALI,
            valueLocale: ENGLISH,
            ...props.options,
        }),
        [props.options],
    )

    return (
        <ConfigProvider
            maxYear={props.maxYear}
            minYear={props.minYear}
            theme={props.theme}
            weekDayLabelSize={props.weekDayLabelSize}
        >
            <NepaliDatePicker
                {...{
                    ...props,
                    options: calenderOptions,
                    formatOptions: {
                        separator: "-",
                        format: "YYYY-MM-DD",
                        ...props.formatOptions,
                    },
                }}
            />
        </ConfigProvider>
    )
}

export * from "bikram-sambat-js"
export * from "./Types"
export * from "./Utils"

export default NepaliDatePickerWrapper
