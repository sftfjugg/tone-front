import { Select, Space, Badge, Tooltip, Typography, Form } from 'antd'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { standloneServerList, queryClusterServer, queryClusterStandaloneServer, queryClusterGroupServer } from './services';
import { DrawerProvider } from './Provider'
import { RenderSelectItems } from '../untils'
import { useParams } from 'umi'

const ServerObjectSelect = (props: any) => {
    const { serverObjectType, run_mode, server_type, serverList } = props
    const { ws_id } = useParams<any>()
    const { setServerList } = useContext<any>(DrawerProvider)
    const PAGE_SIZE = 100
    const [fetching, setFetching] = useState(true)
    const [pageNum, setPageNum] = useState(1)
    const [serverListCopy, setServerListCopy] = useState([])

    useEffect(() => {
        if (serverObjectType !== 'ip' && serverObjectType !== 'server_tag_id') {
            queryServerList(1)
            setPageNum(1)
        }
    }, [serverObjectType])

    useEffect(() => {
        setServerListCopy(serverList)
    }, [serverList])

    //内网单机
    const standaloneServerRequest = async (page_num = 1) => {
        const { data, code } = await standloneServerList({ ws_id, state: ['Available', 'Occupied', 'Reserved'], page_num, page_size: PAGE_SIZE }) //, page_size : 2
        if (code === 200 && data) setServerList(serverList.concat(data))
    }

    //内网集群
    const clusterServerRequest = async (page_num = 1) => {
        const { data, code } = await queryClusterServer({ cluster_type: 'aligroup', ws_id, page_num, page_size: PAGE_SIZE })
        if (code === 200 && data) setServerList(serverList.concat(data))
    }

    //云上单机
    const clusterStandaloneRequest = async (page_num = 1) => {
        const { data, code } = await queryClusterStandaloneServer({ ws_id, no_page: true, is_instance: serverObjectType === 'instance', state: ['Available', 'Occupied', 'Reserved'] })
        if (code === 200 && data) setServerList(serverList.concat(data))
    }

    //云上集群
    const clusterGroupRequest = async (page_num = 1) => {
        const { data, code } = await queryClusterGroupServer({ cluster_type: 'aliyun', ws_id, no_page: true })
        if (code === 200 && data) setServerList(serverList.concat(data))
    }

    const queryServerList = async (page_num = 1) => {
        setFetching(true)
        if (server_type === 'aligroup') {
            run_mode === 'cluster' ?
                await clusterServerRequest(page_num) :
                await standaloneServerRequest(page_num)
        }
        else { //aliyun
            run_mode === 'cluster' ?
                await clusterGroupRequest() :
                await clusterStandaloneRequest()
        }
        setFetching(false)
    }

    const handleServerPopupScroll = ({ target }: any) => { //server
        const { clientHeight, scrollHeight, scrollTop } = target
        if (clientHeight + scrollTop === scrollHeight) {
            const num = pageNum + 1
            setPageNum(num)
            queryServerList(num)
        }
    }

    const switchServerMessage = useMemo(
        () => {
            switch (serverObjectType) {
                case 'server_object_id': return '请选择机器';
                case 'instance': return '请选择机器实例';
                case 'setting': return '请选择机器配置';
                default: return ''
            }
        }, [serverObjectType]
    )

    const handleSearch = (value: string) => {
        if (run_mode === 'standalone' && Array.isArray(serverListCopy)) {
            const data = serverList.filter((item: any) => {
                const ip = item?.private_ip || item?.pub_ip || item?.sn || ''
                return ip.toLowerCase().includes(value)
            })
            setServerListCopy(data)
        }
    }

    const renderServerItem = useMemo(() => {
        if (serverObjectType !== 'ip' && serverObjectType !== 'server_tag_id') 
        return (
            <Form.Item noStyle>
                <Form.Item
                    name="server_object_id"
                    rules={[{ required: true, message: switchServerMessage }]}
                >
                    <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder={switchServerMessage}
                        dropdownMatchSelectWidth={340}
                        showSearch
                        onSearch={handleSearch}
                        loading={fetching}
                        onPopupScroll={handleServerPopupScroll}
                        optionFilterProp="children"
                        filterOption={(input, option: any) => true }
                    >
                        {
                            serverObjectType === 'server_object_id' &&
                            (
                                run_mode === 'standalone' ?
                                    serverListCopy.map(
                                        (item: any) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                <Space>
                                                    {item.state === "Available" && <Badge status="success" />}
                                                    {item.state === "Occupied" && <Badge status="error" />}
                                                    {item.state === "Reserved" && <Badge status="warning" />}
                                                    <Tooltip placement="top" title={item.state}>
                                                        <Typography.Text ellipsis>{item.ip || item.sn}</Typography.Text>
                                                    </Tooltip>
                                                </Space>
                                            </Select.Option>
                                        )
                                    ) :
                                    RenderSelectItems(serverList, 'name')
                            )
                        }
                        {
                            serverObjectType === 'instance' &&
                            serverListCopy.filter((i: any) => i.is_instance).map((item: any) => {
                                let ip = BUILD_APP_ENV ? item.private_ip : item.pub_ip
                                return (
                                    <Select.Option value={item.id} key={item.id}>
                                        {ip ? (
                                            ~item.instance_name.indexOf(' / ') ?
                                                item.instance_name :
                                                <Tooltip
                                                    placement='topLeft'
                                                    overlayInnerStyle={{ width: 320 }}
                                                    title={
                                                        <div style={{ wordBreak: 'break-all' }}>
                                                            {item.state === "Available" && <Badge status="success" />}
                                                            {item.state === "Occupied" && <Badge status="error" />}
                                                            {item.state === "Reserved" && <Badge status="warning" />}
                                                            {ip} / {item.instance_name}
                                                        </div>
                                                    }
                                                >
                                                    <Typography.Text ellipsis>
                                                        {item.state === "Available" && <Badge status="success" />}
                                                        {item.state === "Occupied" && <Badge status="error" />}
                                                        {item.state === "Reserved" && <Badge status="warning" />}
                                                        {ip} / {item.instance_name}
                                                    </Typography.Text>
                                                </Tooltip>
                                        ) : item.instance_name}
                                    </Select.Option>
                                )
                            })
                        }
                        {
                            serverObjectType === 'setting' &&
                            RenderSelectItems(serverList.filter((i: any) => !i.is_instance), 'template_name')
                        }
                    </Select>
                </Form.Item>
            </Form.Item>
        )
        return <></>
    }, [serverListCopy, serverList])

    return renderServerItem
}
export default ServerObjectSelect