import { Drawer, Space, Button, Form, Select, Checkbox } from 'antd'
import React, { forwardRef, useState, useImperativeHandle } from 'react'
import styles from './index.less'
import _ from 'lodash'
export default forwardRef(
    (props: any, ref: any) => {
        const [form] = Form.useForm()
        const [padding, setPadding] = useState(false) // 确定按钮是否置灰
        const [visible, setVisible] = useState(false) // 控制弹框的显示与隐藏
        const [title, setTitle] = useState('') // 弹框顶部title
        const [editer, setEditer] = useState<any>({}) // 编辑的数据
        const [nameStatus, setNameStatus] = useState(true)
        const [markeVal, setMarkeVal] = useState<any>([])
        const [funcsSelectVal,setFuncsSelectVal] = useState('')
        useImperativeHandle(
            ref,
            () => ({
                show: (title: string = "编辑对比组", data: any = {}) => {
                    setVisible(true)
                    setTitle(title)
                    let mark = _.get(data,'product_version') || ''
                    mark = mark.replace(/\n/g,' ')
                    data.product_version = mark
                    setEditer(data)
                    form.setFieldsValue({ name: [mark] })
                    setMarkeVal([mark])
                }
            })
        )
        const handleClose = () => {
            form.resetFields() // 重置一组字段到 initialValues
            setPadding(false)
            setNameStatus(true)
            setVisible(false)
        }


       
        const handleOk = () => {
            if (!form.getFieldValue('name')) {
                setNameStatus(false)
                return
            }
            setPadding(true)
            form.validateFields() // 触发表单验证，返回Promise
                .then(async (values) => {
                    const newEditer = editer
                    newEditer.product_version = values.name[0]
                    props.onOk(newEditer)
                    form.setFieldsValue({ name: [] })
                    setPadding(false)
                    setVisible(false)
                })
                .catch(err => console.log(err))
        }
        const onChange = (list: any) => {
            setMarkeVal([])
            setNameStatus(true)
            if(!list.length) {
                form.setFieldsValue({ name: undefined })
                return
            }
            const length = list.length
            form.setFieldsValue({ name: [list[length - 1]] })
            setMarkeVal(list[length - 1]);
        }
        const handlePerfBaselineSelectBlur = () => {
            if(funcsSelectVal){
                form.setFieldsValue({ name: [funcsSelectVal]})
                setFuncsSelectVal('')
                setMarkeVal([])
                setNameStatus(true)
            }
        }
        const handleFuncsBaselineSelectSearch = (val: any) => {
            setFuncsSelectVal(val)
            setNameStatus(true)
        }

        return (
            <Drawer 
                maskClosable={ false }
                keyboard={ false }
                title={title}
                width="375"
                onClose={handleClose}
                visible={visible}
                className={styles.add_baseline_drawer}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Space>
                            <Button onClick={handleClose}>取消</Button>
                            <Button type="primary" disabled={padding} onClick={handleOk}>更新</Button>
                        </Space>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical" // 表单布局 ，垂直
                    validateTrigger={''}
                    >
                    <Form.Item
                        label="对比组"
                        name="name"
                        validateStatus={(!nameStatus) && 'error'}
                        help={(!nameStatus && `对比组名称不能为空`)}
                        rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            className={styles.pers_select}
                            getPopupContainer={node => node.parentNode}
                            onSearch={handleFuncsBaselineSelectSearch}
                            onBlur={handlePerfBaselineSelectBlur}
                            onChange={onChange}
                            title={form.getFieldValue('name')}
                            dropdownRender={() => {
                                return (
                                    <div style={{ maxHeight: 300, overflow: 'auto' }}>
                                        <Checkbox.Group options={[editer.product_version]} value={markeVal} onChange={onChange} className={styles.eidt_marked} title={editer.product_version}/>
                                    </div>
                                )
                        }}
                        placeholder="请输入对比组名称"
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        )
    }
)