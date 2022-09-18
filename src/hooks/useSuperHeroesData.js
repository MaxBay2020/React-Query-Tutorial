// 引包
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from 'axios'
import {request} from '../utils/axios-utils';

const fetchSuperHeros = async () => {
    // const res = await axios.get('http://localhost:4000/superheroes')
    const res = await request({url: '/superheroes'})
    return res.data
}

// 注意！由于这个是一个复用的query，每个组件使用这个query成功或失败之后的处理代码都不同；
// 因此不能写死，所以我们可以以参数的形式传进来；
export const useSuperHeroesData = (onSuccess, onError) => {

    // 因为要在其他组件使用这个query，所以要return回去；
    return useQuery(['getSuperHeros'], fetchSuperHeros, {
        // enabled: false,
        onSuccess,
        onError,
    })
}

const addSuperHero = async (hero) => {
    // 由于这里POST请求来是添加数据，不像useQuery()将查询的数据最后返回到data参数里，需要返回res.data
    // 这里我们使用的是useMutation()返回的mutate()方法；所以不需要返回res.data
    const res = await axios.post('http://localhost:4000/superheroes', hero)
    // res.data就是新添加的这条数据，也就是hero
    // 将hero返回，之后会传入onSuccess()函数中作为参数
    // return res.data
}

// 创建用于POST请求的react query hook
// useMutation()不需要像useQuery()一样需要传入第一个参数作为唯一标识符，只需要直接传入一个回调函数即可！
// 同useQuery()的第二个参数，我们在这个回调函数里使用axios进行API请求即可；
export const useAddSuperHeroData = () => {
    // 获取QueryClient的实例，也就是在App.js组件中的那个QueryClient对象
    const queryClient = useQueryClient()


    // 注意！虽然addSuperHero()方法需要传入一个hero参数，但是不是在useMutation(() => addSuperHero(hero))这里传；
    // 而是useMutation()会返回一个叫mutate()的函数，我们在mutate()函数中传入hero，即mutate(hero)
    return useMutation(addSuperHero, {
        // // onSuccess()函数会在成功添加数据后触发
        // onSuccess: (data) => {
        //     // 使用QueryClient对象身上的invalidateQueries()方法，通过传入query的唯一标识符找到对应的query，之后重新执行这个query
        //     // 也就是通过['getSuperHeros']找到了上面useSuperHeroesData方法中的那个query，并在后台重新执行这个query的API请求；
        //     // queryClient.invalidateQueries(['getSuperHeros'])
        //
        //     // 使用QueryClient对象身上的setQueryData(第一个参数，第二个参数)方法，用来更新query cache；
        //     // 第一个参数：query的唯一标识符，用来找到其对应的query，也就是通过['getSuperHeros']找到了上面useSuperHeroesData方法中的那个query
        //     // 第二个参数：是一个回调函数，当我们找到该query，该如何处理，这个函数会自动接收一个参数，即旧的query取得的数据
        //     // 注意！与invalidateQueries()不同的是，invalidateQueries()会在后台重新执行query，也就是重新进行API请求；
        //     // 而setQueryData()，并不会在后台重新发起api请求，它只是更新了旧的query返回回来的结果！
        //     queryClient.setQueryData(['getSuperHeros'], (oldQueryData) => {
        //         // 将刚添加的新数据添加到这个旧的query返回的结果里，并返回
        //         oldQueryData.push(data)
        //         return oldQueryData
        //     })
        // }

        // onMutate()函数会在进行POST请求之前执行，也就是会在mutate()函数执行前执行
        // 它接收一个参数，这个参数就是POST请求要传的那个参数，在这里是hero
        onMutate: async (newHero) => {
            // 第一步：
            // 使用QueryClient对象身上的cancelQueries()方法，通过传入唯一标识符找到对应的query，然后取消这个query
            // 其目的是：为了避免干扰optimistic update
            // 注意！cancelQueries()方法是异步的，需要使用async await
            await queryClient.cancelQueries(['getSuperHeros'])
            // 第二步：
            // 由于optimistic update是在成功添加数据前，也就是发送POST请求前就将新数据渲染到视图的
            // 因此我们需要将旧的query所返回的数据进行备份，以免POST请求失败！
            // 使用QueryClient对象身上的getQueryData()方法，通过传入唯一标识符找到对应的query，然后得到此query取回的结果！
            const previousHeroData = queryClient.getQueryData(['getSuperHeros'])
            // 第三步：
            // 使用QueryClient对象身上的setQueryData(第一个参数，第二个参数)方法，用来更新query cache；
            // 第一个参数：query的唯一标识符，用来找到其对应的query，也就是通过['getSuperHeros']找到了上面useSuperHeroesData方法中的那个query
            // 第二个参数：是一个回调函数，当我们找到该query，该如何处理，这个函数会自动接收一个参数，即旧的query取得的数据
            // queryClient.invalidateQueries(['getSuperHeros'])
            // 注意！与invalidateQueries()不同的是，invalidateQueries()会在后台重新执行query；
            // 而setQueryData()，并不会在后台重新发起api请求，它只是更新了旧的query返回回来的结果！
            queryClient.setQueryData(['getSuperHeros'], (oldQueryData) => {
                // 因为optimistic update的特点，即在进行POST之前就将新数据渲染到视图上；
                // 因此，我们需要手动添加id
                oldQueryData.push({
                    id: oldQueryData?.length + 1,
                    ...newHero
                })
                return oldQueryData
            })

            // 将旧的数据返回，以免POST请求失败之后的数据回滚
            return {
                previousHeroData
            }
        },

        // 第四步：
        // 当API请求失败时，触发此回调函数；
        // onError()接收三个参数；
        // 第一个参数：error，表示API请求失败之后的错误信息；
        // 第二个参数：这个参数就是POST请求要传的那个参数，在这里是hero；
        // 第三个参数：context，里面存放了API请求的一些参数；其中就包含onMutate()回调函数返回的结果，也就是旧的数据，即context.previousHeroData
        // 以便于当POST请求失败时进行数据回滚；
        onError: (error, newHero, context) => {
            // 如果API请求失败后，根据唯一标识符，找到对应的query所返回的数据，并将数据进行回滚；
            queryClient.setQueryData(['getSuperHeros'], () => {
                return context.previousHeroData
            })
        },

        // 第五步：
        // 当API请求失败或者成功后，都会执行onSettled()回调函数；
        // 我们在这个回调函数中重新发送API请求，重新获得数据，其目的是：为了确保前端的数据和后端的数据保持一致！
        // 使用QueryClient对象身上的invalidateQueries()方法，通过传入query的唯一标识符找到对应的query，之后重新执行这个query
        // 也就是通过['getSuperHeros']找到了上面useSuperHeroesData方法中的那个query，并在后台重新执行这个query的API请求；
        onSettled: () => {
            queryClient.invalidateQueries(['getSuperHeros'])
        }
    })
}


