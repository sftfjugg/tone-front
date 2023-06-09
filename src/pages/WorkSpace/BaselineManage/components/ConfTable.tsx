import { Table, Layout, Spin, Row, Typography } from 'antd'
import React, { useRef, useEffect } from 'react'
import { useLocation } from 'umi'

import { queryFunctionalBaseline, queryPerformanceBaseline } from '@/pages/WorkSpace/BaselineManage/services'
import _ from 'lodash'
import treeSvg from '@/assets/svg/tree.svg'

import FailCase from './FailCase'
import MetricList from "./Metric"

// 性能三级
type Iprops = Record<string, any>

const ConfTable: React.FC<Iprops> = (props) => {
    const { test_type, baseline_id, test_suite_id, server_sn } = props
    const { query }: any = useLocation()

    const background = `url(${treeSvg}) center center / 38.6px 32px `
    const PAGE_DEFAULT_PARAMS: any = { test_type, baseline_id, test_suite_id, server_sn }  // 有用
    // 性能基线

    const [listParams, setListParams] = React.useState(PAGE_DEFAULT_PARAMS)
    const [data, setData] = React.useState<[]>([])
    const [loading, setLoading] = React.useState(true)

    const failCase: any = useRef(null)
    const metric: any = React.useRef(null)

    const columns = [{
        dataIndex: 'test_case_name',
        title: 'Test Conf',
        key: 'test_case_name',
        render: (text: any) => {
            return (
                <Typography.Link ellipsis>
                    {text}
                </Typography.Link>
            )
        }
    }]

    const openDrawer = (record: any) => {
        if (test_type === 'functional') {
            failCase.current?.show(record)
            return
        }
        metric.current?.show(record)
    }

    const getThirdDetail = async (params: any) => {
        setLoading(true)
        const { data, code } = test_type === "performance" ?
            await queryPerformanceBaseline(params) :
            await queryFunctionalBaseline(params)
        setLoading(false)

        if (code !== 200) return
        setData(data || [])
    }

    React.useEffect(() => {
        if (data && query?.test_case_id) {
            const idx = data.findIndex((p: any) => p.test_case_id === + query?.test_case_id)
            if (~idx)
                openDrawer(data?.[idx])
        }
    }, [query, data])

    useEffect(() => {
        getThirdDetail(listParams)
    }, [listParams])

    return (
        <Layout.Content>
            <Spin spinning={loading}>
                <Row justify="start">
                    {
                        !loading &&
                        <div style={{ width: 32 }}>
                            <div style={{ height: 30, width: 32, background }} />
                            <div style={{ width: 32, background, height: "calc(100% - 30px)" }} />
                        </div>
                    }
                    <div style={{ width: "calc(100% - 32px)" }}>
                        <Table
                            columns={columns}
                            dataSource={data} //  youyong
                            rowKey={'test_case_id'}
                            pagination={false}
                            size="small"
                            scroll={{ x: '100%' }}
                            onRow={(record: any) => {
                                return {
                                    onClick: () => {
                                        openDrawer(record)
                                    }, // 点击行
                                };
                            }}
                        />
                    </div>
                </Row>
                <FailCase
                    ref={failCase}
                    {...props}
                />
                <MetricList
                    ref={metric}
                    {...props}
                />
            </Spin>
        </Layout.Content>

    )
}

export default ConfTable

