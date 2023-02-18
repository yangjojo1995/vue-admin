
<script>
import Exception from './500.vue'
export default {
  head: { title: '404' },
  extends: Exception,
  data () {
    return {
      code: 404,
      content: '抱歉，您访问的页面不存在！',
      image: require('./_assets/image/404.png'),
      homeTo: '/'
    }
  }
}
</script>
