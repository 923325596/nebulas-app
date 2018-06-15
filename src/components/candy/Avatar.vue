<template>
  <canvas ref="canvas" height="28" width="28"></canvas>
</template>

<script>
import blockies from '../../utils/blockies';
export default {
  props: {
    avatar: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.renderAvatar(this.avatar);
  },
  methods: {
    renderAvatar (avatar) {
      console.log(avatar);
      blockies.render(avatar, this.$refs.canvas);
    }
  }
};
</script>

<style>

</style>
