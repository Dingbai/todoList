<script setup lang="ts">
import {
  SettingFilled,
  QuestionCircleOutlined,
  CheckSquareOutlined
  // CalendarOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import classNames from 'classnames'

const router = useRouter()

type MenuItem = {
  name: string
  icon: Component
  label: string
}
const MenuList = ref<MenuItem[]>([
  {
    name: 'main',
    icon: CheckSquareOutlined,
    label: 'Todo'
  },
  // {
  //   name: 'calendar',
  //   icon: CalendarOutlined,
  //   label: 'Calendar'
  // },
  {
    name: 'setting',
    icon: SettingFilled,
    label: 'Setting'
  },
  {
    name: 'about',
    icon: QuestionCircleOutlined,
    label: 'About'
  }
])

const goPath = (path: string) => {
  router.push(`/${path}`)
}
</script>
<template>
  <div class="side-bar-container">
    <div class="account" @click="goPath('main')">
      <img src="@/assets/images/avatar.jpeg" alt="" />
    </div>
    <div class="menu-list">
      <div
        v-for="item in MenuList"
        :class="classNames('menu-item', item.name)"
        :key="item.name"
        @click="goPath(item.name)"
      >
        <component :is="item.icon" style="font-size: 26px" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.side-bar-container {
  .layout {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  width: 50px;
  height: 100vh;
  background-color: #f9f9f9;
  .layout;
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
  .menu-list {
    padding-top: 20px;
    flex: 1;
    .layout;
    .menu-item {
      margin-bottom: 15px;
    }
    .setting {
      margin-top: auto;
    }
  }
}
</style>
