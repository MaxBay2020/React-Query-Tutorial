import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

const fetchSingleSuperHero = async (heroId) => {
    const res = await axios.get(`http://localhost:4000/superheroes/${heroId}`)
    return res.data
}

const useSingleSuperHero = (heroId) => {

    // 第一步：使用useQueryClient()方法获取在App.js组件中的那个QueryClient实例；
    // 获取到的这个QueryClient实例里面，放着储存的cache的所有query，也就是里面放着请求过的query之后取回来的数据；

    const queryClient = useQueryClient()

    return useQuery(['superhero', heroId], () => fetchSingleSuperHero(heroId), {
        // 第二步：使用useQuery()的第三个配置参数，配置initialData，值是一个方法；
        initialData: () => {
            // 因为我们的queryClient是QueryClient实例，里面放着所有运行过的query所取回来的数据；
            // 因此我们可以通过query的唯一标识符来找到想要的那条query，并取得该query所取回来的数据
            // 在这里，我们需要的是取回super hero列表的那条query，其唯一标识符是：【'getSuperHeros'】
            // 该query取回来的是所有的super hero，我们之后通过find来取得指定id的那个super hero数据
            const hero = queryClient.getQueryData(['getSuperHeros']) // 这里要使用?判断，如果cache里面没有这条query就不往下执行了！
                ?.find(hero => hero.id === Number(heroId))

            // 健壮性判断
            if(hero){
                // 如果有这个hero，则返回这个hero
                return hero
            }else{
                // 如果hero不存在于列表里，需要返回undefined！
                return undefined
            }
        }
    })
}

export default useSingleSuperHero
