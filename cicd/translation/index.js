const fs = require('fs')
const core = require('@actions/core')
const { readFile, getChinese, rebuildTxts, removeDuplicates, discardExistWords, replaceTxt } = require('./uils')
const { auth_keys, lang_dir, lang_en, lang_zh } = require('./config/config')
let ENlang = getExitLang(`../../${ lang_dir }/${ lang_en }`) || {}
let ZHlang = getExitLang(`../../${ lang_dir }/${ lang_zh }`) || {}
// get exit word
function getExitLang(path) {
    try {
        const str = fs.readFileSync(path, { encoding: 'utf-8' })
        const sindex = str.indexOf('commonLang:')
        const lindex = str.indexOf('}', sindex)
        let langStr = str.substring(sindex + 11, lindex + 1).replace(/\s+/g, '').replace(/\'/g, '"')
        const dindex = langStr.length - 2
        if (langStr[dindex] === ',') langStr = langStr.substring(0, dindex) + '}'
        return JSON.parse(langStr)
    } catch (error) {
        return {}
    }
}
class Translater {
    constructor(paths) {
        this.paths = paths
        this.initTranslater()
    }
    initTranslater() {
        const paths = this.paths
        this.fileTxts = paths.map(path => readFile(path))
        core.info('paths')
        core.info(JSON.stringify(this.fileTxts))
        this.ChineseTxts = this.fileTxts.map(txt => getChinese(txt))
        const isHasChinese = this.ChineseTxts.find(txts => txts && txts.length)
        if (!isHasChinese) {
            core.info('no Chinese file')
            return
        }
        return
        this.rebuildTxts = this.fileTxts.map((txt, i) => {
            const ChineseTxt = this.ChineseTxts[i]
            core.info(ChineseTxt)
            return rebuildTxts(txt, ChineseTxt)
        })
        const ChineseArr = removeDuplicates(this.ChineseTxts).sort((a, b) => a.length - b.length)
        discardExistWords(ChineseArr, ZHlang)
        console.log(ChineseArr)
        const res = translation(ChineseArr, auth_keys)
        ENlang = { ...ENlang, ...res.ENlang }
        ZHlang = { ...ZHlang, ...res.ZHlang }
        this.repalceTxts = this.fileTxts.map((str, i) => {
            const texts = this.ChineseTxts[i]
            return replaceTxt(str, texts, ZHlang, ENlang)
        })
        const clonePath = `../../${ process.env.GIT_CLONE_PATH }/`
        const langPath = `${ clonePath }${ lang_dir }/`
        const enStr = 'export default {commonLang:'  + JSON.stringify(ENlang) + '};'
        const zhStr = 'export default {commonLang:'  + JSON.stringify(ZHlang) + '};'
        fs.writeFileSync(langPath + lang_en, enStr, 'utf8')
        fs.writeFileSync(langPath + lang_zh, zhStr, 'utf8')
        this.repalceTxts.forEach((txt, i) => {
            const path = paths[i]
            fs.writeFileSync(clonePath + path, txt, 'utf8')
        })
    }
}

module.exports = Translater
