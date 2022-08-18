import React, { useState } from 'react'
import { Tabs } from 'antd'

import JobModal from './JobModal'
import JobType from './JobType'
import { history, useAccess, Access } from 'umi'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useHeaderContext } from '../Provider'

const JobTypeTab: React.FC<Record<string, any>> = ({ onOk }) => {
    const { ws_id } = useHeaderContext()
    const [tab, setTab] = useState('1')
    const [testType, setTestType] = useState('全部')
    const handleTabClick = (tab: string) => {
        setTab(tab)
        setTestType('全部')
    }
    const access = useAccess()
    const handleCreateJobType = () => {
        onOk()
        history.push({ pathname: `/ws/${ws_id}/job/create` })
    }
    const renderChild = (
        <>
            <PlusOutlined style={{ fontSize: 9, color: '#1890FF', marginRight: 6, transform: 'translateY(-1px)' }} />
            <span className={styles.create_job_type_text}>新建job类型</span>
        </>
    )
    const operations = (
        <Access accessible={access.WsMemberNoPermission()}>
            <div onClick={handleCreateJobType}>{renderChild}</div>
        </Access>
    );
    const typeName = (type: string) => {
        switch (type) {
            case '功能测试': return 'functional'
            case '性能测试': return 'performance'
            case '业务测试': return 'business'
            case '稳定性测试': return 'stability'
            default: return 'all'
        }
    }
    const handleJobTypeData = (dataSource: []): any[] => {
        if (testType === '全部') return dataSource
        const type = tab === '1' ? typeName(testType) : testType
        return dataSource.filter((item: any) => item && item.test_type === type)
    }

    const testTypeDom = () => {
        const type = ['全部', '功能测试', '性能测试']
        return (
            <ul className={styles.test_type}>
                {
                    type.map((value, index) => <li
                        key={index}
                        onClick={() => setTestType(value)}
                        style={{ color: testType === value ? '#1890ff' : 'rgba(0,0,0,0.85)' }}>
                        {value}
                    </li>)
                }
            </ul>
        )
    }

    React.useEffect(() => {
        setTestType("全部")
    }, [ws_id])

    return (
        <Tabs
            defaultActiveKey={tab}
            tabBarExtraContent={tab == '1' ? operations : <></>}
            className={styles.job_drop_menu}
            onTabClick={handleTabClick}
            style={{ minWidth: 468, maxWidth: 912 }}
        >
            <Tabs.TabPane tab="通过Job类型新建" key="1">
                {testTypeDom()}
                <JobType onOk={onOk} getData={handleJobTypeData} />
            </Tabs.TabPane>
            {access.IsWsSetting() &&
                <Tabs.TabPane tab="通过模板新建" key="2">
                    {testTypeDom()}
                    <JobModal onOk={onOk} getData={handleJobTypeData} testType={testType} />
                </Tabs.TabPane>
            }
        </Tabs>
    )
}

export default JobTypeTab