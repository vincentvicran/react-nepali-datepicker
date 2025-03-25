import { NEPALI } from "../Types"
import { defaultFormatOptions } from "../Utils"
import CalenderConfig from "./CalenderConfig"
import { ConfigAction, ConfigState, SET_CONFIG } from "./ConfigTypes"

export const initialState: ConfigState = {
    currentLocale: NEPALI,
    minYear: CalenderConfig.minBSYear,
    maxYear: CalenderConfig.maxBSYear,
    theme: "light",
    weekDayLabelSize: "sm",
    formatOptions: defaultFormatOptions,
}

const ConfigReducer = (state: ConfigState = initialState, action: ConfigAction): ConfigState => {
    if (action.type === SET_CONFIG) {
        return { ...state, [action.key]: action.value }
    }

    return state
}

export default ConfigReducer
