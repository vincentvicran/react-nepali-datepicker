import React, { FunctionComponent, useReducer } from "react"
import { IContextProviderProps } from "../Types"
import ConfigContext from "./ConfigContext"
import ConfigStoreReducer from "./ConfigStoreReducer"

const ConfigProvider: FunctionComponent<IContextProviderProps> = ({
    children,
    minYear,
    maxYear,
    theme,
    weekDayLabelSize,
    formatOptions,
    currentLocale,
}) => {
    const [state, dispatch] = useReducer(ConfigStoreReducer, {
        minYear,
        maxYear,
        theme,
        weekDayLabelSize,
        formatOptions,
        currentLocale,
    })
    const contextValue = { state, dispatch }

    return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>
}

export default ConfigProvider
