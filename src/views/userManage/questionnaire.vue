<template>
  <div>
    <div class="about-info" v-if="questionnaireList.length">
      <div class="top-nav">
        <span class="title">风险承受能力问卷</span>
        <p>
          得分
          <span class="color-red">{{ questionnaireResult.score }}</span>
          分，属于
          <span class="color-red">{{ questionnaireResult.type }}</span>
          投资者
        </p>
      </div>
      <div class="top-nav"></div>
    </div>
    <div class="survery-content">
      <dl v-for="(item, index) in questionnaireList" :key="index" :style="{ order: index > 4 ? index - 4 : index + 1 }">
        <dt>
          {{ index + 1 }}、<span class="color-gray" v-if="item.preTitle">{{ item.preTitle }}</span>
          {{ item.title }}
          <span class="color-gray" v-if="item.posTitle">{{ item.posTitle }}</span>
        </dt>
        <dd
          v-for="(_item, _index) in item.choices"
          :key="_index"
          :class="{
            checked: _item.name == item.result || (item.result.length && item.result.includes(_item.name))
          }"
        >
          <a-checkbox :checked="item.result.includes(_item.name)" disabled v-if="item.result.length > 1" />
          <a-radio :checked="_item.name == item.result" disabled v-else />{{ _item.text }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { Radio } from 'ant-design-vue'
import { questionnaire } from '@/utils/question'

export default {
  components: {
    [Radio.name]: Radio
  },
  data() {
    return {
      questionnaireList: [],
      questionnaireResult: ''
    }
  },
  mounted() {
    this.getExtendDetail()
  },
  methods: {
    getExtendDetail() {
      this.$apis
        .get_account_extend({ id: this.$route.query.id })
        .then(res => {
          const estimate_examine = res.info_extend.estimate_examine
          this.questionnaireList = estimate_examine.content ? estimate_examine.content : []
          this.questionnaireList.forEach((item, index) => {
            this.questionnaireList[index] = Object.assign(item, questionnaire[index])
          })
          this.questionnaireResult = estimate_examine.result
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.about-info {
  display: flex;
  justify-content: space-around;
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    width: 49%;
    height: 50px;
    padding: 0 30px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #aaa;
    &:last-child {
      border-bottom: none;
    }
    .title {
      font-size: 20px;
    }
    .color-red {
      color: #ff0000;
    }
  }
}
.survery-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  dl {
    margin: 0;
    padding: 20px;
    overflow: hidden;
    width: 49%;
    background-color: #f0f2f5;
    dt {
      margin-bottom: 10px;
      font-size: 16px;
      color: #444;
      .color-gray {
        color: #999;
      }
    }
    dd {
      float: left;
      margin-right: 30px;
      padding-left: 25px;
      &.checked {
        color: #1890ff;
      }
    }
  }
}
/deep/.ant-checkbox-wrapper {
  margin-right: 8px;
}
</style>
