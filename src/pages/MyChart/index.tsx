import {deleteChartUsingPOST, listMyChartByPageUsingPOST} from '@/services/yubi/chartController';

import {Link, useModel} from '@@/exports';
import {Avatar, Button, Card, Col, Divider, List, message, Modal, Result, Row} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import Search from "antd/es/input/Search";
import {ExclamationCircleOutlined} from "@ant-design/icons";

/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * 获取当前用户
   */
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  /**
   * 加载图表数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              // 取出title并且设置为 undefined
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };

  /**
   * 变化时执行此处
   */
  useEffect(() => {
    loadData();
  }, [searchParams]);

  /**
   * 删除图表
   * @param chartId
   */
  const handleDelete = (chartId: any) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个图表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteChartUsingPOST({ id: chartId });
          console.log('res:', res.data);
          if (res.data) {
            message.success('删除成功');
            // 删除成功后重新加载图表数据
            loadData();
          } else {
            message.error('删除失败');
          }
        } catch (e: any) {
          message.error('删除失败' + e.message);
        }
      },
    });
  };


  return (
    <div className="my-chart-page">
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
            goal:value,
          });
        }}
        />
      </div>

      <div className="margin-16" />

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              // pageSize,
              // // 设置分页
              // showTotal: () => `共 ${chartTotal} 条记录`,
              // showSizeChanger: true,
              // showQuickJumper: true,
              // pageSizeOptions: ['10', '20', '30'],
              // onChange: (page, pageSize) => {
              //   setSearchParams({
              //     ...searchParams,
              //     current: page,
              //     pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                    <Row>
                      <Col push={16}>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>
                      <Col push={17}>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                    <Link to={`/ViewChartData/${item.id}`}>
                      <Button>查看图表数据</Button>
                    </Link>
                  </>
                }
                {
                  item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <List.Item.Meta
                      style={{ textAlign: 'left', fontWeight: 'bold' }}
                      description={item.chartType ? '图表类型：' + item.chartType : undefined}
                    />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#DB7093',
                        fontSize: '16px',
                      }}
                    >
                      {'分析目标：' + item.goal}
                    </p>
                    <Divider style={{ fontWeight: 'bold', color: 'blue', fontSize: '16px' }}>
                      智能分析结果
                    </Divider>
                    <div style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                      <p style={{ fontWeight: 'bold', color: '#0b93a1' ,textAlign:"left"}}>
                        {item.genResult}
                      </p>
                    </div>
                    <Row>
                      <Col style={{ color: 'black', fontWeight: 'bold' }}>
                        {'图表生成时间：' + new Date(item.createTime).toLocaleString()}
                      </Col>
                      <Col push={4}>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>
                      <Col push={6}>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  </>
                  )}
                {item.status == 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                    <Row justify="end">
                      <Col style={{ paddingRight: '10px' }}>
                        <Button type="primary" onClick={() => message.warning('敬请期待')}>
                          重试
                        </Button>
                      </Col>
                      <Col>
                        <Link to={`/ViewChartData/${item.id}`}>
                          <Button>查看图表数据</Button>
                        </Link>
                      </Col>
                      <Col>
                        <Button danger onClick={() => handleDelete(item.id)}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
