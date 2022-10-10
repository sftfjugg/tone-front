import React from 'react'
import { Popover, Button } from 'antd'
import { useIntl, FormattedMessage } from 'umi'
import styles from '../index.less'
import { LogOffContent } from './'

const Logoff: React.FC = () => {
    const { formatMessage } = useIntl()
    const [visible, setVisible] = React.useState(false)

    return (
        <Popover
            content={
                <LogOffContent
                    handleCancel={
                        () => setVisible(false)
                    }
                />
            }
            visible={visible}
            onVisibleChange={visible => setVisible(visible)}
            overlayClassName={styles.cancleWs}
            trigger="click"
            title={<FormattedMessage id="ws.config.tips" />}
        >
            <Button onClick={() => setVisible(true)}>
                <FormattedMessage id="operation.log.off" />
            </Button>
        </Popover>
    )
}

export default Logoff