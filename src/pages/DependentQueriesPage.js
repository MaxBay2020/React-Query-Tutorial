import {useQuery} from '@tanstack/react-query'
import axios from 'axios'

const fetchUserByEmail = async email => {
    const res = await axios.get(`http://localhost:4000/users/${email}`)
    return res.data
}

const fetchCoursesByChannelId = async channelId => {
    const res = await axios.get(`http://localhost:4000/channels/${channelId}`)
    return res.data
}

// email是上级组件传过来的；在实际开发中，email可能从redux中取得
const DependentQueriesPage = ({email}) => {
    // 第一个query：根据email，获取users表中的那个user；
    const {data:user} = useQuery(['user', email], () => fetchUserByEmail(email))
    // 我们需要这个user身上的channelId属性
    const channelId = user?.channelId
    // 第二个query：根据第一个query返回的结果，即user，使用其身上的channelId属性；
    // 再去Channels表中取得那条channel，之后就获得了该channel数据中的courses信息；
    const {data:channel, isLoading, isFetching} = useQuery(['channel', channelId],
        () => fetchCoursesByChannelId(channelId),
        {
            // 这里我们使用enabled配置来实现query的顺序执行；!!表示将一个变量转换成boolean
            // 如果channelId还没取回来，那么!!channelId就是false，那么enabled就是false，那么就不会执行这个query
            // 一旦channelId取回来了，有值了，那么!!channelId就是true，那孭enabled就是true，那么这个query就会执行了！
            enabled: !!channelId
        })

    if(isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <>
            <ul>
                {
                    channel.courses.map(course => (
                        <li key={course}>{course}</li>
                    ))
                }
            </ul>
        </>
    )
}

export default DependentQueriesPage
