import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage  from './pages/HomePage'
import RQSuperHeroesPage from './pages/RQSuperHeroesPage'
import SuperHeroesPage from './pages/SuperHeroesPage'
import Navbar from "./components/Navbar";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RQSuperheroPage from "./pages/RQSuperheroPage";
import ParallelQueriesPage from "./pages/ParallelQueriesPage";
import DynamicParallelPage from "./pages/DynamicParallelPage";
import DependentQueriesPage from "./pages/DependentQueriesPage";
import PaginatedQueriesPage from "./pages/PaginatedQueriesPage";
import InfiniteQueriesPage from "./pages/InfiniteQueriesPage";

function App() {
    const queryClientConfig = {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    }
    const client = new QueryClient()

    return (
      <QueryClientProvider client={client}>
          <Router>
              <Navbar />

              <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='super-heroes/' element={<SuperHeroesPage />} />
                  <Route path='rq-super-heroes/'>
                      <Route index element={<RQSuperHeroesPage />} />
                      <Route path=':heroId' element={<RQSuperheroPage />} />
                  </Route>
                  <Route path='rq-parallel/' element={<ParallelQueriesPage />} />
                  <Route path='rq-dynamic-parallel/' element={<DynamicParallelPage heroIds={[1,3]} />} />
                  <Route path='rq-sequential/' element={<DependentQueriesPage email='vishwas@example.com'/>} />
                  <Route path='rq-pagination/' element={<PaginatedQueriesPage />} />
                  <Route path='rq-infinite-queries/' element={<InfiniteQueriesPage />} />
              </Routes>
          </Router>

          {/*initialIsOpen设置一开始打不打开开发工具， position设置开发工具的位置*/}
          <ReactQueryDevtools initialOpen={false} position='bottom-right' />
      </QueryClientProvider>
    )
}

export default App
