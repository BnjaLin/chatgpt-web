<script setup lang="ts">
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'
import { fetchCode, login } from '@/api/user'
import { useChatStore, useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { computed } from 'vue'

const ms = useMessage()

// 使用reactive创建响应式对象
const loginInfo = reactive({
  username: '',
  code: '',
})

// 使用useUserStore和useChatStore创建对应的store实例
const userStore = useUserStore()
const chatStore = useChatStore()

// const verification = () => {
//     if (loginInfo)
// }
const codeLoading = ref(0)
const sendCode = async () => {
  if (codeLoading.value) 
    return
  if (loginInfo.username.trim()) {
    resume();
    codeLoading.value = 60
    ms.info('验证短信已经发送，请注意查收')
    await fetchCode({ username: loginInfo.username })
  }
}
const sendCodeText = computed(() => {
    if (codeLoading.value) {
        return '验证码已发送 ' + codeLoading.value
    }
    return '发送验证码'
})
const { pause, resume } = useIntervalFn(() => {
    codeLoading.value--;
    if (codeLoading.value <= 0) {
        pause();
    }
}, 1000, { immediate: false })

// 提交登录表单
const submit = () => {
  // 调用后端API进行登录
  login<{ customer: UserInfo }>(loginInfo).then((res) => {
    // 登录成功后更新用户信息
    userStore.updateUserInfo(res.data.customer)

    // 清空聊天记录
    chatStore.initHistory()

    // 弹出成功提示
    ms.success('成功登录')

    // 跳转到聊天页面
    // router.push({ path: '/chat', params: { uuid: 1002 } })
  }).catch((err) => {
    // 如果登录失败，弹出错误提示
    ms.error(err)
  })
}
</script>

<template>

  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm p-6 rounded-lg border">
      <form class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-bold leading-4 text-gray-800">用户</label>
          <div class="mt-3">
            <input id="username" v-model="loginInfo.username" placeholder="输入手机号" name="username" type="phone" autocomplete="phone" required class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="code" class="block font-bold text-sm leading-4 text-gray-800 pl-2">验证码</label>
          </div>
          <div class="mt-3 flex">
            <input id="code" v-model="loginInfo.code" name="code" placeholder="输入短信验证码" autocomplete="current-password" class="pl-2 mr-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <button type="button" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-52" :class="{ 'cursor-not-allowed': codeLoading > 0, 'bg-indigo-500': codeLoading > 0 }" @click.prevent="sendCode">
              {{ sendCodeText }}
            </button>
          </div>
        </div>

        <div>
          <button type="button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click.prevent="submit">
            登 录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
