import { createContext } from "react"
import { initialState } from "./ConfigStoreReducer"
import { ConfigAction, ConfigState } from "./ConfigTypes"
import { Themes, WeekDayLabelSize } from "../Types"

const ConfigContext = createContext<{
    dispatch: (action: ConfigAction) => void
    state: ConfigState
    theme?: Themes
    weekDayLabelSize?: WeekDayLabelSize
}>({
    dispatch: () => null,
    state: initialState(),
    theme: "light",
    weekDayLabelSize: "sm",
})

export default ConfigContext
