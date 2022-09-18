
import {useQueries} from '@tanstack/react-query'
import axios from 'axios'

const fetchSingleSuperHero = async (heroId) => {
    const res = await axios.get(`http://localhost:4000/superheroes/${heroId}`)
    return res.data
}

// heroIds是动态变化的，是一个数组，里面放着每一项的id，如[1, 3]
const DynamicParallelPage = ({heroIds}) => {

    // useQueries()接收一个对象作为参数，这个对象中有一个queries属性，其值是数组，这个数组里装的就是一个个的query
    // 而这些query的格式是一个个的对象，对象中有两个字段必有的字段：
    // 第一个字段：queryKey，是该query的唯一标识符，是一个数组，同useQuery()的第一个参数；
    // 第二个字段：queryFn，其值是一个方法，用来调用该query的api的；
    // 其他字段：其他字段就是useQuery()的第三个参数，用于进行api请求的配置，如cacheTime, staleTime等
    const queryResults = useQueries({
        queries: heroIds.map(id => {
            return {
                queryKey: ['super-hero', id],
                queryFn: () => fetchSingleSuperHero(id),
                refetchOnWindowFocus: false,
                refetchInterval: 3000
            }
        })
    })

    console.log(queryResults)

    return (
        <>
            DynamicParallelPage
        </>
    )
}

export default DynamicParallelPage
