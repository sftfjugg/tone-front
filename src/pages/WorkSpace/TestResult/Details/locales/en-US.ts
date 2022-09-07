const defaultKey = 'ws.result.details'

const text =  {
  'test.result': 'Test Result',
  'result.details': 'Result Details',
  'provider_name': 'Sever Type',
  'test_type': 'Test Type',  
  'job_state': 'Job Status', 
  'job_type': 'Job Type',
  'creator_name': 'Creator',
  'gmt_created': 'Created Time',
  'finish_time': 'End Time',
  'project_name': 'Project',
  'baseline_job': 'Baseline Job',
  'baseline_test': 'Test Baseline',
  'produce.version': 'Product Version',
  'plan_instance_name': 'Plan Name',
  'job.tag': 'Job Tag',
  'test_summary': 'Note',
  'test.result.view.log.file': 'For details about the test results, check the log file',
  'baseline.description': 'Baseline Description',
  'baseline.description.ps': 'Record some official more formal analysis of the problem, baseline statement and baseline association',  
  'result.remarks': 'Note',
  'result.remarks.ps': 'Record the description of the results, and some corrections to the baseline problems. The notes are related to the current results',
  'rerun': 'Rerun',
  'stop': 'Stop Job',
  // Chart
  'increase': 'Raise',// 'Rising',
  'decline': 'Drop',//'Falling',
  'normal': 'Normal',
  'invalid': 'Invalid',
  'na': 'NA',
  'success': 'Pass',
  'fail': 'Fail',
  'skip': 'Skip',
  'warn': 'Warn',
  'count': 'All',
  //
  'instance.released': 'Instance released',
  'machine.has.been.released': 'Cloud instance released',
  'machine.config.error': 'The cluster configured incorrectly',
  'machine.occupied.by.job': 'Server occupied by job',
  'occupy.job': 'Occupied Job',
  
  // Tab
  'tab.testResult': 'Test Result',
  'tab.testProgress': 'Cases',
  'tab.testConfig': 'Test Configurations',
  'tab.monitor': 'Data Monitor',
  'tab.log': 'Logs',
  'tab.resultFile': 'Result File',
  'tab.versionInfo': 'Version Info',
  'tab.executionDetails': 'Execution Details',

  // TestResultTable
  'folded.conf': 'Collapse All Conf',
  'expand.conf': 'Expand All Conf',

  'folded.Case': 'Collapse All Case',
  'expand.Case': 'Expand All Case',
  'folded.index': 'Collapse All Indicators',
  'expand.index': 'Expand All Indicators',
  'folded.all': 'Collapse All',
  'expand.all': 'Expand All',
  'batch.baseline': 'Batch Comparison Baseline',
  'batch.join.baseline': 'Batch Addition Baseline',
  'business.count': 'Count',
  'business.success': 'Success',
  'business.fail': 'Fail',
  'business_name': 'Business Name',
  'the.server': 'Server',
  'result': 'Result',
  'business_business': 'Total/Success/Fail',
  'performance': 'Metric Total/Raise/Drop/Normal/Invalid/NA',
  'functional': 'Total/Pass/Fail/Skip',
  'baseline': 'Baseline',
  'baseline_job_id': 'Baseline Job',
  'start_time': 'Start Time',
  'end_time': 'End Time',
  'note': 'Note',
  'join.baseline': 'Add Baseline',
  // Drawer
  'bug': 'Bug Record',
  'bug.placeholder': 'Enter bug record',
  'baseline_id': 'Choose Baseline',
  'baseline_id.placeholder': 'Choose Baseline',
  'create.baseline': 'Create Baseline',
  'impact_result': 'Impact Result',
  'description': 'Description',
  'description.placeholder': 'Enter description',
  // Modal
	'test.env': 'Test Environment',
  'baseline.type': 'Baseline Type',
  'baseline.name': 'Baseline Name',
  'baseline.name.placeholder': 'Enter Baseline Name',
  'baseline.desc': 'Description (Optional)',
  'baseline.desc.placeholder': 'Enter Description',
  // edit
  'edit.remarks': 'Edit Notes',
  'please.enter.remarks': 'Enter Notes',
  'baseline.message': 'No comparison baseline was selected',
  'baseline.placeholder': 'Select comparison baseline',
  'failed.download.file': 'Failed to download the file',
  'failed.get.file': 'Failed to get file',
  'match.baseline': 'Match Baseline',
  'aone.bug': 'Aone URL',
  'installed.kernel': 'Kernel Installed',
  'installed.rpm': 'RPM Installed',
  'metric': 'Indicator',
  'compared.results': 'Compare Result',
  'baseline_value': 'Baseline',
  'threshold': 'Threshold Value',
  'track_result': 'Track Result',


  // ProcessTable
  'build.kernel': 'Build Kernel',  
  'package': 'Package',
  'name': 'Name',
  'state': 'State',
  'git_repo': 'Repo',
  'git_branch': 'Branch',
  'cbp_link': 'cbp URL',
  'copied': 'Copied to the clipboard!',

  'test.preparation': 'Test Preparation',
  'mode': 'Mode',
  'test.server': 'Server',
  'stage': 'Steps',
  'output.results': 'Output',
  'copy.success': 'Copy success',

  'test.case': 'Case',
  'put.away.all': 'Collapse All',
  'expanded.all': 'Expand All',
  'env.preparation': 'Environmental Preparation',
  'env.preparation.details': 'Environmental Preparation Details',
  'stop.suite': 'Stop', // 'Stop Suite',
  'skip.suite': 'Skip', // 'Skip Suite',
  'restart.server': 'Restart Server',
  'execute.script': 'Execute Script',  
  'view.log': 'View Log',
  'log': 'Logs',
  'suspension': 'Suspend',
  // 'skip': '跳过',
  'monitor': 'Monitor',
  'monitor_link': 'Link',
  'failed.info': 'Failed Info',


  // TestSettingTable
  'env.prepare.config': 'Environmental Preparation Configurations',
  //----后端返的字段----
  'reclone': 'Reload Machine',
  'kernel_install': 'Reinstall Kernel',
  'reboot': 'Restart Machine',  
  'global_variable': 'Global Variable',
  'rpm': 'Install RPM',
  'script': 'Execute Script',
  'monitor.config': 'Monitor configuration',
  //----------------
  'physical': 'Server',
  'physical.placeholder': 'Choose iclone os Image',
  'app_name.placeholder': 'Choose iclone Application Template',
  'vm': 'VM',
  'vm.placeholder': ' Choose vm Configuration',
  'install_no': 'Not Install',
  'install_publish': 'Install Published',
  'install_un': 'Install Unpublished',
  'install_build': 'Build Kernal',
  // 'env_info.validate': 'Format: key=value, multiple carriage return line feed',
  'rpm.add': '+ Add RPM Package',
  'please.enter.rpm': 'Enter the RPM package link, there are more than one with comma or newline split',
  'script.add': '+ Add Execution Script',
  'please.enter.script': 'Enter script',

  'test.cases.and.config': 'Cases and Server Configurations',  
  'restart': 'Restart',
  'setup_info': 'Script',
  'restart.before': 'Before Restart',
  'restart.after': 'After Restart',
  'priority': 'Priority',
  'variable': 'Value',

  'more.configurations': 'More Configurations',
  //----后端返的字段----
  'cleanup': 'Cleanup Script',
  'job_tag': 'Job Tag',
  'notice_subject': 'Notice Theme',
  'email_notice': 'Email Notice',
  'ding_notice': 'DingTalk Notice',
  //------------------
  'cleanup.placeholder': 'Enter Script of Cleanuping Job',
  'tag': 'Tag',
  'select.tag': 'Select Tag',
  'notice_subject.placeholder': '[T-One] Test completed in {date}',
  'email.message': 'Enter correct email',
  'email.placeholder': 'The Job creator is notified by default. Multiple emails are separated by spaces or commas',
  'ding_notice.placeholder': 'Enter DingTalk token，Multiple tokens are separated by spaces or commas',
  'report': 'Report',
  'report.placeholder': 'Enter Report Name ，eg {job_name}_report-{report_seq_id}',
  'report.Popover': 'Report names are available as placeholders',
  'report_template': 'Report Template',
  'report_template.placeholder': 'Enter Report Template',
  'callback_api': 'Callback API',
  'callback_api.placeholder': 'Enter Callback API',

  'new.tag': 'New Tag',
  'tag_color': 'Tag Color',
  'tag_name': 'Tag Name',
  'tag_name.already.exists': 'Tag Name already exists',

  'test.machine.failure': 'Test server failure, please deal with it in time! ',
  'failed.server': 'Broken Server',
  'channel_type': 'Control Channel',
  'use_state': 'Using Status',
  'real_state': 'Actual Status',
  'not.assigned.server': 'Not assigned to test server',
  'running,please.wait': 'Running, please wait patiently',

  'scheduling.tab': 'Scheduling Label',
  'other.information': 'More Info',
  'configuration.name': 'Config Name',
  'gmt_modified': 'Modified Time',
  'server.instance.name': 'Server Instance Name：{data}',
  'server.configuration.name': 'Server Config Name：{data}',
  'cluster.name': 'Cluster Name',
};

export default Object.keys(text).reduce((p, key) => {
  p[`${defaultKey}.${key}`] = text[key]
  return p
}, {})