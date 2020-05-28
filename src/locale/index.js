import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import ko from './ko'
import el from './el'

Vue.use(VueI18n)

const lang = localStorage.getItem('lan') || 'en_US'

export const i18n = new VueI18n({
  locale: lang,
  messages: {
    zh_CN: {
      ...zh
    },
    en_US: {
      ...en
    },
    ko_KR: {
      ...ko
    },
    el_GR: {
      ...el
    }
  }
})

export function changeLanguage (lang) {
  i18n.locale = lang
  localStorage.setItem('lan', lang)
}
