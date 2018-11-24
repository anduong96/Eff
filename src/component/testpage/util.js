const imgReg = /img\[.*?\]/g

export const compileQuestion = (data) => {
    if (data instanceof Array) {
        data = data.join('<br/>')
    }

    return data
}

export const compileImg = (data) => {
    if (data) {
        const found = data.match(imgReg)
        if (found) {
            const newFound = found.map(v => `<img src=${v.substring(4, v.length - 1)} />`)
            newFound.forEach((item, index) => {
                data = data.replace(found[index], item)
            })
        }
    }

    return data
}



