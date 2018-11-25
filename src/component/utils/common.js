export const converTimeToSecs = (momentTime) => {
    const time = momentTime.format('hh:mm:ss').split(':')
    const hours = parseInt(time[0])
    const minutes = parseInt(time[1])
    const seconds = parseInt(time[2])
    const hoursInSec = hours * 60 * 60
    const minutesInSec = minutes * 60
    return hoursInSec + minutesInSec + seconds
}

export const objToQueryParam = (obj = {}) => Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')


export const getCurrentParam = () => {
    var params = {}
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) =>{
        const intVal = parseInt(value)
        params[key] = isNaN(intVal) ? value : intVal
    })

    return params
}

export const shuffleArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [a[i], a[j]] = [a[j], a[i]]
    }

    return a
}
