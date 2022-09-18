import {useQuery} from '@tanstack/react-query'
import axios from 'axios'

const fetchSuperHeroes = async () => {
    const res = await axios.get('http://localhost:4000/superheroes')
    return res.data
}

const fetchFriends = async () => {
    const res = await axios.get('http://localhost:4000/friends')
    return res.data
}

const ParallelQueriesPage = () => {
    const superHeroes =
        useQuery(['superheros'], fetchSuperHeroes)
    const friends =
        useQuery(['friends'], fetchFriends)

    if(superHeroes.isLoading || friends.isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <>
            {
                superHeroes.data.map(superHero => (
                    <div key={superHero.id}>{superHero.name}</div>
                ))
            }
            {
                friends.data.map(friend => (
                    <div key={friend.id}>{friend.name}</div>
                ))
            }
        </>
    )
}

export default ParallelQueriesPage
