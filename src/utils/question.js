// 调查问卷
export const questionnaire = [
  {
    id: 1,
    title: '您的年龄介乎于？',
    isMust: true,
    choices: [
      {
        text: '(a) 18 ~ 35 周岁之间',
        name: 'a'
      },
      {
        text: '(b) 36 ~ 44 周岁之间',
        name: 'b'
      },
      {
        text: '(c) 44 ~ 55 周岁之间',
        name: 'c'
      },
      {
        text: '(d) 55 ~ 65 周岁之间',
        name: 'd'
      },
      {
        text: '(e) >65 周岁',
        name: 'e'
      }
    ]
  },
  {
    id: 2,
    title: '您的教育程度是？',
    isMust: true,
    choices: [
      {
        text: '(a) 小学程度',
        name: 'a'
      },
      {
        text: '(b) 中学程度',
        name: 'b'
      },
      {
        text: '(c) 预科或大专程度',
        name: 'c'
      },
      {
        text: '(d) 大学及以上',
        name: 'd'
      }
    ]
  },
  {
    id: 3,
    title: '您是否有以下任何产品的投资经验或知识？（可多选）？',
    isMust: true,
    isCheck: true,
    ref: 'checkBoxRef1',
    choices: [
      {
        text: '(a) 现金、存款、存款证、保本产品、香港政府债券、强积金、货币市场基金。',
        name: 'a'
      },
      {
        text: '(b) 股票、债券、股票或债券基金(包括强积金，不包括货币市场基金)、投资相连保单。',
        name: 'b'
      },
      {
        text: '(c) 衍生工具（如：期权、期货、认股权证(俗称「窝轮」))、对冲基金、结构性产品（如：累计认购期权、股票挂钩票据）',
        name: 'c'
      }
    ]
  },
  {
    id: 4,
    title:
      '您有无投资以下价值波动类型的投资产品(包括外币商品、结构投资产品、认股权证(俗称「窝轮」)、期权、期货)的经验，例如购入后长期持有或经常买卖上述投资产品？',
    isMust: true,
    choices: [
      {
        text: '(a) 没有经验',
        name: 'a'
      },
      {
        text: '(b) 少于1年',
        name: 'b'
      },
      {
        text: '(c) 1至3年',
        name: 'c'
      },
      {
        text: '(d) 超过3年',
        name: 'd'
      }
    ]
  },
  {
    id: 5,
    title: '您有无投资以下价值波动类型的投资产品(包括股票、 单位信托基金、债券、投资相连保单等)的经验，例如购入后长期持有或经常买卖上述投资产品？',
    isMust: true,
    choices: [
      {
        text: '(a) 没有经验',
        name: 'a'
      },
      {
        text: '(b) 少于1年',
        name: 'b'
      },
      {
        text: '(c) 1至3年',
        name: 'c'
      },
      {
        text: '(d) 超过3年',
        name: 'd'
      }
    ]
  },
  {
    id: 6,
    preTitle:
      '在一段时间之内，投资价值可升可跌，我们称之为波动。一般而言，风险愈高的投资，其潜在波动愈大，但潜在回报亦愈高。相反，风险愈低的投资，其潜在波动愈小，但潜在回报亦相对较低。',
    title: '在一般情况下，您会愿意投资于波动程度多大的投资产品？',
    isMust: true,
    choices: [
      {
        text: '(a) 波动超过 -30% 到 +30%',
        name: 'a'
      },
      {
        text: '(b) 波动在 -25% 到 +25%之间',
        name: 'b'
      },
      {
        text: '(c) 波动在 -15% 到 +15%之间',
        name: 'c'
      },
      {
        text: '(d) 波动在 -5% 到 +5%之间',
        name: 'd'
      }
    ]
  },
  {
    id: 7,
    title: '用作于高盈国际投资的资金将会占到您流动资金净值（不包括自住物业）比例有多大？',
    isMust: true,
    choices: [
      {
        text: '(a) 少于10%',
        name: 'a'
      },
      {
        text: '(b) 10% ~ 40%',
        name: 'b'
      },
      {
        text: '(c) 40% ~ 60%',
        name: 'c'
      },
      {
        text: '(d) 60%以上',
        name: 'd'
      }
    ]
  },
  {
    id: 8,
    title: '假如发生突发事件，需要流动资金，您打算将多少投资项目变现？',
    isMust: true,
    choices: [
      {
        text: '(a) 我不一定会出售任何投资',
        name: 'a'
      },
      {
        text: '(b) 我会出售不多于30%的投资',
        name: 'b'
      },
      {
        text: '(c) 我会出售多于30%但不超过50%的投资',
        name: 'c'
      },
      {
        text: '(d) 我会出售50%以上的投资',
        name: 'd'
      }
    ]
  },
  {
    id: 9,
    preTitle: '在一般情况下，投资的年期越长，可承受的风险越高，而投资产品的价值亦会波动。',
    title: '当投资于产品时，您会愿意接受下列哪项投资年期？',
    posTitle: '有关投资产品的例子，请参阅问题3',
    isMust: true,
    choices: [
      {
        text: '(a) 多过5年',
        name: 'a'
      },
      {
        text: '(b) 3年至5年',
        name: 'b'
      },
      {
        text: '(c) 1年至3年',
        name: 'c'
      },
      {
        text: '(d) 少于1年',
        name: 'd'
      }
    ]
  },
  {
    id: 10,
    title: '以下哪项描述最适合形容您的投资目标？',
    isMust: true,
    choices: [
      {
        text: '(a) 防守型。希望保障我的资本及获得稍微高于存款的投资回报。我可承受低程度的资本损失。',
        name: 'a'
      },
      {
        text: '(b) 收入型。希望定期收入及资本增长之间取得平衡，并可承受中等程度的资本损失。',
        name: 'b'
      },
      {
        text: '(c) 资本增值型。我以长线资本增值为目标，并可承受大额度的资本损失。',
        name: 'c'
      },
      {
        text: '(d) 进取型。我只寻求资本增值，同时可承受大幅度的资本价格波动。我愿意为了高回报而冒较高风险。',
        name: 'd'
      }
    ]
  }
]

// 适当性调查
export const survery = {
  investTarget: [
    {
      title: '投资目标（可多选）',
      type: 'checkbox',
      options: [
        {
          value: 1,
          label: '赚取收入'
        },
        {
          value: 2,
          label: '资本增长'
        },
        {
          value: 3,
          label: '对冲'
        },
        {
          value: 4,
          label: '投机'
        },
        {
          value: 5,
          label: '其他',
          placeholder: '请填写其他投资目标'
        }
      ]
    }
  ],
  derivative: [
    {
      value: '',
      options: [
        {
          name: 0,
          label: '本人了解衍生产品的性质和风险',
          children: [
            {
              type: 'checkbox',
              label: '1、已接受有关的培训或课程（可多选）',
              value: [],
              options: [
                {
                  name: 0,
                  label: '监管机构'
                },
                {
                  name: 1,
                  label: '交易所'
                },
                {
                  name: 2,
                  label: '大专院校'
                },
                {
                  name: 3,
                  label: '进修学院'
                },
                {
                  name: 4,
                  label: '金融机构'
                }
              ]
            },
            {
              type: 'checkbox',
              label: '2、于经济公司或银行、基金或资产管理公司、监管机构 或交易所等金融机构有关的工作经验（可多选）',
              value: [],
              options: [
                {
                  name: 0,
                  label: '受监管持牌人士'
                },
                {
                  name: 1,
                  label: '管理层'
                },
                {
                  name: 2,
                  label: '与衍生工具相关活动'
                }
              ]
            },
            {
              label: '3、在过去三年曾执行过五次或以上有关任何衍生产品 (不论是否在交易所买卖)的交易',
              value: '',
              options: [
                {
                  name: 0,
                  label: '是'
                },
                {
                  name: 1,
                  label: '否'
                }
              ]
            }
          ]
        },
        {
          name: 1,
          label: '本人对衍生产品不了解'
        }
      ]
    }
  ],
  investmentExp: [
    {
      label: '股票',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '牛熊证/窝轮',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '期货/期权',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '杠杆式外汇',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '单位信托基金或债券',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '结构性产品',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    },
    {
      label: '其他金融产品',
      placeholder: '请填写其他金融产品名称',
      options: [
        {
          text: '没有经验',
          value: 1
        },
        {
          text: '少于一年',
          value: 2
        },
        {
          text: '一至三年',
          value: 3
        },
        {
          text: '三至五年',
          value: 4
        },
        {
          text: '五年以上',
          value: 5
        }
      ]
    }
  ],
  financialSituation: [
    {
      type: 'select',
      label: '流动资产（港币）',
      options: [
        {
          text: '10万以下',
          value: 1
        },
        {
          text: '10万~50万',
          value: 2
        },
        {
          text: '50万~100万',
          value: 3
        },
        {
          text: '100万~500万',
          value: 4
        },
        {
          text: '500万~1000万',
          value: 5
        },
        {
          text: '1000万以上',
          value: 6
        }
      ]
    },
    {
      type: 'select',
      label: '资产净值（港币）',
      options: [
        {
          text: '10万以下',
          value: 1
        },
        {
          text: '10万~50万',
          value: 2
        },
        {
          text: '50万~100万',
          value: 3
        },
        {
          text: '100万~500万',
          value: 4
        },
        {
          text: '500万~1000万',
          value: 5
        },
        {
          text: '1000万以上',
          value: 6
        }
      ]
    },
    {
      type: 'select',
      label: '年薪（港币）',
      options: [
        {
          text: '10万以下',
          value: 1
        },
        {
          text: '10万~20万',
          value: 2
        },
        {
          text: '20万~50万',
          value: 3
        },
        {
          text: '50万~100万',
          value: 4
        },
        {
          text: '100万以上',
          value: 5
        }
      ]
    },
    {
      type: 'inputCheckbox',
      label: '资金来源（可多选）',
      options: [
        {
          text: '薪金储蓄',
          value: 1
        },
        {
          text: '家庭',
          value: 2
        },
        {
          text: '营业盈利',
          value: 3
        },
        {
          text: '租金收入',
          value: 4
        },
        {
          text: '金融机构贷款',
          value: 5
        },
        {
          text: '其他',
          value: 6,
          inputValue: '',
          isChecked: false,
          placeholder: '请填写其他资金来源'
        }
      ]
    },
    {
      type: 'multiSelect',
      label: '住宅业权（按实际情况选择）',
      options: [
        {
          text: '拥有',
          value: 1,
          children: {
            value: '',
            options: [
              {
                value: 1,
                label: '已抵押'
              },
              {
                value: 2,
                label: '未抵押'
              }
            ]
          }
        },
        {
          text: '没有',
          value: 2,
          children: {
            value: '',
            options: [
              {
                value: 1,
                label: '租住'
              },
              {
                value: 2,
                label: '与家人同住'
              }
            ]
          }
        }
      ]
    }
  ]
}

// 个人声明
export const statement = [
  {
    label: '本人是该账户之最终受益人'
  },
  {
    label: '您是否与高盈国际(香港)金融集团有限公司(高盈国际)或联系人士的职员或代理人有亲戚关系？',
    level_two_title: '职员/代理人名称：',
    level_two_relation: '关系：',
    placeholder: '请输入',
    width: 355
  },
  {
    label: '您是否是证券/期货交易所参与者的雇员或代理人，或于证监会注册的持牌法团/注册机构？',
    // level_two_title: '相关参与者或注册人的姓名是：',
    level_two_relation: '阁下的牌照编号：',
    placeholder: '请输入',
    width: 355
  },
  {
    label: '本人是否为美国公民或税务目的地为美国的居民'
  },
  {
    label: '您的配偶是否在高盈国际(香港)金融集团有限公司开设过任何帐户? 如是，户口号码是：',
    level_two_title: '配偶账户ID：',
    placeholder: '请输入',
    width: 355
  }
]
