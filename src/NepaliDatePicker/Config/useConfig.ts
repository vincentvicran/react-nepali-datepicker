import { useContext } from "react"
import ConfigContext from "./ConfigContext"
import { ConfigState, ConfigValue, SET_CONFIG } from "./ConfigTypes"

const useConfig = () => {
    const { state, dispatch } = useContext(ConfigContext)

    function setConfig(key: keyof ConfigState, value: ConfigValue) {
        dispatch({
            key,
            type: SET_CONFIG,
            value,
        })
    }

    function getConfig<T extends keyof ConfigState>(key: T): ConfigState[T] {
        return state[key] as ConfigState[T]
    }
    return { setConfig, getConfig }
}

export default useConfig
