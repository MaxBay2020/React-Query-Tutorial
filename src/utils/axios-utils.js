import axios from 'axios'

//
const client = axios.create({
    baseURL: 'http://localhost:4000', // 设置每次进行axios请求的基本url
})

// 给axios配置一些request对象上的参数
export const request = ({...options}) => {
    client.defaults.headers.common.Authorization = `Bearer your-token`
    const onSuccess = response => response
    const onError = error => {
        // 根据需求处理当请求失败时，该执行什么
        // 之后需要返回这个error对象
        return error
    }

    // 之后需要返回
    return client(options).then(onSuccess).catch(onError)
}
