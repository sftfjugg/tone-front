import React, { useContext, useState, useEffect, useRef, memo, useMemo } from 'react';
import { Popconfirm, Empty, Row, Button } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { ReportContext } from '../Provider';
import ReportTestFunc from './ReportTestFunc';
import { ReactComponent as TestGroupIcon } from '@/assets/svg/Report/TestGroup.svg';
import { GroupItemText } from './EditPerfText';
import Performance from './TestDataChild/PrefReview'
import _ from 'lodash';
import { useScroll } from 'ahooks';
import Identify from '@/pages/WorkSpace/TestAnalysis/AnalysisResult/components/Identify';
import { simplify, deleteMethod } from './ReportFunction'
import styled from 'styled-components';
import {
    ModuleWrapper,
    TestDataTitle,
    SubTitle,
    Summary,
    Group,
    TestGroup,
    TestWrapper,
    TestItemText,
    PerfGroupTitle,
    CloseBtn,
} from '../ReportUI';

const GroupBar = styled.div<{ width: number, y: number }>`
    background: #fff;
    position: absolute;
    top: 57px;
    height: 50px;
    border: 1px solid rgba(0,0,0,0.10);
    z-index: 5;
    width:${({ width }) => width || 0}px;
    transform:translateY(${({ y }) => y || 0}px);
`

const GroupBarWrapper: React.FC<any> = (props) => {
    const { groupRowRef, parentDom, groupLen, envData } = props
    const { top } = useScroll(document.querySelector('#report-body-container') as any)
    const floatRow = groupRowRef.current
    const testDataEle = parentDom.current

    if (!floatRow && !testDataEle) return <></>
    const testOffset = (testDataEle as any).offsetTop || 0
    const width = floatRow?.offsetWidth
    const visible = top > (testOffset + floatRow.offsetTop)

    if (visible) {
        return (
            <GroupBar
                width={width}
                y={top - testOffset - floatRow.offsetTop}
            >
                 <Summary style={{ border: 'none', paddingLeft: 34, paddingRight: 31 }}>
                        <Group>
                            <PerfGroupTitle gLen={groupLen}><FormattedMessage id="report.comparison.group.name"/></PerfGroupTitle>
                            <Identify envData={envData} group={groupLen} isData={true}/>
                        </Group>
                    </Summary>
            </GroupBar>
        )
    } else {
        return <></>
    }
}

const ReportTestPref = () => {
    const { formatMessage } = useIntl()
    const { btnState, obj, setObj, envData, domainResult, groupLen, isOldReport } = useContext(ReportContext)
    const testDataRef = useRef(null)
    const groupRowRef = useRef<any>(null)
    const [btnName, setBtnName] = useState<string>('')
    const [btn, setBtn] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<any>([])

    const data = useMemo(() => {
        setBtn(domainResult.perf_conf?.show_type === 'list')
        if (Array.isArray(domainResult.perf_item)) {
            return domainResult.perf_item
        }
        return []
    }, [domainResult])

    const switchMode = () => {
        setBtn(!btn)
    }

    useEffect(() => {
        setBtnName(btn ? 'chart': 'table')
    }, [btn])

    useEffect(() => {
        setDataSource(data)
    }, [data])

    /* 
        ** 删除测试项 测试组
    */
    const handleDelete = (name: string, domain: any, rowKey: any) => {
        setDataSource(deleteMethod(dataSource, name, domain, rowKey))
    }

    useEffect(() => {
        let new_pref_data: any = []
        if (dataSource && !!dataSource.length) {
            dataSource.map((item: any, idx: number) => {
                if (item.is_group) {
                    item.list?.map((child: any, listId: number) => {
                        let suite_list = simplify(child, idx, listId, 'group', isOldReport)
                        new_pref_data.push({
                            name: `${item.name}:${child.name}`,
                            suite_list,
                        })
                    })
                } else {
                    let suite_list = simplify(item, idx, 0, 'item', isOldReport)
                    new_pref_data.push({
                        name: item.name,
                        suite_list,
                    })
                }
            })
        }
        obj.test_item.perf_data = new_pref_data
        setObj({
            ...obj,
        })
    }, [dataSource])

    return (
        <ModuleWrapper 
            style={{
                width: groupLen > 3 ? groupLen * 390 : 1200,
                position: 'relative'
            }}
            ref={testDataRef}
            id="test_data"
            className="position_mark"
        >
            <SubTitle><span className="line"></span><FormattedMessage id="report.test.data"/></SubTitle>
            <Summary ref={groupRowRef} style={{ paddingLeft: 34, paddingRight: 31 }}>
                <Group>
                    <PerfGroupTitle gLen={groupLen}><FormattedMessage id="report.comparison.group.name"/></PerfGroupTitle>
                    <Identify envData={envData} group={groupLen} isData={true}/>
                </Group>
            </Summary>
            <GroupBarWrapper
                groupRowRef={groupRowRef}
                parentDom={testDataRef}
                envData={envData}
                groupLen={groupLen}
            />
            {
                (domainResult.is_default || (!domainResult.is_default && domainResult.need_perf_data)) &&
                <>
                    <Row justify='space-between'>
                        <TestDataTitle><FormattedMessage id="performance.test"/></TestDataTitle>
                        <Button onClick={switchMode} style={{ marginTop: 12 }}>
                            {btnName === 'chart' ? <FormattedMessage id="report.chart.btn" /> : <FormattedMessage id="report.table.btn" />}
                        </Button>
                    </Row>
                    <TestWrapper id="perf_item" className="position_mark">
                        {
                            Array.isArray(dataSource) && !!dataSource.length ?
                                dataSource?.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        {
                                            item.is_group ?
                                                <>
                                                    <TestGroup id={`pref_item-${item.rowKey}`} className="tree_mark">
                                                        <TestGroupIcon style={{ marginLeft: 12, verticalAlign: 'middle' }} />
                                                        <TestItemText>
                                                            <GroupItemText
                                                                name={item.name}
                                                                rowKey={item.rowKey}
                                                                btn={btnState}
                                                                dataSource={dataSource}
                                                                setDataSource={setDataSource}
                                                            />
                                                        </TestItemText>
                                                        <Popconfirm
                                                            title={<FormattedMessage id="delete.prompt" />}
                                                            onConfirm={() => handleDelete('item', item.name, item.rowKey)}
                                                            cancelText={<FormattedMessage id="operation.cancel" />}
                                                            okText={<FormattedMessage id="operation.delete" />}
                                                        >
                                                            {btnState && <CloseBtn />}
                                                        </Popconfirm>
                                                    </TestGroup>
                                                    {
                                                        item.list.map((child: any, id: number) => {
                                                            return (
                                                                <div key={id}>
                                                                    <Performance
                                                                        child={child}
                                                                        name="group"
                                                                        btn={btn}
                                                                        id={child.rowKey}
                                                                        dataSource={dataSource}
                                                                        setDataSource={setDataSource}
                                                                        onDelete={handleDelete}
                                                                    />
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </>
                                                :
                                                <Performance
                                                    child={item}
                                                    name="item"
                                                    btn={btn}
                                                    id={item.rowKey}
                                                    dataSource={dataSource}
                                                    setDataSource={setDataSource}
                                                    onDelete={handleDelete}
                                                />
                                        }
                                    </div>
                                ))
                                :
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </TestWrapper>
                </>
            }
            {domainResult.is_default && <ReportTestFunc />}
            {(!domainResult.is_default && domainResult.need_func_data) && <ReportTestFunc />}
        </ModuleWrapper>
    )
}
export default memo(ReportTestPref);