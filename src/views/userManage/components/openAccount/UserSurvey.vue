<template>
  <div>
    <p class="open-account-section-title">用户增信资料</p>
    <a-row>
      <a-col :span="24" :offset="1">
        <a-form-model-item>
          <span class="info-item-title">1、适当性调查问卷</span>
          <span class="info-status" v-if="hasSurvey">已填写</span>
          <span class="info-modify-btn" @click="surveyModal = true">
            <template v-if="hasSurvey">修改</template>
            <template v-else>待填写</template>
          </span>
        </a-form-model-item>
      </a-col>
      <a-col :span="24" :offset="1">
        <a-form-model-item>
          <span class="info-item-title">2、风险承受能力问卷</span>
          <span class="info-status" v-if="hasQuestionnaire">
            得分{{ estimateExamineResult.score || userAddInfo.estimate_examine_result.score }}，属于{{
              estimateExamineResult.type || userAddInfo.estimate_examine_result.type
            }}投资者
          </span>
          <span class="info-modify-btn" @click="questionnaireModal = true">
            <template v-if="hasQuestionnaire">修改</template>
            <template v-else>待填写</template>
          </span>
        </a-form-model-item>
      </a-col>
      <a-col :span="24" :offset="1">
        <a-form-model-item>
          <span class="info-item-title">3、客户声明</span>
          <span class="info-status" v-if="hasState">已填写</span>
          <span class="info-modify-btn" @click="stateModal = true">
            <template v-if="hasState">修改</template>
            <template v-else>待填写</template>
          </span>
        </a-form-model-item>
      </a-col>
    </a-row>
    <survey-field v-if="surveyModal" :visible.sync="surveyModal" :user-id="userId" />
    <questionnaire-field
      v-if="questionnaireModal"
      :visible.sync="questionnaireModal"
      :user-id="userId"
      :estimate-examine-result.sync="estimateExamineResult"
    />
    <state-field v-if="stateModal" :visible.sync="stateModal" :user-id="userId" />
  </div>
</template>

<script>
import { Modal, FormModel, Row, Col } from 'ant-design-vue'
import SurveyField from './modalContent/SurveyField'
import QuestionnaireField from './modalContent/QuestionnaireField'
import StateField from './modalContent/StateField'
import { mapState } from 'vuex'

export default {
  components: {
    SurveyField,
    QuestionnaireField,
    StateField,
    [Modal.name]: Modal,
    [FormModel.Item.name]: FormModel.Item,
    [Row.name]: Row,
    [Col.name]: Col
  },
  props: ['form', 'userId'],
  data() {
    return {
      surveyModal: false,
      questionnaireModal: false,
      stateModal: false,
      estimateExamineResult: {}
    }
  },
  computed: mapState({
    surveyUid: state => state.openAccount.surveyUid,
    questionnaireUid: state => state.openAccount.questionnaireUid,
    stateUid: state => state.openAccount.stateUid,
    userAddInfo() {
      return this.form.user_add_info || {}
    },
    hasSurvey() {
      return this.surveyUid || this.userAddInfo.examine_list_status
    },
    hasQuestionnaire() {
      return this.questionnaireUid || this.userAddInfo.estimate_examine_status
    },
    hasState() {
      return this.stateUid || this.userAddInfo.customer_state_status
    }
  }),
  methods: {}
}
</script>

<style lang="less" scoped>
.info-item-title {
  display: inline-block;
  width: 180px;
}
.info-status {
  display: inline-block;
  width: 230px;
  color: #999;
}
.info-modify-btn {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
