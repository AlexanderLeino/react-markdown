import {useState, useEffect} from 'react'
export function useLocalStorage<T>(key: string, iniitialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key)
        if(jsonValue == null) {
            if(typeof iniitialValue === 'function'){
                return (iniitialValue as () => T)
            } else {
                return iniitialValue
            }

        } else {
            return JSON.parse(jsonValue)
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue] as [T, typeof setValue]
}