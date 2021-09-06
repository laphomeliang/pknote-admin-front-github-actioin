const fs = require('fs')
const core = require('@actions/core')
const translate = require('deepl')
const randomString = require('random-string');
const isConnect = (txt, newObj, tempObj) => {
    const { index: nIndex, txt: nTxt } = newObj
    const { index: tIndex, txt: tTxt } = tempObj
    const inTxt = txt.substring(tIndex + tTxt.length, nIndex)
    let connected = false
    const regRN = /\r\n/g
    if (!inTxt || !regRN.test(inTxt)) {
        if (inTxt.length < 3) {
            connected = true
        }
    }
    return connected
}
// circle send deep api
const promiseCircle = async (txts, key) => {
    const ENlang = {}
    const ZHlang = {}
    const failTxts = []
    const results = await Promise.allSettled(txts.map((txt) => translationTxt(txt, key)))
    results.forEach(({ status, value}, i) => {
        core.info(status)
        if (status === 'fulfilled') {
            const { data } = value
            const enLang = data.translations[0].text
            const enLangArr = enLang.split(/\s/).map((s, index) => {
                let str = s.replace(',', '')
                if (index > 0) {
                    str = str.charAt(0).toUpperCase() + str.slice(1)
                }
                return str
            })
            let key = enLangArr.reduce(function(defaultS, s) {
                return defaultS += s
            }, '')
            if (ENlang.hasOwnProperty(key)) {
                const x = randomString({
                    length: 8,
                    numeric: true,
                    letters: true,
                    special: false
                })
                key += x
            }
            ENlang[key] = enLang
            ZHlang[key] = txts[i]
        } else {
            failTxts.push(txts[i])
        }
    })
    return {
        ENlang,
        ZHlang,
        failTxts
    }
}
// deep api
const translationTxt = (txt, auth_key) => {
    return translate({
        auth_key,
        text: txt,
        free_api: true,
        source_lang: 'ZH',
        target_lang: 'EN'
    })
}
const func = {
    // get file text content
    readFile(path) {
        return fs.readFileSync(path, 'utf8')
    },
    // get Chinese content in file text
    getChinese(fileTxt) {
        const reg = new RegExp('[\u4e00-\u9fa5]+', 'g')
        return fileTxt.match(reg)
    },
    // rebuild file text
    rebuildTxts(txt, txts) {
        const that = this
        const newTxts = []
        const newTxt = ''
        let txtIndex = 0
        let tempTxt = ''
        // core.info('txts')
        // core.info(txts)
        const txtslen = txts.length
        for (let i = 0; i < txtslen; i++) {
            const s = txts[i]
            const tIndex = txt.indexOf(s, txtIndex)
            const newTxtslen = newTxts.length
            let newObj = {
                index: tIndex,
                txt: s
            }
            if (newTxtslen) {
                const tempObj = newTxts[newTxtslen - 1]
                const connected = isConnect(txt, newObj, tempObj)
                if (connected) {
                    tempObj.txt = txt.substring(tempObj.index, tIndex + s.length)
                } else {
                    newTxts.push(newObj)
                }
            } else {
                newTxts.push(newObj)
            }
            txtIndex = tIndex + s.length
        }
        return newTxts
    },
    // is connect text
    isConnect(txt, newObj, tempObj) {
        const { index: nIndex, txt: nTxt } = newObj
        const { index: tIndex, txt: tTxt } = tempObj
        const inTxt = txt.substring(tIndex + tTxt.length, nIndex)
        let connected = false
        const regRN = /\r\n/g
        if (!regRN.test(inTxt)) {
            if (inTxt.length < 3) {
                connected = true
            }
        }
        return connected
    },
    // remove Duplicates
    removeDuplicates(txts) {
        const flatArr = txts.flat()
        return [...new Set(flatArr)]
    },
    // discard existing words
    discardExistWords(array, obj) {
        const exisArr = Object.values(obj)
        for (let index = 0; index < array.length; index++) {
            const word = array[index];
            if (exisArr.includes(word)) {
                array.splice(index, 1)
                index--
            }
        }
        return array
    },
    // translate word
    async translation(txts, keys) {
        let ENlang = {}
        let ZHlang = {}
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index]
            const res = await promiseCircle(txts, key)
            ENlang = { ...ENlang, ...res.ENlang }
            ZHlang = { ...ZHlang, ...res.ZHlang }
            if (!res.failTxts.length) {
                break
            }
            txts = res.failTxts
        }
        return {
            ENlang,
            ZHlang
        }
    },
    // circle send deep api
    async promiseCircle(txts, key) {
        const ENlang = {}
        const ZHlang = {}
        const failTxts = []
        const results = await Promise.allSettled(txts.map(({ txt }) => translationTxt(txt, key)))
        results.forEach(({ status, value}, i) => {
            if (status === 'fulfilled') {
                const { data } = value
                const enLang = data.translations[0].text
                const enLangArr = enLang.split(/\s/).map((s, index) => {
                    let str = s.replace(',', '')
                    if (index > 0) {
                        str = str.charAt(0).toUpperCase() + str.slice(1)
                    }
                    return str
                })
                const key = enLangArr.reduce(function(defaultS, s) {
                    return defaultS += s
                }, '')
                
                ENlang[key] = enLang
                ZHlang[key] = txts[i].txt
            } else {
                failTxts.push(txts[i])
            }
        })
        return {
            ENlang,
            ZHlang,
            failTxts
        }
    },
    // deep api
    translationTxt(txt, auth_key) {
        return translate({
            auth_key,
            text: txt,
            free_api: true,
            source_lang: 'ZH',
            target_lang: 'EN'
        })
    },
    // replace word
    replaceTxt(str, texts, ZHlang, ENlang, isKey) {
        const keys = Object.keys(ZHlang);
        texts.forEach((txt) => {
            const key = keys.find(k => ZHlang[k] === txt);
            const repalceWord = isKey ? `$t.${ key }` : ENlang[key]
            str = str.replace(txt, (' ' + repalceWord + ' '))
        })
        return str
    }
}

module.exports = func