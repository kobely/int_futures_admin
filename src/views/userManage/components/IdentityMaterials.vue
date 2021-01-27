<template>
  <a-card title="身份材料一览" class="card-hei">
    <a-row>
      <a-col :span="6" v-if="detailInfo.positive_img">
        <div class="idcard-image-wrap" @click="imagePreview(detailInfo.positive_img, true)">
          <img :src="detailInfo.positive_img" class="idcard-image" alt="" />
        </div>
        <p class="img-title">
          身份证正面照片
        </p>
      </a-col>
      <a-col :span="6" v-if="detailInfo.inverse_img">
        <div class="idcard-image-wrap" @click="imagePreview(detailInfo.inverse_img, true)">
          <img :src="detailInfo.inverse_img" class="idcard-image" alt="" />
        </div>
        <p class="img-title">
          身份证背面照片
        </p>
      </a-col>
      <a-col :span="6" v-if="detailInfo.address_img">
        <div class="idcard-image-wrap" @click="imagePreview(detailInfo.address_img, true)">
          <img :src="detailInfo.address_img" class="idcard-image" alt="" />
        </div>
        <p class="img-title">
          地址证明照片
        </p>
      </a-col>

      <a-col :span="6" v-if="detailInfo.video_url">
        <div class="idcard-image-wrap" @click="imagePreview(detailInfo.video_url, false)">
          <a-icon type="play-circle" :style="{ fontSize: '40px', cursor: 'pointer' }" />
        </div>
        <p class="img-title">
          人像视频
        </p>
      </a-col>
    </a-row>
    <div class="img-preview-wrap" v-if="isPreview" @click="isPreview = false">
      <img :src="previewUrl" alt="" v-if="isImg" />
      <video :src="previewUrl" style="max-height: 100%" controls="controls" v-else>
        您的浏览器不支持 video 标签。
      </video>
    </div>
  </a-card>
</template>

<script>
import { Card, Row, Col, Icon } from 'ant-design-vue'
import { getOssImageName } from '@/utils/util'

export default {
  components: {
    [Card.name]: Card,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon
  },
  data() {
    return {
      isPreview: false,
      isImg: true,
      previewUrl: ''
    }
  },
  props: ['detailInfo'],
  methods: {
    getOssImageName,
    imagePreview(url, isImg) {
      this.isPreview = true
      this.previewUrl = url
      this.isImg = isImg
    }
  }
}
</script>

<style lang="less" scoped>
.idcard-image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .idcard-image {
    max-width: 90%;
    max-height: 200px;
    cursor: pointer;
  }
  .video-title {
    cursor: pointer;
  }
}
.img-title {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
}
// 图片预览
.img-preview-wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  & > img {
    max-width: 60%;
    max-height: 90%;
  }
}
</style>
