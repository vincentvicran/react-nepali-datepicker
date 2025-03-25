import React, { FunctionComponent } from "react"
import { useConfig } from "../Config"
import { OptionType } from "./Types"

interface DropDownProps {
    options: OptionType[]
    value: number
    onSelect: (selected: OptionType) => void
}

const DropDown: FunctionComponent<DropDownProps> = ({ options, value, onSelect }) => {
    const { getConfig } = useConfig()

    const currentTheme = getConfig("theme")

    return (
        <div className='drop-down'>
            <div className={`option-wrapper ${currentTheme}`}>
                <ul>
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={option.value === value ? "active" : ""}
                            onClick={() => {
                                onSelect(option)
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DropDown
