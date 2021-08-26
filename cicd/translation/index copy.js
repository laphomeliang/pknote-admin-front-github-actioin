const fs = require('fs')
const translate = require('deepl')
const { auth_key } = require('./config/config')
const ENlang = {}
const ZHlang = {}
try {
    const txtpath = './index.vue'
    const txt = readFile(txtpath)
    const txts = getChinese(txt)
    const newTxts = rebuildTxts(txt, txts)
    translation(newTxts).then(() => {
        replaceTxt(txt, newTxts)
    })
} catch(err) {
    console.log(err)
}
// 读取文件
function readFile(path) {
    return fs.readFileSync(path, 'utf8')
}
// 获取中文
function getChinese(fileTxt) {
    const reg = new RegExp('[\u4e00-\u9fa5]+', 'g')
    return fileTxt.match(reg)
}
// 重构文本
function rebuildTxts(txt, txts) {
    const newTxts = []
    const newTxt = ''
    let txtIndex = 0
    let tempTxt = ''
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
}
// 判断词语是否连接
function isConnect(txt, newObj, tempObj) {
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
}
// 翻译
async function translation(txts) {
    const results = await Promise.allSettled(txts.map(({ txt }) => translationTxt(txt)))
    results.forEach(({ status, value}, i) => {
        if (status === 'fulfilled') {
            const { data } = value
            const enLang = data.translations[0].text
            enLangArr = enLang.split(/\s/).map((s, index) => {
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
        }
    })
}
// deepl api
function translationTxt(txt) {
    return translate({
        free_api: true,
        text: txt,
        source_lang: 'ZH',
        target_lang: 'EN',
        auth_key
    })
}
// 替换翻译
function replaceTxt(str, texts) {
    const keys = Object.keys(ZHlang);
    texts.forEach(({ txt }) => {
        const key = keys.find(k => ZHlang[k] === txt);
        str = str.replace(txt, (' ' + ENlang[key] + ' '))
    })
    console.log(str);
}