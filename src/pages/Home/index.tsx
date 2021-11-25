import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react'
import styles from './index.less'
import { history, useModel, Access, useAccess } from 'umi'
import { Layout, Row, Col, Button, Table, Space, Typography, notification, message, Empty, Tag, Carousel, Tabs, Input, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
// import JoinPopover from './Component/JoinPopover'
import { enterWorkspaceHistroy, queryHomeWorkspace, queryWorkspaceTopList } from '@/services/Workspace'
import { ReactComponent as HomeBackground } from '@/assets/svg/home/home_background.svg';
import { ReactComponent as PublicIcon } from '@/assets/svg/public.svg'
import { ReactComponent as NPublicIcon } from '@/assets/svg/no_public.svg'
import LogoEllipsis from '@/components/LogoEllipsis/index'
import _ from 'lodash'
import { queryHelpDocList } from '../HelpDocument/services'
import HomePush from './Component/HomePush'
// import { ReactComponent as WsPrivate } from '@/assets/svg/ws_private.svg'
import PopoverEllipsis from '@/components/Public/PopoverEllipsis'
import AvatarCover from '@/components/AvatarCover'
import CommonPagination from '@/components/CommonPagination'
import { requestCodeMessage } from '@/utils/utils'

const { TabPane } = Tabs;
const { Paragraph } = Typography;

type wsParmas = {
    scope: string,
    keyword?: string,
    page_size: number | undefined,
    page_num: number
}

const EllipsisRect = (props: any): JSX.Element => {
    const { text, wsPublic } = props
    const ellipsis = useRef<any>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        let isShow = false
        if (ellipsis && ellipsis.current) {
            const clientWidth = ellipsis.current.clientHeight
            const scrollWidth = ellipsis.current.scrollHeight
            isShow = clientWidth < scrollWidth
            setShow(isShow)
        }
    }, [wsPublic])

    return (
        <span className={styles.ws_description} id='wsdescription' ref={ellipsis}>
            {show ?
                <Tooltip title={text} overlayStyle={{ wordBreak: 'break-all' }}>
                    <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>
                </Tooltip >
                :
                text
            }
        </span>
    )
}
export default (): React.ReactNode => {
    const [wsData, setWsData]: Array<any> = useState([])
    const [wsPublic, setWsPublic] = useState<Array<unknown>>([])
    const [currentNum, setCurrentNum] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const { initialState } = useModel('@@initialState');
    const { user_id, ws_role_title } = initialState?.authList || {}
    const [wsParmas, setWsPasmas] = useState<wsParmas>({
        page_size: 50,
        page_num: 1,
        scope: ws_role_title == 'ws_tourist' ? 'all' : 'history'
    })
    const access = useAccess();
    document.title = 'T-One'
    const [helps, setHelps] = useState<Array<any>>([])
    const homePushRef = useRef<any>(null);
    /**
     * @author wb-cy860729
     */
    const wsTableData = async (parmas: wsParmas) => {
        setLoading(true)
        const data = await queryHomeWorkspace(parmas)
        const { code, msg } = data
        if (code === 200) {
            if (parmas.scope === 'public') {
                setWsPublic(_.get(data, 'data') || [])
                return
            }
            setWsData(data || [])
        }
        else
            msg && message.error(msg)
        setLoading(false)
    }

    const [topWs, setTopWs] = useState([])

    const queryWsTopList = async () => {
        const { data, code } = await queryWorkspaceTopList()
        if (code === 200) setTopWs(data)
    }
    const handleTabChange = (key: string) => {
        const { keyword } = wsParmas
        setWsPasmas({ page_size: 50, page_num: 1, scope: key, keyword })
    }
    /**
     * @author wb-cy860729
     */
    const wsDom = () => {
        const allKey = [{ tab: '全部Workspace', key: 'all' }, { tab: '最近访问', key: 'history' }, { tab: '我加入的', key: 'joined' }, { tab: '我创建的', key: 'created' }]
        const tourKey = [{ tab: '全部Workspace', key: 'all' }, { tab: '我加入的', key: 'joined' }, { tab: '我创建的', key: 'created' }]
        const arrKey = ws_role_title === 'ws_tourist' ? tourKey : allKey
        return <>
            <Tabs defaultActiveKey="history" onChange={handleTabChange}>
                {
                    arrKey.map((item) => {
                        return <TabPane tab={item.tab} key={item.key} />
                    })
                }
            </Tabs>
        </>
    }
    /**
     * @author wb-cy860729
     */
    const onSearch = (value: string) => {
        setWsPasmas({ ...wsParmas, keyword: value, page_num: 1 })
    }

    const wsHelpDoc = async () => {
        const { data } = await queryHelpDocList({ page_size: 1000 })
        if (Array.isArray(data)) {
            setHelps(data)
        }
    }

    useEffect(() => {
        notification.config({ top: 88 })
        queryWsTopList()
        wsTableData({ scope: 'public', page_size: 999, page_num: 1 })
        wsHelpDoc()

        const homePushFlag = localStorage.getItem('homePush_Flag')
        if (!homePushFlag) {
            homePushRef?.current?.show({ initial: true })
            localStorage.setItem('homePush_Flag', '1')
        }
    }, [])
    /**
     * @author wb-cy860729
     */
    useEffect(() => {
        wsTableData(wsParmas)
    }, [wsParmas])

    const columns: Array<any> = [
        {
            title: 'show_name',
            dataIndex: 'show_name',
            width: 210,
            render: (_: any, record: any) => {
                const id = record && record.id
                if (record.is_member || record.is_public)
                    return (
                        <div
                            onClick={
                                async () => {
                                    const { code, msg, first_entry } = await enterWorkspaceHistroy({ ws_id: id })
                                    if (code === 200) {
                                        if (first_entry && record.creator === user_id) {
                                            history.push(`/ws/${id}/workspace/initSuccess`)
                                        } else {
                                            history.push(`/ws/${id}/dashboard`)
                                        }
                                    }
                                    else requestCodeMessage(code, msg)
                                }
                            }
                            className={styles.showName}
                        >
                            <LogoEllipsis props={record} size={'small'} />
                        </div>
                    )
                // else return <JoinPopover {...record} type={'show_name'} />
                else {
                    return (
                        <div onClick={() => _.is_member ? history.push(`/ws/${_.id}/dashboard`) : message.warning('无权限进入')} className={styles.showName}>
                            <LogoEllipsis props={record} size={'small'} />
                        </div>
                    )

                }
            }
        },
        {
            title: 'owner_name',
            dataIndex: 'owner_name',
            width: 175,
            render: (_: any) => (
                <Space>
                    <UserOutlined />
                    <Typography.Text>{_}</Typography.Text>
                </Space>
            )
        },
        {
            title: 'description',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: 'is_public',
            dataIndex: 'is_public',
            width: 120,
            render: (_: any) => (
                <Space>
                    {_ ? <PublicIcon /> : <NPublicIcon />}
                    {_ ? '公开' : '私密'}
                </Space>
            )
        },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_: any) => {
                if (_.is_member || _.is_public)
                    return (
                        <Button
                            onClick={
                                async () => {
                                    const { code, msg, first_entry } = await enterWorkspaceHistroy({ ws_id: _.id })
                                    if (code === 200) {
                                        if (first_entry && _.creator === user_id) {
                                            history.push(`/ws/${_.id}/workspace/initSuccess`)
                                        } else {
                                            history.push(`/ws/${_.id}/dashboard`)
                                        }
                                    }
                                    else requestCodeMessage(code, msg)
                                }
                            }
                        >
                            进入
                        </Button>
                    )
                else {
                    return (
                        <Button
                            onClick={
                                () => _.is_member ?
                                    history.push(`/ws/${_.id}/dashboard`) :
                                    history.push({ pathname: '/401', state: _.id })
                            }
                        >
                            进入
                        </Button>
                    )

                }
            }
        }
    ]

    const [layoutHeight, setLayoutHeight] = useState(innerHeight)
    const [layoutWidth, setLayoutWidth] = useState(innerWidth)
    const windowHeight = () => {
        setLayoutHeight(innerHeight)
        setLayoutWidth(innerWidth)
    }

    useEffect(() => {
        windowHeight()
        window.addEventListener('resize', windowHeight)
        return () => {
            window.removeEventListener('resize', windowHeight)
        }
    }, [])

    const avatarStyle = {
        borderRadius: 6,
        fontSize: 40,
        width: 80,
        height: 80,
        lineHeight: '80px',
        display: 'inline-block',
        marginRight: 10
    }
    const docType = { 'mustRead': '必看', 'course': '教程', 'docs': '文档' }
    const noticeType = { 'maintain': '维护', 'notice': '通知', 'upgrade': '升级', 'stop': '暂停' }
    let helpDocAll: any = []
    let noticeAll: any = []
    if (_.isArray(helps)) {
        helps.forEach((item: any) => {
            if (item?.doc_type === 'help_doc' && item?.active) helpDocAll.push(item)
            if (item?.doc_type === 'notice' && item?.active) noticeAll.push(item)
        })
    }

    useEffect(() => {
        const aDoms = document.querySelectorAll('.notice_content')
        aDoms.forEach((item: any, index: number) => {
            let str = noticeAll[index]?.brief_content || ''
            str = _.replace(str, '<p><br></p>', '')
            item.innerHTML = str
        })
    }, [helps])
    const handleCarouseClick = (num: number) => {
        if (currentNum === 0 && num === -1) return
        if (currentNum === myWsGroup.length - 1 && num === 1) return
        setCurrentNum(currentNum + num)
    }

    const myWsGroup = useMemo(() => {
        let list: any = []

        topWs.forEach((obj, index) => {
            const num = Math.floor(index / 6)
            const remain = index % 6
            if (index % 6 === 0) list[num] = []
            list[num][remain] = obj
        })

        return list
    }, [topWs])

    return (
        <Layout className={styles.content} style={{ minHeight: layoutHeight - 50, height: layoutHeight - 50, overflowY: 'scroll' }}>
            <HomePush ref={homePushRef} />
            {
                <div className={styles.welcome_box} style={{ marginRight: layoutWidth <= 1280 ? 20 : 0 }}>
                    <Row className={styles.welcome}>
                        <Typography.Title level={2} style={{ fontWeight: 'normal' }}>Hi, 欢迎使用自动化测试系统 T-One !</Typography.Title>
                        <Row>
                            <Space>
                                <Typography.Text style={{ color: 'rgba(0,0,0,0.50)' }}>新一代自动化测试系统T-One(test in one),可以进行一站式自动化测试集成、管理、执行、分析；方便扩展各种产品测试。</Typography.Text>
                                <span className={styles.homePushButton} onClick={()=> { homePushRef?.current?.show({ initial: false}) }}>
                                    查看系统介绍
                                </span>
                            </Space>
                        </Row>
                    </Row>
                    <div className={styles.home_push_background_img}>
                        <HomeBackground />
                    </div>
                </div>
            }
            <Row gutter={20} justify="space-between" style={{ marginLeft: 0, marginRight: 0, minWidth: 1240 }}>
                <div style={{ display: 'inline-block', width: 'calc(100% - 356px)' }} id='bannerLayout'>

                    <Layout.Content className={styles.banner}>
                        <Row className={styles.title} style={{ padding: '0 20px' }} align="middle" justify="space-between">
                            <Typography.Text>推荐Workspace</Typography.Text>

                        </Row>
                        {/* <Row style={{ padding: '5px 4px 5px 20px',position: 'relative' }}> */}
                        <Row className={styles.ws_row} style={{ paddingBottom: myWsGroup.length > 1 ? 10 : 5 }}>
                            <Carousel>
                                {
                                    myWsGroup.map((arr: any, number: any) => {
                                        return (
                                            // <div className={styles.ws_group} style={{ left: leftVal, opacity: number === currentNum ? 1 : 0 }} key={number}>
                                            <div className={styles.ws_group} key={number}>
                                                {arr.map(
                                                    (item: any, index: number) => (
                                                        <div
                                                            className={styles.workspace}
                                                            key={index}
                                                            style={{
                                                                marginRight: (index + 1) % 3 ? 16 : 0,
                                                                // width: wsWidth > 0 ? wsWidth : `calc(100% / 3 - 17px) `
                                                            }}
                                                            // style={{ marginRight: 16 }}
                                                            onClick={async () => {
                                                                const { code, msg, first_entry } = await enterWorkspaceHistroy({ ws_id: item.id })
                                                                if (code === 200) {
                                                                    if (first_entry && item.creator === user_id) {
                                                                        history.push(`/ws/${item.id}/workspace/initSuccess`)
                                                                    } else {
                                                                        history.push(`/ws/${item.id}/dashboard`)
                                                                    }
                                                                }
                                                                else requestCodeMessage(code, msg)
                                                            }}
                                                        >
                                                            <Row style={{ width: '100%', height: '100%' }}>
                                                                <Col span={24} style={{ alignItems: 'flex-start', display: 'flex', height: 48, marginBottom: 8 }}>
                                                                    <AvatarCover size={'middle'} style={avatarStyle} {...item} />
                                                                    <div className={styles.right_part}>
                                                                        <b className={styles.ws_name}>{item.show_name}</b>
                                                                        <Space>
                                                                            <Typography.Text type="secondary" ellipsis={true}>{item.owner_name} </Typography.Text>
                                                                        </Space>
                                                                        <EllipsisRect text={item.description} wsPublic={wsPublic} />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )
                                    })
                                }
                            </Carousel>
                            {/* {myWsGroup.length > 1 && <LeftOutlined className={styles.left_outline} style={{opacity: currentNum === 0 ? '0.3' : '0.8'}} onClick={_.partial(handleCarouseClick,-1)}/>}
                            {myWsGroup.length > 1 && <RightOutlined className={styles.right_outline} style={{opacity: currentNum === myWsGroup.length - 1 ? '0.3' : '0.8'}} onClick={_.partial(handleCarouseClick,1)}/>} */}
                        </Row>
                    </Layout.Content>
                    <Layout.Content className={styles.banner}>
                        <Row className={styles.ws_list_title} style={{}}>
                            {wsDom()}
                            <div>
                                <Space align='end'>
                                    <Input.Search placeholder="请输入搜索关键字" onSearch={onSearch} style={{ width: 200 }} allowClear={true} />
                                    <Access accessible={access.canSuperAdmin()}>
                                        <Button onClick={() => history.push('/workspace/create')}>新建Workspace</Button>
                                    </Access>
                                </Space>
                            </div>
                        </Row>
                        <Row>
                            <Table
                                size="small"
                                rowKey="id"
                                loading={loading}
                                className={styles.workspace_list}
                                dataSource={wsData.data}
                                columns={columns}
                                showHeader={false}
                                pagination={false}
                            />
                            <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                <CommonPagination
                                    pageSize={wsData.page_size}
                                    total={wsData.total}
                                    currentPage={wsData.page_num}
                                    onPageChange={
                                        (page, size) => setWsPasmas({ ...wsParmas, page_size: size, page_num: page })
                                    }
                                />
                            </Col>
                        </Row>
                    </Layout.Content>
                </div>
                <div style={{ display: 'inline-block', width: 336 }}>

                    <Row>
                        <div className={styles.notice}>
                            <div className={styles.title}
                            >公告
                                <div
                                    onClick={() => {
                                        history.push(`/notice`)
                                    }}
                                    className={styles.helps_list_more}>
                                    查看全部
                                </div>

                            </div>
                            <div className={styles.content} style={{ height: !noticeAll.length ? 110 : 'auto', paddingBottom: !noticeAll.length ? 0 : 20 }}>
                                {noticeAll.length !== 0 && <div className={styles.notice_item}>
                                    {
                                        noticeAll.slice(0, 2).map(
                                            (item: any) => (
                                                <div
                                                    key={item.id}
                                                    className={styles.notice_item_left}
                                                    onClick={() => {
                                                        history.push(`/notice/${item.id}`)
                                                    }}>
                                                    <Tag color={item && item.order_id === 1 ? '#FF4D4D' : ''} style={{ color: item && item.order_id === 1 ? '#fff' : 'rgba(0,0,0,0.65)' }} className={styles.notice_tag}>{item && noticeType[item.tags] || '-'}</Tag>
                                                    <div className={styles.notice_title}
                                                    >
                                                        <PopoverEllipsis title={item.title}>
                                                            <>
                                                                {item.title}
                                                            </>
                                                        </PopoverEllipsis>
                                                        {/*有用*/}
                                                        {/* <div className={'notice_content'} /> */}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }

                                </div>

                                }

                                {
                                    !noticeAll.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />
                                }
                            </div>
                        </div>
                    </Row>
                    <div className={styles.helps}>
                        <div className={styles.title}>
                            使用帮助
                            <div
                                onClick={() => {
                                    history.push(`/help_doc`)
                                }}
                                style={{ marginRight: 0 }}
                                className={styles.helps_list_more}>
                                查看全部
                            </div>
                        </div>
                        <div className={styles.helps_box} style={{ height: !noticeAll.length ? 90 : 'auto' }}>

                            {helpDocAll.length !== 0 && <div className={styles.helps_list}>
                                {
                                    helpDocAll.slice(0, 4).map(
                                        (item: any) => (
                                            <div
                                                key={item.id}
                                                className={styles.helps_list_item}
                                                onClick={() => {
                                                    history.push(`/help_doc/${item.id}`)
                                                }}>
                                                <Tag color={item && item.order_id === 1 ? '#108ee9' : ''} style={{ color: item && item.order_id === 1 ? '#fff' : 'rgba(0,0,0,0.65)' }} className={styles.notice_tag}>{item && docType[item.tags] || '-'}</Tag>
                                                <div className={styles.notice_title}>
                                                    <PopoverEllipsis title={item.title}>
                                                        <>
                                                            {item.title}
                                                        </>
                                                    </PopoverEllipsis>
                                                </div>

                                            </div>
                                        )
                                    )
                                }
                            </div>}
                            {
                                !helpDocAll.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无帮助" />
                            }
                        </div>
                    </div>

                </div>
            </Row>
        </Layout>
    )
}
