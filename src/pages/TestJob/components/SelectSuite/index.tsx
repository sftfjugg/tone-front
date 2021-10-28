import React, { useState, useRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { Button, Card, Empty, Badge, Typography, Space } from 'antd'
import _ from 'lodash'
import BusinessTestSelectDrawer from './components/BusinessTestSelectDrawer'
import SelectDrawer from './SelectDrawer'
import { suiteList } from './service';
import SuiteTable from './SuiteTable'
import styles from './style.less';
import { useParams } from 'umi';

const SelectSuite: React.FC<any> = (
	{
		handleData,
		contrl,
		test_type,
		business_type,
		template = {},
		disabled = false,
		onRef,
		server_type,
		setPageLoading,
		caseDataRef
	}
) => {
	const { ws_id } = useParams<any>()
	const outTable = useRef<any>(null)
	const drawer: any = useRef(null)

	const [loading, setLoading] = useState<boolean>(true)
	const [treeData, setTreeData] = useState<any>([])
	const [all, setAll] = useState<any>([])
	const [name, setName] = useState<string>()

	const [width, setWidth] = useState<number>(0)

	const [test_config, setTest_config] = useState<any>([])
	const [control, setControl] = useState<any>([])

	const [domain, setDomain] = useState('')

	const [standalone, setStandalone] = useState([])
	const [cluster, setCluster] = useState([])
	const [defaultTreeData, setDefaultTreeData] = useState(false)
	const [firstInit, setFirstInit] = useState(true)

	useImperativeHandle(
		onRef,
		() => ({
			setChecked: console.log,
			reset: () => setTest_config([]),
			setVal: (data:any[]) =>{
				const confs = handleTestConfig(_.isArray(data) ? data : [])
				setTest_config(confs)
				return confs
			}
		}),
	)

	const memoizedValue = useMemo(() => {
		let count = 0
		test_config.map((item: any) => {
			if(_.isArray(_.get(item,'test_case_list'))) count += item.test_case_list.length
			// if(_.isArray(_.get(item,'cases'))) count += item.cases.length
		})
		return count
	}, [test_config])
	const SuiteSelect = () => {
		drawer.current?.openDrawer()
	}

	const getList = async () => {
		firstInit && setPageLoading(true)
		setLoading(true)
		setTreeData([])
		const baseQuery = { test_type, ws_id, name, domain }
		const query = test_type === 'business' ? { business_type } : {}
		const { data=[] } = await suiteList({ ...baseQuery, ...query , page_size:100}) || {}
		const all: any = []
		data.map((item: any, index: number) => {
			item.key = index + ''
			item.title = item.name
			all.push(item.key)
			item.children = item.test_case_list.map((el: any, sq: number) => {
				el.parentId = item.id
				el.key = index + '-' + sq
				el.title = el.name
				el.ip = el.ip || '随机'
				all.push(el.key)
				return el
			})
			return item
		})
		if(caseDataRef) caseDataRef.current = data
		setTreeData(data)
		setAll(all)
		setLoading(false)
		setDefaultTreeData(true)
		setFirstInit(false)
	}

	useEffect(() => {
		getList()
	}, [name, domain])
	const handleTestConfig = (testConfigData:any[]) => {
		let keys: any = []
			let confs: any = []
			testConfigData.forEach(
				(suite: any) => {
					const {
						test_suite, need_reboot, setup_info, monitor_info,
						priority, cases, console: Console, cleanup_info,test_suite_id
					} = suite
					const suiteId = test_suite || test_suite_id
					const suiteIdx = treeData.findIndex(({ id }: any) => id === suiteId)
					if (suiteIdx > -1) {
						let testCaseList: any = []

						cases.forEach(
							(conf: any) => {
								if (treeData[suiteIdx]) {
									const caseList = treeData[suiteIdx].test_case_list
									const {test_case,test_case_id} = conf || {}
									const confId = test_case || test_case_id
									const idx = caseList.findIndex(({ id }: any) => id === confId)
									if (idx > -1) {
										const caseItem = caseList[idx]
										const { var : confVar } = caseItem
										let conf_var = [];
										if ( confVar ) conf_var = JSON.parse( confVar )
										keys.push(confId)
										const { env_info } = conf

										const envs: any = env_info ? Object.keys(env_info).map(
											key => ({ name: key, val: env_info[key] })
										) : []
										const { customer_server, server_tag_id } = conf
										let custom_channel = undefined, custom_ip = undefined;

										if (customer_server) {
											custom_channel = customer_server.custom_channel
											custom_ip = customer_server.custom_ip
										}

										let obj = {
											...conf,
											setup_info: conf.setup_info === '[]' ? '' : conf.setup_info,
											cleanup_info: conf.cleanup_info === '[]' ? '' : conf.cleanup_info,
											id: confId,
											env_info: envs.length > 0 ? envs : conf_var,
											title: caseItem.title,
											name: caseItem.name,
											custom_channel,
											custom_ip,
										}

										if (server_tag_id) {
											if (_.isArray(server_tag_id)) {
												obj.server_tag_id = _.filter(server_tag_id)
											}
											else if (typeof server_tag_id === 'string' && server_tag_id.indexOf(',') > -1) {
												obj.server_tag_id = server_tag_id.split(',').map((i: any) => i - 0)
											}
											else {
												obj.server_tag_id = []
											}
										}
										else {
											obj.server_tag_id = []
										}

										testCaseList.push(obj)
									}
								}
							}
						)

						confs.push({
							title: treeData[suiteIdx].name,
							id: suiteId,
							cosole: Console,
							need_reboot,
							setup_info: setup_info === '[]' ? '' : setup_info,
							cleanup_info,
							monitor_info,
							priority,
							test_case_list: testCaseList,
							run_mode: treeData[suiteIdx].run_mode
						})
					}
				}
			)
			return confs
	}
	useEffect(() => {
		if (defaultTreeData && treeData.length > 0 && JSON.stringify(template) !== '{}') {
			const confs = handleTestConfig(template.test_config)
			setTest_config(confs)
		}
	}, [template, defaultTreeData])
	useEffect(() => {
		validWidth()
		window.addEventListener('resize', validWidth);
		return () => {
			window.removeEventListener('resize', validWidth);
		}
	}, [])

	useEffect(() => {
		let control: any = []
		Object.keys(contrl).map(key => {
			if (contrl[key].config_index == 3) control.push(contrl[key].name)
		})
		setControl(control)
	}, [contrl])

	const validWidth = () => setWidth(outTable.current.clientWidth)

	useEffect(() => {
		handleData(test_config)
		let standaloneConf: any = []
		let clusterConf: any = []
		test_config.forEach((i: any) => {
			if (i.run_mode === 'cluster')
				clusterConf.push(i)
			else
				standaloneConf.push(i)
		})
		setStandalone(standaloneConf)
		setCluster(clusterConf)
	}, [test_config])

	const handleSelect = (data: any) => {
		if (data.length === 0) return setTest_config([])
		let newData: any = []
		data.forEach((i: any) => {
			let idx = test_config.findIndex((t: any) => t.id === i.id)
			if (idx === -1) newData.push(i)
			else {
				let newCaseList: any = []
				const confCases = test_config[idx].test_case_list
				i.test_case_list.forEach((c: any) => {
					const index = confCases.findIndex((ele: any) => ele.id === c.id)
					if (index === -1) newCaseList.push(c)
					else newCaseList.push(confCases[index])
				})
				newData.push({ ...test_config[idx], test_case_list: newCaseList })
			}
		})
		setTest_config(newData)
	}

	const handleTestConfigChange = (data: any, mode: string) => {
		if (mode === 'cluster')
			setTest_config(standalone.concat(data))
		else
			setTest_config(cluster.concat(data))
	}

	const TableProps = {
		disabled,
		width,
		test_type,
		server_type,
		contrl,
		control,
		loading,
		ws_id,
		onDataSourceChange: handleTestConfigChange,
	}

	return (
		<div className={styles.suite} ref={outTable} style={{ position: 'relative', width: '100%' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					{
						<Button
							disabled={disabled}
							type="primary"
							size="small"
							onClick={SuiteSelect}
							style={{ marginBottom: '12px' }}
						>
							选择用例
						</Button>
					}
					{
						test_config.length > 0 &&
						<span style={{ paddingLeft: 8 }}>
							<Space>
								<>
									<Typography.Text style={{ color : 'rgba(0,0,0,.65)'}}>已选Test Suite</Typography.Text>
									<Badge style={{ backgroundColor: 'rgba(140,140,140,0.10)', color: 'rgba(0,0,0,.65)' }} count={test_config.length} />
								</>
								<>
									<Typography.Text style={{ color : 'rgba(0,0,0,.65)'}}>Test Conf</Typography.Text>
									<Badge style={{ backgroundColor: 'rgba(140,140,140,0.10)', color: 'rgba(0,0,0,.65)' }} count={memoizedValue} />
								</>
							</Space>
						</span>
					}
				</div>
			</div>

			{test_type === 'business' ?
				<BusinessTestSelectDrawer ws_id={ws_id} // 业务测试(选择用例)
				  testType={test_type}
					onRef={drawer}
					handleSelect={handleSelect}
					config={test_config}
					control={control}
					onDomainChange={setDomain}
					treeData={treeData}
					onNameChange={(value: string) => setName(value)}
					suiteAllKeys={all}
					loading={loading}
				/>
				:
				<SelectDrawer ws_id={ws_id} // 功能、性能(选择用例)
				  testType={test_type}
					onRef={drawer}
					handleSelect={handleSelect}
					config={test_config}
					control={control}
					onDomainChange={setDomain}
					treeData={treeData}
					onNameChange={(value: string) => setName(value)}
					suiteAllKeys={all}
					loading={loading}
				/>
			}

			{
				(standalone.length === 0 && cluster.length === 0) &&
				<Card bodyStyle={{ width: width || '100%'}}>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请先选择用例" />
				</Card>
			}
			{
				standalone.length > 0 &&
				<SuiteTable
					{...TableProps}
					dataSource={standalone}
					run_mode="standalone"
				/>
			}
			{
				cluster.length > 0 &&
				<SuiteTable
					{...TableProps}
					dataSource={cluster}
					run_mode="cluster"
				/>
			}
		</div>
	);
};

export default SelectSuite;


