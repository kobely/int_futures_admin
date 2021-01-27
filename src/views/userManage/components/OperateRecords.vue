<template>
    <a-card title="账户历史操作" class="operate-records-card">
        <a-carousel arrows>
            <!-- <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="right: 60px;" v-show="newActLogList.length > 1">
                <a-icon type="double-left" />
            </div> -->
            <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px;" v-show="newActLogList.length > 1">
                <a-icon type="double-right" />
            </div>
            <div v-for="(item, index) in newActLogList" :key="index">
                <ul class="operate-records-wrap">
                    <li class="record-item" v-for="_item in item" :key="_item.id">
                        <p class="record-date">{{ _item.created_at }}</p>
                        <p class="record-title">{{ _item.act_name }}</p>
                        <div class="record-bz" v-if="_item.remark">
                            <p class="record-bz-left">备注：</p>
                            <p class="record-bz-right">{{ _item.remark }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </a-carousel>
    </a-card>
</template>

<script>
import { Card, Carousel, Row, Col, Icon } from 'ant-design-vue'
export default {
    components: {
        [Card.name]: Card,
        [Carousel.name]: Carousel,
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon
    },
    props: ['actLogList'],
    computed: {
        newActLogList() {
            const act_all_log_list = this.actLogList
            let newList = []

            if (act_all_log_list.length) {
                const group = Math.ceil(act_all_log_list.length / 4)
                for (let i = 0; i < group; i++) {
                    newList.push(act_all_log_list.slice(4 * i, 4 * (i + 1)))
                }
            }
            return newList
        }
    }
}
</script>

<style lang="less" scoped>
.operate-records-card {
    .operate-records-wrap {
        display: flex;
        flex: 1;
        flex-wrap: nowrap;
        padding-top: 5px;
        .record-item {
            position: relative;
            max-width: 350px;
            min-width: 25%;
            padding-top: 15px;
            border-top: 1px solid #999;
            &::before {
                content: '';
                position: absolute;
                top: -4px;
                left: 0;
                width: 8px;
                height: 8px;
                background-color: #fff;
                border: 1px solid #999;
                border-radius: 50%;
            }
            &:last-child {
                border: none;
            }
            .record-date {
                font-size: 12px;
            }
            .record-title {
                margin-top: 10px;
                color: #333;
            }
            .record-bz {
                margin-top: 10px;
                display: flex;
                align-items: center;
                align-items: flex-start;
                .record-bz-left {
                    width: 50px;
                    line-height: 1.4;
                }
                .record-bz-right {
                    max-width: 70%;
                    line-height: 1.4;
                    word-break: break-all;
                }
            }
        }
    }

    .ant-carousel .custom-slick-arrow {
        position: absolute;
        top: -45px;
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #666;
        opacity: 0.5;
    }
    .ant-carousel .slick-prev {
        left: auto;
    }
    .ant-carousel .custom-slick-arrow:before {
        display: none;
    }
    .ant-carousel .custom-slick-arrow:hover {
        opacity: 0.8;
    }
}
</style>
