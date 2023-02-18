import Schema from 'async-validator'

const messages = {
  default: '%s 校验错误',
  required: '%s 必填',
  enum: '%s 必须是其中之一 %s',
  whitespace: '%s 不能为空',
  additional: '多余的字段 (%s) 存在 %s',
  date: {
    format: '%s 时间 %s 格式无效 %s',
    invalid: '%s 时间 %s 是无效的'
  },
  types: {
    string: '%s 不是一个 %s',
    null: '%s 不是 %s',
    function: '%s 不是一个 %s',
    instance: '%s 不是一个实例 %s',
    array: '%s 不是 %s',
    object: '%s 不是 %s',
    number: '%s 不是一个 %s',
    boolean: '%s 不是一个 %s',
    integer: '%s 不是 %s',
    float: '%s 不是一个 %s',
    regexp: '%s 不是有效的 %s',
    multiple: '%s 不是允许的类型之一 %s'
  },
  function: {
    len: '%s 必须准确有 %s 个参数',
    min: '%s 必须至少有 %s 个参数',
    max: '%s 不能超过 %s 个参数',
    range: '%s 必须有 %s 个 参数长度 %s and %s'
  },
  string: {
    len: '%s 必须准确到 %s 个字符',
    min: '%s 必须至少有 %s 个字符',
    max: '%s 不能超过 %s 个字符',
    range: '%s 必须是 %s 到 %s 个字符之间'
  },
  number: {
    len: '%s 必须平等 %s',
    min: '%s 不能少于 %s',
    max: '%s 不能大于 %s',
    range: '%s 必须是 %s 和 %s 之间的数字'
  },
  array: {
    len: '%s 必须是长度为 %s 的数组',
    min: '%s 的长度不能小于 %s',
    max: '%s 的长度不能大于 %s',
    range: '%s 的长度必须在 %s 和 %s 之间'
  },
  pattern: {
    mismatch: '%s 值 %s 与模式不匹配 %s'
  }
}

/**
 * 校验数据格式
 * @param {object} data 对象
 * @param {object} rules 规则
 * @param {object} options 选项
 *
 * @resolve { errors: [{ message: "a 不是一个 string", field: "a" }], fields: { a: [{ message: "a 不是一个 string", field: "a" }] } }
 */
const syncValidate = async function (data, rules, options) {
  return new Promise((resolve, reject) => {
    const validator = new Schema(rules)
    validator.messages(messages)
    return validator.validate(data || {}, options || {}, (errors, fields) => {
      return resolve({ errors, fields })
    })
  })
}

/**
 * 校验对象
 * @param {object} data 对象
 * @param {object} rules 规则
 * @param {object} options 选项
 *
 * @resolve { errors: [{ message: "a 不是一个 string", field: "a" }], fields: { a: [{ message: "a 不是一个 string", field: "a" }] } }
 */
const validate = async function (data, rules, options) {
  return syncValidate(data, rules, options).then(({ fields }) => fields)
}

/**
 * 校验对象
 * @param {object} data 对象
 * @param {object} rules 规则
 * @param {object} options 选项
 *
 * @resolve [{ message: "a 不是一个 string", field: "a" }]
 */
validate.errors = async function (data, rules, options) {
  return syncValidate(data, rules, options).then(({ errors }) => errors)
}

/**
 * 断言校验对象
 * @param {object} data 对象
 * @param {object} rules 规则
 * @param {object} options 选项
 *
 * @resolve null
 * @reject Error
 */
validate.assert = async function (data, rules, options) {
  return syncValidate(data, rules, {
    ...options,
    first: true
  }).then(({ errors }) => {
    if (!errors || !errors.length) return null
    if (errors && errors[0]) throw new Error(errors[0].message || '校验出错！')
    throw errors
  })
}

validate.Schema = Schema

export default validate

// export const regexps = {
//   // 登录名
//   loginName: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]{2,}$/,
//   // 真实姓名
//   realName: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]{2,}$/,
//   // 手机号
//   mobile: /^1\d{10}$/,
//   // 邮箱
//   email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// }

// ======================================================================
// ======================================================================

// 外链
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
// 邮箱
export function isEmail (str) {
  const reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/
  return reg.test(str)
}
// 手机号验证
export function isPhone (str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}
// 手机号验证2
export function isPhoneTwo (str) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(str)
}
// 固话验证2
export function isTelPhone (str) {
  const reg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  return reg.test(str)
}
// 验证密码 密码，以字母开头，长度在8~18之间，只能包含字母、数字和下划线
export function isPassword (value) {
  const errors = validate.errors({ value }, {
    value: [
      { type: 'string', required: true, message: '请输入登录密码' },
      { type: 'string', min: 6, max: 20, message: '登录密码必须为6到20位' },
      { type: 'string', pattern: /^[a-zA-Z0-9-_+()*&^%$#@!~?><=/.]+$/, message: '有效字符包含：数字 字母 特殊字符（- _ + ( ) * & ^ % $ # @ ! ~ ? > < = / .）' },
      { type: 'string', pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/, message: '登录密码必须是由字母/数字/特殊字符其中2种组合' }
    ]
  })
  return !errors || !errors.length
}

// 验证用户名 用户名要求 数字、字母、下划线的组合，其中数字和字母必须同时存在*
export function isUsername (str) {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]{2,}$/
  return reg.test(str)
}
