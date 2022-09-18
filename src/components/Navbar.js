import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/super-heroes'>Traditional Super Heroes</Link>
                </li>
                <li>
                    <Link to='/rq-super-heroes'>RQ Super Heroes</Link>
                </li>

                <li>
                    <Link to='/rq-parallel'>Parallel Queries</Link>
                </li>
                <li>
                    <Link to='/rq-dynamic-parallel'>Dynamic Parallel Queries</Link>
                </li>
                <li>
                    <Link to='/rq-sequential'>Dependent Sequential Queries</Link>
                </li>
                <li>
                    <Link to='/rq-pagination'>Pagination</Link>
                </li>
                <li>
                    <Link to='/rq-infinite-queries'>Infinite Queries</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
