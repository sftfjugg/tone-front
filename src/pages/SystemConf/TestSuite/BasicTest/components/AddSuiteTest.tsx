import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { Drawer, Button, Form, Col, Row, Select, Input, Radio } from 'antd'
import styles from '../style.less'
import Owner from '@/components/Owner/index';
import { useLocation, useIntl, FormattedMessage } from 'umi'
import _ from 'lodash'
import { useSuiteProvider } from '../../hooks'
import { QusetionIconTootip } from '@/components/Product/index'

/**
 * @module 系统级
 * @description 新增、编辑suite级
 */
export default forwardRef(
    ({ onOk }: any, ref: any) => {
        const { formatMessage } = useIntl()
        const { query }: any = useLocation()
        const testType = query.test_type || 'functional'
        const [form] = Form.useForm()

        const { domainList, runList, viewType } = useSuiteProvider()

        const [visible, setVisible] = useState(false)
        const [validateStatus, setValidateStatus] = useState<any>('')
        const [help, setHelp] = useState<string | undefined>()
        const [disable, setDisable] = useState(false)
        const [dataSource, setDataSource] = useState<any>({})

        useImperativeHandle(ref, () => ({
            show: (t: any, d: any = {}) => {
                setVisible(true)
                setDisable(false)
                d && setDataSource(d)
                form.setFieldsValue({
                    ...d,
                    test_type: testType,
                    owner: d.owner_name,
                    certificated: d.certificated ? 1 : 0
                })
            },
            hide: handleCancel
        }))

        const handleOk = () => {
            form.validateFields().then(val => {
                if (!val.name || val.name.replace(/\s+/g, "") == '') {
                    setValidateStatus('error')
                    setHelp(formatMessage({ id: 'please.enter' }))
                    return
                }
                val.name = val.name.replace(/\s+/g, "")
                setDisable(true)
                if (val.owner === dataSource.owner_name) val.owner = dataSource.owner
                val.domain_list_str = val.domain_list_str.join()
                onOk(val, dataSource.id ? dataSource.id : '')
                setDisable(false)
            }).catch(err => {
                if (!err.values.name || err.values.name.replace(/\s+/g, "") == '') {
                    setValidateStatus('error')
                    setHelp(formatMessage({ id: 'please.enter' }))
                }
                setDisable(false)
            })
        }

        const hanldFocus = () => {
            setDisable(false)
        }

        const handleChange = () => {
            setHelp(undefined)
            setValidateStatus('')
        }

        const handleCancel = () => {
            setVisible(false)
            setDisable(false)
            form.resetFields()
            setHelp(undefined)
            setValidateStatus('')
            setDataSource({})
        }

        const title = useMemo(() => {
            const optName = JSON.stringify(dataSource) !== '{}' ?
                (query.test_type === 'performance' ? <FormattedMessage id="TestSuite.performance.edit" /> : <FormattedMessage id="TestSuite.functional.edit" />) :
                (query.test_type === 'performance' ? <FormattedMessage id="TestSuite.performance.new" /> : <FormattedMessage id="TestSuite.functional.new" />)
            return optName
        }, [query, dataSource])

        const buttonText = useMemo(() => {
            return JSON.stringify(dataSource) !== '{}' ? <FormattedMessage id="operation.update" /> : <FormattedMessage id="operation.ok" />
        }, [])

        return (
            <Drawer
                maskClosable={false}
                keyboard={false}
                className={styles.warp}
                forceRender={true}
                destroyOnClose={true}
                title={title}
                width={376}
                onClose={handleCancel}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}><FormattedMessage id="operation.cancel" /></Button>
                        <Button onClick={handleOk} disabled={disable} type="primary" htmlType="submit" >
                            {buttonText}
                        </Button>
                    </div>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    /*hideRequiredMark*/
                    initialValues={{ is_default: 1, view_type: 'Type1' }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Test Suite"
                                validateStatus={validateStatus}
                                help={help}
                                rules={[{ required: true, message: formatMessage({ id: 'please.enter' }) }]}
                            >
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({ id: 'please.enter' })}
                                    // onBlur={handleBlur} 配合debug需求，临时注释
                                    onFocus={hanldFocus}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="test_type"
                                label={<FormattedMessage id="TestSuite.test_type" />}
                                rules={[{ required: true, message: formatMessage({ id: 'please.select' }) }]}
                            >
                                <Select placeholder={formatMessage({ id: 'please.select' })} disabled getPopupContainer={node => node.parentNode}>
                                    <Select.Option value="functional"><FormattedMessage id="functional.test" /></Select.Option>
                                    <Select.Option value="performance"><FormattedMessage id="performance.test" /></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="run_mode"
                                label={<FormattedMessage id="TestSuite.run_mode" />}
                                rules={[{ required: true, message: formatMessage({ id: 'please.select' }) }]}
                            >
                                <Select placeholder={formatMessage({ id: 'please.select' })} getPopupContainer={node => node.parentNode}>
                                    {
                                        runList.map((item: any, index: number) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            query.test_type === 'performance' &&
                            <Col span={24}>
                                <Form.Item
                                    name="view_type"
                                    label={<FormattedMessage id="TestSuite.view_type" />}
                                >
                                    <Select placeholder={formatMessage({ id: 'please.select' })}>
                                        {
                                            viewType.map((item: any, index: number) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        }
                        <Col span={24}>
                            <Form.Item
                                name="domain_list_str"
                                label={<FormattedMessage id="TestSuite.domain" />}
                                rules={[{ required: true, message: formatMessage({ id: 'please.select' }) }]}
                            >
                                <Select
                                    placeholder={formatMessage({ id: 'please.select' })}
                                    mode="multiple"
                                    getPopupContainer={node => node.parentNode}
                                    filterOption={(input, option: any) => {
                                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }}
                                    allowClear
                                    options={
                                        domainList.map((item: any, index: number) => {
                                            return {
                                                value: item.id,
                                                label: item.name
                                            }
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Owner />
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="is_default"
                                label={
                                    <QusetionIconTootip title={formatMessage({ id: 'TestSuite.default.case' })} desc={formatMessage({ id: 'TestSuite.auto.join.workspace' })} />
                                }
                                rules={[{ required: true, message: formatMessage({ id: 'please.select' }) }]}
                            >
                                <Radio.Group>
                                    <Radio value={1}><FormattedMessage id="operation.yes" /></Radio>
                                    <Radio value={0}><FormattedMessage id="operation.no" /></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="certificated"
                                label={
                                    <QusetionIconTootip title={formatMessage({ id: 'TestSuite.is_certified' })} desc={formatMessage({ id: 'TestSuite.is_certified.ps' })} />
                                }
                                rules={[{ required: true, message: formatMessage({ id: 'please.select' }) }]}
                            >
                                <Radio.Group>
                                    <Radio value={1}><FormattedMessage id="operation.yes" /></Radio>
                                    <Radio value={0}><FormattedMessage id="operation.no" /></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="doc"
                                label={<FormattedMessage id="TestSuite.desc" />}
                            >
                                <Input.TextArea rows={3} placeholder={formatMessage({ id: 'TestSuite.please.enter.desc' })} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label={<FormattedMessage id="TestSuite.remarks" />}
                            >
                                <Input.TextArea rows={3} placeholder={formatMessage({ id: 'please.enter' })} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        )
    }
)