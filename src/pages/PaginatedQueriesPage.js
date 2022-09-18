import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'

// 规定每页显示2个
const pageSize = 2
const fetchColors = async (pageNumber) => {
    const res = await axios.get(`http://localhost:4000/colors?_limit=${pageSize}&_page=${pageNumber}`)
    return res.data
}

const PaginatedQueriesPage = () => {
    // 设置第几页
    const [pageNumber, setPageNumber] = useState(1);

    const {
        data: colors,
        isLoading,
        isError,
        error} = useQuery(['colors', pageNumber], () => fetchColors(pageNumber), {
            // keepPreviousData参数可以提升用户体验；
            // 其作用是：当我们点击下一页或者上一页时；在新的数据从api返回回来之前，我们先显示当前页的数据，同时在后台进行api的请求；
            // 一旦数据取回来，我们直接更新视图，这样一来就不需要显示Loading等字样
            // 但这也有个弊端！那就是用户点击下一页或者上一页之后，发现数据没变，就会以为卡住了！所以谨慎使用！
            keepPreviousData: true
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
                    colors.map(color => (
                        <li key={color.id}>{color.id} - {color.label}</li>
                    ))
                }
            </ul>

            <button
                onClick={() => setPageNumber(page => page - 1)}
                disabled={pageNumber === 1}
            >
                Prev Page
            </button>
            <button
                onClick={() => setPageNumber(page => page + 1)}
                disabled={pageNumber === 4}
            >
                Next Page
            </button>
        </>
    )
}

export default PaginatedQueriesPage
