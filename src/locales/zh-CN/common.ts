import { aligroupServer, aliyunServer,
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
  'request.copy.success': '复制成功',
	'request.save.success': '保存成功', 
  'validator.failed': '校验失败',
  'sorry, the page cannot be accessed': '抱歉，页面无法访问…',
  'page links may have expired or been deleted': '页面链接可能已失效或被删除',
  'no.use.case': '暂无用例',

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
  'aligroup': '内网环境',
  'aliyun': '云上环境',


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
};