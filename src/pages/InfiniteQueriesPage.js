// 追加数据的效果，需要用到的是useInfiniteQuery，而不是useQuery了;
// 注意！不像useQuery，会在组件mount的时候触发，useInfiniteQuery不会在组件mount的时候自动执行，需要手动触发！
// useInfiniteQuery()通常和hasNextPage（布尔值），fetchNextPage（方法）以及getNextPageParam（配置参数）搭配使用；
import {useInfiniteQuery} from '@tanstack/react-query'
import axios from 'axios'

// 设置每次显示几条数据，这里是每次显示2条数据
const sizePerTime = 2

// 由于pageParam初始值是undefined，而不是1，所以就会造成在进行API请求的时候，请求路径是：
// http://localhost:4000/colors?_limit=${sizePerTime}&_page=undefined，这样容易出bug；
// 所以，我们要给他一个默认值1，代表一开始是从第一页开始的；
const fetchColors = async ( pageParam =1 ) => {
    // 对API的请求和分页一样
    // console.log(pageParam)
    const res = await axios.get(`http://localhost:4000/colors?_limit=${sizePerTime}&_page=${pageParam}`)
    return res.data
}

const InfiniteQueriesPage = () => {

    // 注意！使用useInfiniteQuery请求的数据返回回来的data数据有两个属性
    // 第一个属性：paramPages，是一个数组，里面装着页数，如：[1, 2, 3, ...]，如果当前是第二页，那么paramPages就是：[1, 2]；
    // 第二个属性：pages，是一个数组，里面就放着从api取回来的数据了，是一个二维数组，类似于getNextPageParam()函数中的pages；
    // 它长这样：[[第一条，第二条], [第三条，第四条], [第五条，第六条], ...]
    // 所以，我们在渲染数据的时候要注意！
    const {
        data: colors,
        isLoading,
        isError,
        error,
        hasNextPage, // hasNextPage是布尔值，是useInfiniteQuery()请求独有的返回的成员
        fetchNextPage, // fetchNextPage是一个方法，用来发送API请求，获取下一页的数据；也是useInfiniteQuery()请求独有的返回的成员
        isFetching,
        isFetchingNextPage, // isFetchingNextPage是布尔值，也是useInfiniteQuery()请求独有的返回的成员
        // 使用useInfiniteQuery时，会自动给给第二个参数，即回调函数传一些参数，类似于event对象；；
        // 在这里使用到的是里面的pageParam参数，pageParam表示页数，第几页；
    } = useInfiniteQuery(['colors'], ({pageParam}) => fetchColors(pageParam), {
            // 使用useInfiniteQuery时，需要配置getNextPageParam参数 ，值是一个方法，这个方法会自动传两个参数；
            // 第一个参数：lastPage，是一个数组，表示上一页的数据
            // 第二个参数： pages，是一个数组，表示有几组；比如，这里是每次显示2条数据，第一页是第一条和第二条，第二页是第三条和第四条，以此类推
            // 那么，pages是一个二维数组，里面放着每一组，如[[第一条，第二条], [第三条，第四条], [第五条，第六条], ...]
            // 也就是说，pages数组的下标+1就是页数，
            getNextPageParam: (lastPage, pages) => {
                // 我们一共有8条数据，每次显示2条，所以有4页，所以这里判断是page.length<4；
                // 如果pages.length < 4，说明还没到头，还有数据，所以return pages.length + 1
                // console.log(lastPage)
                if(pages.length < 4){
                    // 这里的返回值会返回到fetchColors()函数的pageParam里，之后再运行fetchColors()函数，进行API请求；
                    return pages.length + 1
                }else{
                    // 如果pages.length === 4，说明已经到第四页了，也就是到头了，没数据了，所以就返回false或者undefined
                    // 返回false之后就会将hasNextPage参数设置成false；说明没有下一页了！
                    return false
                }
                // console.log('lastpage', lastPage)
                // console.log('pages', pages)
            }
    })

    if(isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    if(isError){
        return (
            <h1>{error.message}</h1>
        )
    }

    return (
        <>
            <ul>
                {
                    colors.pages.map((group, index) => (
                        <li key={index}>
                            {
                                group.map(color => (
                                    <div key={color.id}>{color.id} - {color.label}</div>
                                ))
                            }
                        </li>
                    ))
                }
            </ul>
            <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>Load more</button>
            <div>{isFetchingNextPage && 'Fetching...'}</div>
        </>
    )
}

export default InfiniteQueriesPage
