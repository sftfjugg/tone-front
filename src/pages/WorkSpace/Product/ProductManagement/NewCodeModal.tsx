import { Input, Modal, message, Form, Select, Space, Typography, Tooltip } from 'antd'
import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { useRequest,history } from 'umi'
import styles from './index.less'
import { PlusOutlined } from '@ant-design/icons'
import { queryRepositoryList, queryBranchList, createBranchAndRelation } from '../services'
import { requestCodeMessage } from '@/utils/utils'

export default forwardRef(
    (props: any, ref: any) => {
        const [form] = Form.useForm()
        const [visible, setVisible] = useState(false)
        const [padding , setPadding ] = useState( false )
        const [info, setInfo] = useState<any>({})
        const [codeData, setCodeData] = useState<any>({})
        const ws_id = window.location.pathname.replace(/\/ws\/([a-zA-Z0-9]{8})\/.*/, '$1')
        const DEFAULT_PARAMS = { ws_id }
        useImperativeHandle(
            ref,
            () => ({
                show: (item:any, data:any = {}) => {
                    setCodeData(data.data.length)
                    setVisible(true)
                    setInfo(item)
                    repositoryRun({ws_id})
                }
            })
        )

        const { data,run: repositoryRun } = useRequest(
            (params: any) => queryRepositoryList(params),
            {
                manual:true,
            }
        )
        const { run: repositoryUrlRun } = useRequest(
            (params: any) => queryRepositoryList(params),
            {
                manual:true,
            }
        )

        const handleChangeRepoid = useCallback((repo_id: any) => {
          if (repo_id)
              branchRun({ repo_id })
              repositoryUrlRun({ repo_id }).then(res => {
                  form.setFieldsValue({ 'gitUrl': res[0].git_url })
              })
          },
        [], )

        /* const InputChange = useCallback(
            (e: any) => {
                if(e.target.value){
                    repositoryRun({ git_url: e.target.value }).then(res => {
                        if(!isEmpty(res)){
                            form.setFieldsValue({ 'repo_id': res[0].id })
                        }else{
                            form.resetFields(['repo_id'])
                        }
                    }) 
                }else if(e.target.value === ""){
                    repositoryRun({ git_url: '' })
                }
            },
            [],
        ) */
        const { data: branchList, run: branchRun } = useRequest(
            (params: any) => queryBranchList(params),
            {
                defaultParams:[DEFAULT_PARAMS],
                initialData: {
                    data: []
                },
                manual:true,
                formatResult: r => r,

            }
        )
        const handleOk = async () => {
            if ( padding ) return 
            setPadding( true )
            form.validateFields()
                .then(async (values) => {
                    values.ws_id = ws_id
                    if(codeData === 0){
                        const { code, msg } = await createBranchAndRelation({ project_id: info.id,is_master:1, ...values })
                        defaultOption(code, msg)
                    }else{
                        const { code, msg } = await createBranchAndRelation({ project_id: info.id, is_master:0,...values })
                        defaultOption(code, msg)
                    }
                    /*  */
                })
                .catch(err => {
                    console.log(err)
                    setPadding( false )
                })
        }
        const defaultOption = (code: number, msg: string) => {
            if (code === 200) {
                message.success('操作成功')
                props.onOk();
                setVisible(false)
                // 重置表单，重置数据源
                form.resetFields()
                branchList.data = []
            }
            else {
                requestCodeMessage( code , msg )
            }
            setPadding ( false )
        }
        const handleCancel = () => {
            setVisible(false)
            setPadding(false)
            // 重置表单，重置数据源
            form.resetFields()
            branchList.data = []
        }
        const addWareHouse = () => {
            //setVisible(false)
            //props.onCancle();
            //history.push(`/ws/${ ws_id }/product?t=code`)
            //window.location.reload()
            window.location.replace(`/ws/${ ws_id }/product?t=code`)
        }
        return (
            <Modal
                title="添加代码"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="取消"
                okText="确认"
                className={styles.modal_warpper}
                maskClosable={false}
            >
                <div className={styles.content_warpper}>
                    <Space>
                        <Typography.Text style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 'bold', fontSize: 14 }}>项目名称：</Typography.Text>
                        <Tooltip title={info.name} placement="topLeft" overlayStyle={{ wordBreak: 'break-all' }}>
                            <Typography.Text style={{ color: '#000', opacity: 0.65, fontSize: 14 }}><div className={styles.text_ellip}>{info.name}</div></Typography.Text>
                        </Tooltip>
                    </Space>
                </div>
                <div style={{ height: 10, backgroundColor: '#f5f5f5' }}></div>
                <div className={styles.content_warpper}>
                    <Form
                      form={form}
                      layout="vertical"
                      /*hideRequiredMark*/
                    >
                        <Form.Item label="仓库名称" name="repo_id" rules={[{ required:true,message:'仓库名称不能为空' }]}>
                            <Select 
                                placeholder="请选择仓库名称" 
                                notFoundContent={<div style={{ height: 0 }}></div>}
                                onChange={handleChangeRepoid} 
                                dropdownRender={(menu)=>(
                                    <div>
                                        {menu}
                                        <div style={{ maxHeight: 300, overflow: 'auto' }} onClick={addWareHouse}>
                                            <span className={styles.test_summary_job}><PlusOutlined style={{ marginRight:6 }}/>新增仓库</span>
                                        </div>
                                    </div>
                                )}>
                                {
                                    data?.map(
                                        (item: any) => (
                                            <Select.Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                { item.name}
                                            </Select.Option>
                                        )
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="GitUrl" name="gitUrl">
                            <Input placeholder="请选择gitUrl" /* onChange={(e:any)=>InputChange(e)} */ disabled/>
                        </Form.Item>
                        <Form.Item label="Branch" name="branch_id" rules={[{ required:true,message:'Branch不能为空' }]}>
                            <Select placeholder="请选择Branch">
                              {branchList.data?.map(
                                  (item: any) => (
                                    <Select.Option key={item.id} value={item.id}>
                                      {item.name}
                                    </Select.Option>
                                  )
                                )
                              }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }
)