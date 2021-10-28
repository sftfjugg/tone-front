import React, { useState, useEffect, useRef } from 'react';
import { Spin,Input, Tabs, Form, Badge, BackTop } from 'antd';
import { SearchOutlined, UpOutlined } from '@ant-design/icons';
import SearchPageList from './SearchPageTable';
import { querySearchListQuantity } from '../../service';
import styles from './index.less';
import { useParams } from 'umi'

const { Search } = Input;
const { TabPane } = Tabs;
/**
 * test suite搜索
 * @param props
 */
const TestSuiteSearch: React.FC<any> = (props) => {
  const { ws_id , keyword } : any = useParams()
  const searchKey = typeof(keyword) === 'string' ? keyword : ''

  // 滚动区域可视高度
  const [height, setHeight] = useState(400);
  // 搜索栏
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [tabKey, setTabKey] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [itemTotal, setItemTotal] = useState<any>({
    "total_num": 0,
    "suite_num": 0,
    "conf_num": 0,
    "domain_num": 0,
  })
  const [listScrollTop, setListScrollTop] = useState(0)
  const testSuiteSearch_wrapper = useRef<any>(null)

  // 2.获取搜索结果数量
  const getSearchListQuantity = async(query: any) => {
    const res = await querySearchListQuantity(query) || {}
    if (res.code === 200 && res.data && Object.keys(res.data).length) {
      setItemTotal({ ...res.data })
    }
  }

  useEffect(() => {
    window.document.title = '搜索结果'
    return () => {
      window.document.title = 'T-One'
    }
  } , [])

  // 获取页面伸缩变化后尺寸
  function handleResize() {
    const innerHeight = window.innerHeight;
    setHeight(innerHeight);
  }
  useEffect(() => {
    // case1. 添加页面尺寸伸缩变化监听
    handleResize();
  }, []);
  useEffect(() => {
    // case1. 添加页面尺寸伸缩变化监听
    window.addEventListener('resize', handleResize);
    return () => {
      // case2. 删除监听
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    getSearchListQuantity({ search_key: searchKey })
    setSearchKeyword(searchKey)
  }, [searchKey]);

  // 搜索
  const onSearch = (value: string) => {
    if (value) {
      getSearchListQuantity({ search_key: value })
      setSearchKeyword(value)
      setRefresh(!refresh)
    }
  }

  const onTabsChange = (key: string) => {
    setTabKey(key)
  }

  // 页面滚动
  const handleScroll = (e: any) => {
    const top = testSuiteSearch_wrapper.current.scrollTop
    setListScrollTop(top)
  }
  // 返回顶部
  const onScrollBackTop = () => {
    testSuiteSearch_wrapper.current.scrollTo(0,0);
  }

  const tabList = [
    { name: '全部', key: 'all', fieldName: 'total_num' },
    { name: 'Suite', key: 'suite', fieldName: 'suite_num' },
    { name: 'Conf',  key: 'conf', fieldName: 'conf_num' },
    { name: '领域', key: 'domain', fieldName: 'domain_num' },
  ]
  const selectedStyle = { backgroundColor: '#E6F7FF', color: '#1890FF', marginTop: -3}
  const othersStyle = { backgroundColor: '#0000000a', color: '#000', marginTop: -3}

	return (
      <div className={styles.TestSuiteSearch_wrapper} style={{ height: (height - 50), overflow: 'auto' }}
        onScroll={handleScroll} ref={testSuiteSearch_wrapper}
      >
        <div className={styles.header} style={{ display: 'block'}} />
        <div className={styles.content} style={{ minHeight: (height - 270) }}>
            <Search className={styles.content_search}
              defaultValue={searchKey}
              prefix={<SearchOutlined style={{ color: '#bfbfbf', marginTop: 4, marginRight: 8 }}/>}
              placeholder="请输入Test Suite、领域名称相关的检索内容"
              allowClear
              enterButton="检索"
              onSearch={onSearch}
            />
            <div>
              <Tabs defaultActiveKey="all" onChange={onTabsChange}>
                {tabList.map((item, i) => (
                  <TabPane key={item.key} tab={
                    <span>{item.name} <Badge count={itemTotal[item.fieldName]} overflowCount={999} showZero
                      style={tabKey === item.key ? selectedStyle : othersStyle} />
                    </span>
                  } disabled={loading} />
                ))}
              </Tabs>
              <Spin spinning={loading}>
                <SearchPageList searchKey={searchKeyword} tabKey={tabKey} ws_id={ws_id} refresh={refresh} loadingCallback={setLoading}/>
              </Spin>
            </div>
        </div>
        <div className={styles.define_backTop} onClick={onScrollBackTop}
          style={{ display: listScrollTop > 200 ? 'block': 'none', paddingTop: 7 }}>
          <UpOutlined className={styles.backTop_icon}/>
        </div>
      </div>
	);
};

export default TestSuiteSearch;
