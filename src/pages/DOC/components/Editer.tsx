import { Row, Space, Typography } from 'antd'
import styled from 'styled-components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import RichEditor from '@/components/RichEditor';
import { EditFilled } from '@ant-design/icons';
import { history, useParams, useAccess, Access } from 'umi'
import { queryDocList } from '../services'
import Loading from './Loading';
import Empty from './Empty'
import Catalog from './Catalog'
import moment from 'moment';
import lodash from 'lodash'
import { Editor } from '@tiptap/react';

const Wrapper = styled(Row)`
    height: 100%;
    width:100%;
    position: relative;
    padding: 20px;
`

const EditorContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: start;
    flex-direction: row;
`

const EditorContainer = styled.div<{ hasCatalog: number }>`
    width: ${({ hasCatalog }) => hasCatalog ? 'calc(100% - 230px)' : '100%'};
    height: 100%;
    display: flex;
    overflow-y: auto;
    padding-top: 20px;
    flex-direction: column;
    gap: 8px;
`

const EditorTitle = styled.div`
    display:flex;
    width: 100%;
    height: 38px;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    h2 {
        margin-bottom: 0;
    }
`

const EditorWrapper = styled.div`
    width: 100%;
    min-height : calc(100% - 80px);
`

const EditorEditBtn = styled.span`
    cursor: pointer;
    &:hover {
        color :#108ee9;
    }
`

const EditorBlock: React.FC<any> = ({ id, title, gmt_modified }) => {
    const { doc_type } = useParams() as any
    const access = useAccess()

    const [loading, setLoading] = useState(true)
    const [editor, setEditor] = useState<Editor>()
    const [position, setPosition] = useState<number>(0)
    const [isEmpty, setIsEmpty] = useState(false)
    const [text, setText] = React.useState("")

    const ref = useRef(null) as any

    const queryDocContent = async () => {
        if (id) {
            setLoading(true)
            const { data } = await queryDocList({ id })
            setLoading(false)
            if (data[0]) {
                setText(data[0].content)
            }
        }
    }

    useEffect(() => {
        queryDocContent()
        return () => {
            setLoading(true)
            setIsEmpty(false)
        }
    }, [id])

    const catalogSource = useMemo(() => {
        if (!editor) return []

        const editorScrollHeight = document.querySelector(".ProseMirror")?.scrollHeight
        const { content } = editor.getJSON()
        return content?.filter(({ type }: any) => type === "heading")
            .reduce((p: any, l: any, index: any) => {
                const { attrs } = l
                const { text } = l.content && l.content.length > 0 ? l.content[0] : {}
                const { level } = attrs
                if (level < 4) {
                    let dom = undefined
                    document.querySelectorAll(`h${level}`).forEach((ele) => {
                        if (ele.innerHTML === text)
                            dom = ele
                    })
                    if (dom) {
                        const { parentNode, offsetTop }: any = dom
                        const $pos = editorScrollHeight - parentNode?.offsetHeight + offsetTop
                        return p.concat({
                            level, text, node: l, index,
                            dom,
                            position: $pos
                        })
                    }
                    return p
                }
                return p
            }, [])
    }, [editor])

    const hanldeEditorContainerScroll = (evt: any) => {
        // console.log('target.scrollTop', evt.target.scrollTop)
        setPosition(evt.target.scrollTop)
    }

    useEffect(() => {
        if (!editor) return
        const _dom: HTMLElement = document.querySelector(".ProseMirror")
        _dom.addEventListener('scroll', lodash.debounce(hanldeEditorContainerScroll, 100))
        return () => {
            _dom.removeEventListener('scroll', lodash.debounce(hanldeEditorContainerScroll, 100))
        }
    }, [editor])

    return (
        <Wrapper>
            <EditorContent >
                <EditorContainer hasCatalog={catalogSource.length ? 1 : 0}>
                    {
                        title &&
                        <>
                            <EditorTitle >
                                <Typography.Title level={2}>{title}</Typography.Title>
                                <Access accessible={access.IsSysTestAdmin()}>
                                    <EditorEditBtn onClick={() => history.push(`/${doc_type}/edit/${id}`)}>
                                        <Space>
                                            <EditFilled />
                                            编辑
                                        </Space>
                                    </EditorEditBtn>
                                </Access>
                            </EditorTitle>
                            <Typography.Text type="secondary">
                                发布时间：{gmt_modified && moment(gmt_modified).format('YYYY-MM-DD hh:mm:ss')}
                            </Typography.Text>
                        </>
                    }

                    <EditorWrapper ref={ref as any} >
                        <RichEditor
                            editable={false}
                            content={text}
                            onCreate={({ editor }) => {
                                setEditor(editor)
                            }}
                        />
                    </EditorWrapper>
                </EditorContainer>
                {
                    !!catalogSource.length &&
                    <Catalog
                        source={catalogSource}
                        position={position}
                        setPosition={setPosition}
                    />
                }
            </EditorContent>
            {
                isEmpty && <Empty />
            }
            <Loading loading={loading} />
        </Wrapper>
    )
}

export default EditorBlock