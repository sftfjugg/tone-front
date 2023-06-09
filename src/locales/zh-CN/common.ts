import {
  aligroupServer, // '内网' | '固定机器池'
  aliyunServer,   // '云上' | '弹性机器池'
  aligroupServer_baseline, aliyunServer_baseline,
  aligroupServer_standalone,
  aliyunServer_standalone,
  aligroupServer_cluster,
  aliyunServer_cluster, 
} from '@/utils/utils'

export default {
  'request.failed': '请求失败！',
  'request.create.success': '创建成功',
  'request.create.failed': '创建失败',
  'request.delete.success': '删除成功',  
  'request.delete.failed': '删除失败',
  'request.update.success': '更新成功',
  'request.reset.failed': '重置失败',
  'request.reset.success': '重置成功',
  'request.copy.success': '复制成功',
	'request.save.success': '保存成功', 
  'request.modify.success': '修改成功', 
  'validator.failed': '校验失败',
  'sorry, the page cannot be accessed': '抱歉，页面无法访问…',
  'page links may have expired or been deleted': '页面链接可能已失效或被删除',
  'reference.details': '引用详情',
  'template.list': '模版列表',
  'no.use.case': '暂无用例',
  'select.suite.random': '随机',
  'you.haven.not.signed.in': '你还未登录，请登录后使用该功能。',
  'go.to.login': '去登录',
  'back.to.home': '返回首页',

  'system.image': '公共镜像',
  'self.image': '自定义镜像',
  'others.image': '共享镜像',
  
  'performance.test': '性能测试',
  'functional.test': '功能测试',
  'stability.test': '稳定性测试',
  'business.test': '业务测试',
  'access.test': '接入测试',
  'io.test': 'IO字系统',

  'stability': '稳定性',
  'business': '业务',
  // test suite 类型
  'performance': '性能',
  'functional': '功能',
  'standalone': '单机',
  'cluster': '集群',
  'added': '已添加',

  // server_provider
  'aligroup': aligroupServer,  // '内网环境' | '固定机器池',
  'aliyun': aliyunServer,      // '云上环境' | '弹性机器池',
  // server_type
  'aligroupServer': aligroupServer,
  'aliyunServer': aliyunServer,
  // 基线
  'aligroupServer.baseline': aligroupServer_baseline,
  'aliyunServer.baseline': aliyunServer_baseline,
  // 单机 | 集群
  'aligroupServer.standalone': aligroupServer_standalone,
  'aliyunServer.standalone': aliyunServer_standalone,
  'aligroupServer.cluster': aligroupServer_cluster,
  'aliyunServer.cluster': aliyunServer_cluster,

  'common.random': '随机',
  'common.hardware': '硬件',
  'common.instance.ID': '实例ID',
  'common.private_ip': 'IP地址',
  'common.instance_type': '规格',
  'common.bandwidth': '带宽',
  'common.system_disk': '系统盘',
  'common.storage_type': '数据盘',
  'common.soft': '软件',
  'common.image_name': '镜像',
  'common.server.state': '机器状态',
  'common.channel_type': '控制通道',
  'common.extended.field': '扩展字段',

  'common.cloud': '普通云盘',
  'common.cloud_efficiency': '高效云盘',
  'common.cloud_ssd': 'SSD云盘',
  'common.cloud_essd': 'ESSD云盘',
};
