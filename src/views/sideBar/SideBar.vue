<script setup lang="ts">
import { SettingFilled, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goPath = (path: string) => {
  router.push(`/${path}`)
}
</script>
<template>
  <div class="side-bar-container">
    <div class="account" @click="goPath('main')">
      <img src="@/assets/images/avatar.jpeg" alt="" />
    </div>
    <div class="setting" @click="goPath('setting')">
      <SettingFilled style="font-size: 22px" />
    </div>
    <div class="about" @click="goPath('about')">
      <QuestionCircleOutlined style="font-size: 22px" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.side-bar-container {
  width: 50px;
  height: 100vh;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  .account {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    img {
      width: 32px;
      border-radius: 6px;
    }
  }
  .setting {
    margin-top: auto;
  }
  .about {
    margin: 10px 0;
  }
}
</style>
