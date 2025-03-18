import React, { FunctionComponent, useReducer } from "react"
import ConfigContext from "./ConfigContext"
import ConfigStoreReducer, { initialState } from "./ConfigStoreReducer"
import { IContextProviderProps } from "../Types"

const ConfigProvider: FunctionComponent<IContextProviderProps> = ({
    children,
    minYear,
    maxYear,
    theme,
    weekDayLabelSize,
}) => {
    const [state, dispatch] = useReducer(ConfigStoreReducer, initialState(minYear, maxYear, theme, weekDayLabelSize))
    const contextValue = { state, dispatch, theme, weekDayLabelSize }

    return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>
}

export default ConfigProvider
