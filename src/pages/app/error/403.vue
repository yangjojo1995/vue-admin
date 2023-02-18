
<script>
import Exception from './500.vue'
export default {
  head: { title: '403' },
  extends: Exception,
  data () {
    return {
      code: 403,
      content: '抱歉，您无权访问此页面！',
      image: require('./_assets/image/403.png'),
      homeTo: '/'
    }
  }
}
</script>
