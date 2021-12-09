import React, { useContext, useState, useEffect, useRef, memo, useMemo } from 'react';
import { Space, Popconfirm, Empty } from 'antd';
import { ReportContext } from '../Provider';
import ReportTestFunc from './ReportTestFunc';
import { ReactComponent as TestGroupIcon } from '@/assets/svg/Report/TestGroup.svg';
import { SettingTextArea } from './EditPublic';
import Performance from './TestDataChild/prefIndex'
import _ from 'lodash';
import { useScroll } from 'ahooks';
import Identify from '@/pages/WorkSpace/TestAnalysis/AnalysisResult/components/Identify';
import produce from 'immer'
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
    // willChange: transform;
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
                            <PerfGroupTitle gLen={groupLen}>对比组名称</PerfGroupTitle>
                            <Identify envData={envData} group={groupLen} isData={true}/>
                        </Group>
                    </Summary>
            </GroupBar>
        )
    }else{
        return <></>
    }
    
}

const ReportTestPref = () => {
    const { btnState, obj, setObj, allGroupData, envData, domainResult, btnConfirm, groupLen } = useContext(ReportContext)
    // let group = allGroupData?.length
    const testDataRef = useRef(null)
    const data = useMemo(() => {
        if (Array.isArray(domainResult.perf_item)) {
            return domainResult.perf_item
        }
    }, [domainResult])

    const [dataSource, setDataSource] = useState<any>([])
    useEffect(() => {
        setDataSource(data)
    }, [data])

    /* 
        ** 编辑测试项 测试组
    */
    const filterFieldData = (data: any, name: string, field: any, rowKey: string) => {
        return produce(
            data,
            (draftState: any) => {
                draftState.list = data.list.map((i: any) => {
                    if (!i.is_group && i.rowKey == rowKey) {
                        return produce(i, (draft: any) => {
                            draft.name = field
                        })
                    }
                    return i
                })
            }
        )
    }

    const filterData = (item: any, name: string, field: any, rowKey: string) => {
        if (item.rowKey == rowKey)
            return produce(item, (draft: any) => {
                draft.name = field
            })
        if (item.is_group)
            return filterFieldData(item, name, field, rowKey)
        return item
    }
    const handleFieldChange = (field: any, name: string, rowKey: string) => {
        setDataSource(dataSource.map((item: any) => filterData(item, name, field, rowKey)))
    }
    const filterGroup = (item: any, name: string, field: any, rowKey: string) => {
        if (item.rowKey == rowKey) {
            return item.name = field
        }
        return item
    }
    const handleGroupChange = (field: any, name: string, rowKey: string) => {
        setDataSource(dataSource.map((item: any) => filterGroup(item, name, field, rowKey)))
    }
    /* 
        ** 删除测试项 测试组
    */
    const handleDelete = (name: string, domain: any, rowKey: any) => {
        if (name === 'group') {
            setDataSource(dataSource.map((i: any, idx: number) => {
                let ret: any = []
                if (i.is_group) {
                    i.list.map((b: any) => {
                        if (b.rowKey === rowKey) {
                            ret = i.list.filter((c: any) => c.name !== domain)
                        }
                    })
                    return {
                        ...i,
                        list: ret,
                    }
                }
                return {
                    ...i,
                }
            }))
        } else {
            setDataSource(dataSource.filter((item: any) => item.name !== domain && item.rowKey !== rowKey))
        }
    }
    const transField = (conf: any, key: string) => {
        const { conf_source } = conf
        return conf[key] ? conf[key] : conf_source ? conf_source[key] : ''
    }
    const simplify = (child: any, idx: number, listId: number, name: string) => {
        let suite_list: any = []
        child.list?.map((suite: any, suiteId: number) => {
            const { 
                suite_id, 
                suite_name,
                test_suite_description = '-',
                test_env,
                test_description,
                test_conclusion,
            } = suite
            let conf_list: any = []
            suite.conf_list.map((conf: any, index: number) => {
                conf_list.push({
                    conf_id: conf.conf_id,
                    conf_name: conf.conf_name,
                    conf_source: {
                        is_job: transField(conf, 'is_job'),
                        obj_id: transField(conf, 'obj_id'),
                    },
                    compare_conf_list: conf.conf_compare_data,
                    metric_list: conf.metric_list
                })
            })
            suite_list.push({
                suite_id,
                suite_name,
                // show_type: !switchReport ? 0 : describe?.show_type == 'list' ? 0 : 1,
                test_suite_description,
                test_env,
                test_description,
                test_conclusion,
                conf_list,
                rowKey: name == 'group' ? `${idx}-${listId}-${suiteId}` : `${idx}-${suiteId}`
            })
        })
        return suite_list;
    }
    useEffect(() => {
        let new_pref_data: any = []
        if (dataSource && !!dataSource.length) {
            dataSource.map((item: any, idx: number) => {
                if (item.is_group) {
                    item.list?.map((child: any, listId: number) => {
                        let suite_list =  simplify(child, idx, listId, 'group')
                        new_pref_data.push({
                            name: `${item.name}:${child.name}`,
                            suite_list,
                        })
                    })
                } else {
                    let suite_list = simplify(item, idx, 0, 'item')
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

    const groupRowRef = useRef<any>(null)

    return (
        <ModuleWrapper style={{ width: groupLen > 3 ? groupLen * 390 : 1200, position: 'relative' }} id="test_data" ref={testDataRef}>
            <SubTitle><span className="line"></span>测试数据</SubTitle>
            <Summary ref={groupRowRef} style={{ paddingLeft: 34, paddingRight: 31 }}>
                <Group>
                    <PerfGroupTitle gLen={groupLen}>对比组名称</PerfGroupTitle>
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
                    <TestDataTitle id="perf_item">性能测试</TestDataTitle>
                    <TestWrapper>
                        {
                            Array.isArray(dataSource) && !!dataSource.length ?
                                dataSource?.map((item: any, idx: number) => {
                                    return (
                                        <div key={idx}>
                                            {
                                                item.is_group ?
                                                    <>
                                                        <TestGroup id={`pref_item-${item.rowKey}`}>
                                                            <TestGroupIcon style={{ marginLeft: 12, verticalAlign: 'middle' }} />
                                                            <TestItemText>
                                                                <SettingTextArea
                                                                    name={item.name}
                                                                    btnConfirm={btnConfirm}
                                                                    isInput={true}
                                                                    fontStyle={{
                                                                        fontSize: 14,
                                                                        fontFamily: 'PingFangSC-Medium',
                                                                        color: 'rgba(0,0,0,0.85)'
                                                                    }}
                                                                    btn={btnState}
                                                                    onOk={(val: any) => handleGroupChange(val, item.name, item.rowKey)}
                                                                />
                                                            </TestItemText>
                                                            <Popconfirm
                                                                title='确认要删除吗！'
                                                                onConfirm={() => handleDelete('item', item.name, item.rowKey)}
                                                                cancelText="取消"
                                                                okText="删除"
                                                            >
                                                                {btnState && <CloseBtn />}
                                                            </Popconfirm>
                                                        </TestGroup>
                                                        {
                                                            item.list.map((child: any, id: number) => {
                                                                return (
                                                                    <Performance
                                                                        child={child}
                                                                        name="group"
                                                                        key={id}
                                                                        id={child.rowKey}
                                                                        dataSource={dataSource}
                                                                        setDataSource={setDataSource}
                                                                        onDelete={handleDelete}
                                                                        onChange={handleFieldChange}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </> : <Performance
                                                        child={item}
                                                        name="item"
                                                        id={item.rowKey}
                                                        dataSource={dataSource}
                                                        setDataSource={setDataSource}
                                                        onDelete={handleDelete}
                                                        onChange={handleFieldChange}
                                                    />
                                            }
                                        </div>
                                    )
                                })
                                :
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </TestWrapper>
                </>
            }
            {
                domainResult.is_default && <ReportTestFunc />
            }
            {
                (!domainResult.is_default && domainResult.need_func_data) && <ReportTestFunc />
            }
        </ModuleWrapper>
    )
}
export default memo(ReportTestPref);