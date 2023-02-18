<template>
  <div class="upload-file" :class="{ 'is-inline': inline, 'is-disabled': disabled, 'is-readonly': readonly }">
    <template v-if="!readonly">
      <div class="target">
        <button :disabled="disabled" type="button" class="target-button" @click.stop="select()">{{ buttonText }}</button>
        <span class="target-tip" v-if="targetTip">{{ targetTip }}</span>
        <slot name="target-tip"></slot>
      </div>
      <div class="tip">
        <span>{{ tip }}</span>
        <slot name="tip"></slot>
      </div>
    </template>
    <div class="files">
      <div
        class="file"
        :class="{ [`is-${node.status}`]: node.status }"
        v-for="node in nodes"
        :key="node.key">
        <div class="file-info">
          <div v-if="icon" class="file-info-icon">
            <i :class="icon" aria-hidden="true"></i>
          </div>
          <div class="file-info-name">{{ node.name }}</div>
          <div v-if="!readonly" class="file-info-status">
            <i class="el-icon-close" @click.stop="removeNode(node)" aria-hidden="true"></i>
            <i v-if="node.status === 'success'" class="el-icon-circle-check" aria-hidden="true"></i>
            <i v-else-if="node.status === 'warning'" class="el-icon-warning" aria-hidden="true"></i>
            <i v-else-if="node.status === 'error'" class="el-icon-circle-close" aria-hidden="true"></i>
          </div>
        </div>
        <div v-if="['ready','uploading'].includes(node.status)" class="file-progress">
          <el-progress
            :show-text="false"
            :stroke-width="2"
            :percentage="node.percentage">
          </el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upload from './mixins/upload'
export default {
  extends: upload,
  props: {
    // 行内模式
    inline: {
      type: Boolean,
      default: false
    },
    // 只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 图标
    icon: {
      type: [String, Boolean],
      default: 'el-icon-document'
    },
    // 按钮文本
    buttonText: {
      type: String,
      default: '请选择文件'
    },
    // 目标描述
    targetTip: {
      type: String,
      default: ''
    },
    // 描述
    tip: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.target-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: all 0.3s;
  font-weight: 500;
  user-select: none;
  // padding: 12px 18px;
  font-size: 14px;
  // border: none;
  border-radius: 4px;
  min-width: 96px;
  // color: #333333;

  border: 1px solid #C4C6CF;
  padding: 12px 16px;
  background: #FFFFFF;
  color: #333333;
  &:hover {
    border-color: #C4C6CF;
    background: #F2F3F7;
    color: #333333;
  }
}

.upload-file {
  font-size: 14px;
}

.target {
  margin-bottom: 10px;
  line-height: 40px;
  display: inline-block;
  .target-button {
    margin-right: 10px;
  }
}

.target-tip {
  color: #999;
  font-size: 14px;
  display: inline-block;
}

.tip {
  color: #999;
  margin-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  line-height: 1.2em;
}
.files {
  line-height: 1.2em;
}
.file {
  max-width: 360px;
}

.file-info {
  line-height: 26px;
  width: 100%;
  display: table;
  table-layout: fixed;
  cursor: pointer;

  .file-info-icon,
  .file-info-name,
  .file-info-status {
    display: table-cell;
  }
  .file-info-icon,
  .file-info-status {
    width: 26px;
    line-height: 26px;
    text-align: center;
  }

  .el-icon-close {
    color: #999;
    display: none;
  }

  .el-icon-circle-check {
    color: #67c23a;
  }
  .el-icon-warning {
    color: #e6a23c;
  }
  .el-icon-circle-close {
    color: #f56c6c;
  }

  &:hover {
    background-color: #f5f7fa;
    .file-name {
      color: #409eff;
    }

    .el-icon-close {
      display: inline-block;
    }
    .el-icon-circle-check,
    .el-icon-warning,
    .el-icon-circle-close {
      display: none;
    }
  }
  &.is-error {
    color: #999;
    text-decoration: line-through;
  }

}

.file-progress {
  height: 2px;
}

.is-readonly {
  .file {
    max-width: 100%;
  }
}
.is-inline {
  &.is-readonly {
    width: auto;
    display: inline-block;
    vertical-align: middle;
  }
  .file {
    width: auto;
    display: inline-block;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
    .file-info {
      width: auto;
      padding-right: 4px;
    }
  }
}

</style>
