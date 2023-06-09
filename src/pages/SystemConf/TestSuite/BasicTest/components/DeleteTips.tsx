import React from "react"
import { Modal, Button, Typography, Space } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { ExclamationCircleOutlined } from "@ant-design/icons"

type Iprops = AnyType
type IRefs = AnyType

const DeleteTip: React.ForwardRefRenderFunction<IRefs, Iprops> = (props, ref) => {
    const { onOk, basePath } = props
    const { formatMessage } = useIntl()

    const [visible, setVisible] = React.useState(false)
    const [setting, setSetting] = React.useState<any>()

    React.useImperativeHandle(ref, () => ({
        show(_: AnyType) {
            _ && setSetting(_)
            setVisible(true)
        }
    }))

    const handleOk = () => {
        onOk?.(setting)
        setVisible(false)
    }

    const hanldeCancel = () => {
        setVisible(false)
    }

    return (
        <Modal
            destroyOnClose
            title={<FormattedMessage id="delete.tips" />}
            centered={true}
            visible={visible}
            onCancel={hanldeCancel}
            footer={[
                <Button key="submit" onClick={handleOk} type="danger">
                    <FormattedMessage id="operation.confirm.delete" />
                </Button>,
                <Button key="back" type="primary" onClick={hanldeCancel}>
                    <FormattedMessage id="operation.cancel" />
                </Button>
            ]}
            width={600}
        >
            <Space style={{ width: "100%" }} direction="vertical">
                <Typography.Text type="danger" >
                    <Space align="start">
                        <ExclamationCircleOutlined />
                        {formatMessage({ id: 'TestSuite.suite.delete.warning' }, { data: setting?.name })}
                    </Space>
                </Typography.Text>
                <Typography.Text style={{ color: 'rgba(0,0,0,0.45)', }}>
                    <FormattedMessage id="TestSuite.suite.delete.range" />
                </Typography.Text>
                <Typography.Link
                    href={`${basePath || "/refenerce/suite/"}?name=${setting?.name}&id=${setting?.id}`}
                    target="_blank"
                >
                    <FormattedMessage id="view.reference.details" />
                </Typography.Link>
            </Space>
        </Modal>
    )
}

export default React.forwardRef(DeleteTip)