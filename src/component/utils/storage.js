/* eslint-disable */

export const getFromStorage = ({ key, defaultValue, callback }) => {
    let out = defaultValue
    if ( typeof window !== 'undefined' ) {
        const itemExist = window.localStorage.getItem(key)
        if (itemExist && itemExist !== 'undefined') {
            if (typeof itemExist === 'string' || typeof itemExist === 'number') {
                out = itemExist
            } else {
                out = JSON.parse(itemExist)
            }
        } else {
            window.localStorage.setItem(key, JSON.stringify(defaultValue))
        }
    } else {
        out =  defaultValue
    }

    if ( typeof callback === 'function' ) {
        callback(out)
    } else {
        return out
    }
}

export const save = ({ key, value }) =>  {
    if (typeof window !== 'underfined') {
        var newVal = deepCopy(value)
        window.localStorage.setItem(key, JSON.stringify(newVal))
    }

}

export const deepCopy = (target) => JSON.parse(JSON.stringify(target))
