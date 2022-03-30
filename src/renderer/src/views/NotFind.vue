<template>
  <div class="NotFind">
    <div class="not-find-inner ignore-bg">
      <img src="~@/assets/images/bg-no-content.png" alt="" />
      <div class="txt">
        <span>404,未找到相关资源! </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.NotFind {
  width: 100vw;
  height: 100vh;
  background: white;
  @include flex(center, center);

  .not-find-inner {
    width: 100%;
    color: #8196d3;
    font-size: 16px;
    text-align: center;

    &.ignore-bg {
      max-width: 600px;
    }

    img {
      width: 100%;
      height: auto;
    }

    .txt {
      margin-top: -30px;

      .link {
        margin-left: 10px;
      }
    }
  }
}

.app-container {
  padding: 0;
}
</style>
