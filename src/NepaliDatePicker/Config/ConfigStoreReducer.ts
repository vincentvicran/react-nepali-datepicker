import { NEPALI, Themes, WeekDayLabelSize } from "../Types"
import { ConfigAction, ConfigState, SET_CONFIG } from "./ConfigTypes"

export const initialState = (
    minYear?: number,
    maxYear?: number,
    theme?: Themes,
    weekDayLabelSize?: WeekDayLabelSize,
): ConfigState => {
    return {
        currentLocale: NEPALI,
        minYear: minYear ?? 2000,
        maxYear: maxYear ?? 2100,
        theme: theme ?? "light",
        weekDayLabelSize: weekDayLabelSize ?? "sm",
    }
}

const ConfigReducer = (state: ConfigState = initialState(), action: ConfigAction): ConfigState => {
    if (action.type === SET_CONFIG) {
        return { ...state, [action.key]: action.value }
    }

    return state
}

export default ConfigReducer
