import {useParams} from 'react-router-dom'
import useSingleSuperHero from "../hooks/useSingleSuperHero";


const RQSuperheroPage = () => {
    const {heroId} = useParams()


    const {data:singleHero, isLoading, isFetching, isError, error, refetch} = useSingleSuperHero(heroId)

    if(isLoading && isFetching){
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <>
            <h1>{singleHero.name} - {singleHero.alterEgo}</h1>
        </>
    )
}

export default RQSuperheroPage
