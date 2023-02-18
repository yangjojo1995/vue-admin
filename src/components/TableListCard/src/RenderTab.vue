<script>
export default {
  functional: true,
  props: {
    render: {
      type: Function
    }
  },
  render: function (createElement, context) {
    return context.props.render && context.props.render(createElement)
  }
}
</script>
