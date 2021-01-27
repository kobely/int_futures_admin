export const DOM_TITLE = '高盈金融后台管理系统'

export const FILE_URL = 'https://futures-oss-test.1quant.com.cn'

// 国家/地区
export const COUNTRY = ['中国内地', '中国香港', '台湾', '美国']

// 证件类型
export const ID_TYPE = ['身份证', '护照', '驾驶证', '州身份证']

// 身份核验方式
export const VERIFY_TYPE = ['人脸核身', '人脸比对', '人工核查']

// 审核状态
export const VERIFY_STATUS = ['待校验', '不通过', '通过']

// 平台
export const PLATFORM_STYLE = {
  1: '金融后台'
}

// 教育就业情况
export const JOB_AGE = ['不满一年', '1~3年', '3年以上']
export const EDC_WORK_LIST = [
  {
    label: '教育',
    value: '',
    options: [
      {
        value: 1,
        text: '小学'
      },
      {
        value: 2,
        text: '中学'
      },
      {
        value: 3,
        text: '大学'
      },
      {
        value: 4,
        text: '硕士及以上'
      }
    ]
  },
  {
    label: '就业情况',
    value: '',
    options: [
      {
        value: 1,
        text: '受雇'
      },
      {
        value: 2,
        text: '自雇'
      },
      {
        value: 3,
        text: '退休'
      },
      {
        value: 4,
        text: '学生'
      },
      {
        value: 5,
        text: '其他'
      }
    ]
  }
]
