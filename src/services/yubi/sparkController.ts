// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** SendFailRetry GET /api/spark/SendFailRetry */
export async function sendFailRetryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SendFailRetryUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/spark/SendFailRetry', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** sendQuestion GET /api/spark/sendQuestion */
export async function sendQuestionUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendQuestionUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/spark/sendQuestion', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** sendQuestion02 GET /api/spark/sendQuestion02 */
export async function sendQuestion02UsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendQuestion02UsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/spark/sendQuestion02', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
