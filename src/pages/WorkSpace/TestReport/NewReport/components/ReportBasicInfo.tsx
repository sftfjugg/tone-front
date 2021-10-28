import React, { useContext, memo } from 'react';
import { SettingTextArea } from './EditPublic';
import { ReportContext } from '../Provider';
import { ModuleWrapper, EditTitle, SubTitle } from '../ReportUI';
import _ from 'lodash';
const ReportBasicInfo = (props: any) => {
    const { btnState, obj, setObj, saveReportData, summaryData, btnConfirm, domainResult } = useContext(ReportContext)
    const handleChangeVal = (val: any, text: string) => {
        if (text == 'custom') {
            if (summaryData && summaryData !== undefined) {
                let summary = _.cloneDeep(summaryData)
                summary[text] = val
                obj.test_conclusion = summary
            }
        } else {
            obj[text] = val
        }
        setObj({
            ...obj,
        })
    }

    return (
        <>
            {domainResult?.is_default ?
                <>
                    <ModuleWrapper id="need_test_background">
                        <SubTitle><span className="line"></span>测试背景</SubTitle>
                        <SettingTextArea
                            name={saveReportData?.test_background}
                            btnConfirm={btnConfirm}
                            defaultHolder="请输入测试背景"
                            fontStyle={{
                                fontSize: 14,
                                fontFamily: 'PingFangSC-Regular',
                                color: 'rgba(0,0,0,0.65)',
                                whiteSpace: 'pre-line',
                            }}
                            btn={btnState}
                            onOk={(val: any) => handleChangeVal(val, 'test_background')}
                        />
                    </ModuleWrapper>
                    <ModuleWrapper id="need_test_method">
                        <SubTitle><span className="line"></span>测试方法</SubTitle>
                        <SettingTextArea
                            name={saveReportData?.test_method}
                            defaultHolder="请输入测试方法"
                            fontStyle={{
                                fontSize: 14,
                                fontFamily: 'PingFangSC-Regular',
                                color: 'rgba(0,0,0,0.65)',
                                whiteSpace: 'pre-line',
                            }}
                            btn={btnState}
                            btnConfirm={btnConfirm}
                            onOk={(val: any) => handleChangeVal(val, 'test_method')}
                        />
                    </ModuleWrapper>
                    <ModuleWrapper id="need_test_conclusion">
                        <SubTitle><span className="line"></span>测试结论</SubTitle>
                        <SettingTextArea
                            name={saveReportData?.test_conclusion?.custom}
                            btn={btnState}
                            defaultHolder="请输入测试结论"
                            btnConfirm={btnConfirm}
                            fontStyle={{
                                fontSize: 14,
                                fontFamily: 'PingFangSC-Regular',
                                color: 'rgba(0,0,0,0.65)',
                                whiteSpace: 'pre-line',
                            }}
                            onOk={(val: any) => handleChangeVal(val, 'custom')}
                        />
                    </ModuleWrapper>
                </>
                :
                <>
                    {domainResult?.need_test_background && 
                    <ModuleWrapper id="need_test_background">
                        <SubTitle><span className="line"></span>测试背景</SubTitle>
                        <SettingTextArea
                            name={saveReportData?.test_background}
                            btnConfirm={btnConfirm}
                            defaultHolder="请输入测试背景"
                            fontStyle={{
                                fontSize: 14,
                                fontFamily: 'PingFangSC-Regular',
                                color: 'rgba(0,0,0,0.65)'
                            }}
                            btn={btnState}
                            onOk={(val: any) => handleChangeVal(val, 'test_background')}
                        />
                    </ModuleWrapper>
                    }
                    {!domainResult?.is_default && domainResult?.need_test_method &&
                        <ModuleWrapper id="need_test_method">
                            <SubTitle><span className="line"></span>测试方法</SubTitle>
                            <SettingTextArea
                                name={saveReportData?.test_method}
                                defaultHolder="请输入测试方法"
                                fontStyle={{
                                    fontSize: 14,
                                    fontFamily: 'PingFangSC-Regular',
                                    color: 'rgba(0,0,0,0.65)'
                                }}
                                btn={btnState}
                                btnConfirm={btnConfirm}
                                onOk={(val: any) => handleChangeVal(val, 'test_method')}
                            />
                        </ModuleWrapper>}
                    {!domainResult?.is_default && domainResult?.need_test_conclusion && 
                        <ModuleWrapper id="need_test_conclusion">
                            <SubTitle><span className="line"></span>测试结论</SubTitle>
                            <SettingTextArea
                                name={saveReportData?.test_conclusion?.custom}
                                btn={btnState}
                                defaultHolder="请输入测试结论"
                                btnConfirm={btnConfirm}
                                fontStyle={{
                                    fontSize: 14,
                                    fontFamily: 'PingFangSC-Regular',
                                    color: 'rgba(0,0,0,0.65)'
                                }}
                                onOk={(val: any) => handleChangeVal(val, 'custom')}
                            />
                        </ModuleWrapper>
                    }
                </>
            }
        </>
    )
}
export default memo(ReportBasicInfo);