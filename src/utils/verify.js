export const isChinaPhone = function(phone) {
  return /^1[3456789]\d{9}$/.test(phone)
}

export const isHKPhone = function(phone) {
  return /^(5|6|9)\d{7}$$/.test(phone)
}

export const isEmail = function(email) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)
}

export const isIdCard = function(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}
