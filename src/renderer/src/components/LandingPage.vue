<template>
  <div id="wrapper">
    <img id="logo" :src="logo" alt="electron-vue" />
    <main>
      <div class="left-side">
        <span class="title">{{ i18nt("welcome") }}</span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title alt">{{ i18nt("buttonTips") }}</div>
          <el-button type="primary" round @click="crash">{{
            i18nt("buttons.simulatedCrash")
          }}</el-button>
          <el-button type="primary" round @click="openNewWin">{{
            i18nt("buttons.openNewWindow")
          }}</el-button>
          <el-button type="primary" round @click="changeLanguage">
            {{ i18nt("buttons.changeLanguage") }}
          </el-button>
          <el-button type="primary" round @click="handleDarkMode">{{
            i18nt("buttons.changeTheme")
          }}</el-button>
          <el-button type="primary" round @click="handleResetToSystem">{{
            i18nt("buttons.defaultTheme")
          }}</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SystemInformation from "./SystemInformation.vue";
import logo from "@/assets/logo.png";
import { i18n, i18nt, setLanguage } from "@/i18n";

function changeLanguage() {
  setLanguage(i18n.global.locale === "zh-cn" ? "en" : "zh-cn");
}

function crash() {
  window.ipcOperate.crash();
}

function openNewWin() {
  window.ipcOperate.openNewWin("/form/index");
}

async function handleDarkMode() {
  window.ipcOperate.changeTheme();
}

async function handleResetToSystem() {
  window.ipcOperate.resetTheme();
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  padding: 60px 80px;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

.left-side {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.right-side {
  width: 50%;
}

.welcome {
  /* color: #555; */
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  /* color: #2c3e50; */
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}
.doc {
  margin-bottom: 10px;
}
.doc p {
  /* color: black; */
  margin-bottom: 10px;
}
.doc .el-button {
  margin-top: 10px;
  margin-right: 10px;
}
.doc .el-button + .el-button {
  margin-left: 0;
}
.conten {
  text-align: center;
}
</style>
