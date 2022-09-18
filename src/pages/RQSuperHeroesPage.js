
import {useSuperHeroesData, useAddSuperHeroData} from "../hooks/useSuperHeroesData";
import {Link} from "react-router-dom";
import {useState} from "react";


const RQSuperHeroesPage = () => {
    const onSuccess = (data) => {
        console.log('fetching completed!')
        console.log(data)
    }

    const onError = (e) => {
        console.log('fetching failed!')
        console.log(e)
    }

    const {
        data:superHeros,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useSuperHeroesData(onSuccess, onError)

    // 注意！useMutation()返回的数据中，我们需要使用的是mutate()方法，这个方法用来触发POST请求！
    // 也有其他参数，如isLoading, isError, error等；
    const { mutate:addHero} = useAddSuperHeroData()

    const [name, setName] = useState('')
    const [alterEgo, setAlterEgo] = useState('')

    console.log(isLoading)

    if (isLoading && isFetching) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>Oops, something wrong🤯 {error.message}</h2>
    }

    const handleAddHeroClick = () => {
        const hero = {name, alterEgo}
        addHero(hero)
    }


    return (
      <>
          <h2>React Query Super Heroes Page</h2>
          <h2>Super Heroes Page</h2>
          <button onClick={()=>refetch()}>Fetch heros</button>
          {superHeros.map(hero => {
              return <Link to={`${hero.id}`} key={hero.id}><div>{hero.name}</div></Link>
          })}

          <div>
              <input
                  type='text'
                  value={name}
                  onChange={e => setName(e.target.value)}
              />
              <input
                  type='text'
                  value={alterEgo}
                  onChange={e => setAlterEgo(e.target.value)}
              />
              <button onClick={handleAddHeroClick}>Add Hero</button>
          </div>

      </>
    )
}

export default RQSuperHeroesPage
