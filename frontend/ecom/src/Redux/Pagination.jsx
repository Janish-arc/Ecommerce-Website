
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { useSelector } from 'react-redux'
export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange, 
  firstPage = <ChevronsLeft size={20}/>, 
  prevPage = <ChevronLeft size={20}/>, 
  nextPage = <ChevronRight size={20}/>, 
  lastPage = <ChevronsRight size={20}/>
}) => {
  // const {totalPages, products} = useSelector((state) => state.product)
  // if(!products || products?.length === 0 || totalPages <= 1) return null
  const getPageNumber = () => {
    const pageNumber = []
    const pageWindow = 1
    for(let i= Math.max(1, currentPage - pageWindow); i<= Math.min(totalPages, currentPage + pageWindow); i++){
        pageNumber.push(i)
    }
    return pageNumber
  }

    const baseBtn = "d-inline-flex align-items-center justify-content-center fw-semibold small rounded-circle mx-1 btn-base"
    const activeBtn = "d-inline-flex align-items-center justify-content-center fw-semibold small rounded-circle mx-1 btn-base bg-primary text-white shadow border border-2 border-primary btn-active"
    const inActiveBtn = "d-inline-flex align-items-center justify-content-center fw-semibold small rounded-circle mx-1 btn-base text-secondary border border-transparent btn-inactive"
    const controlBtn = "d-inline-flex align-items-center justify-content-center fw-semibold small rounded-circle mx-1 btn-base bg-white border text-secondary shadow-sm btn-control"

  return (
    <div className='d-flex flex-column align-items-center justify-content-center gap-3'>
        <div className='d-flex align-items-center justify-content-center rounded-pill border-secondary shadow p-2'>
            {/* First & Prev */}
            <div className='d-flex align-items-center '>
              <button disabled={currentPage === 1} className={`pages ${baseBtn} ${controlBtn}`} onClick={() => onPageChange(1)}>{firstPage}</button>
              <button disabled={currentPage === 1} className={`pages ${baseBtn} ${controlBtn}`} onClick={() => onPageChange(currentPage - 1)}>{prevPage}</button>
            </div>

            {/* Page Number */}
            <div className='d-flex align-items-center'>
              {getPageNumber().map((number) => (
                <button onClick={() => onPageChange(number)} className={`${baseBtn} ${currentPage === number ? activeBtn : inActiveBtn} rounded-circle border pagination-btn`} key={number}>{number}</button>
              ))}
            </div>
            
            {/* Next & Last */}
            <div className='d-flex align-items-center'>
              <button disabled={currentPage === totalPages} className={`pages ${baseBtn} ${controlBtn}`} onClick={() => onPageChange(currentPage + 1)}>{nextPage}</button>
              <button disabled={currentPage === totalPages} className={`pages ${baseBtn} ${controlBtn}`} onClick={() => onPageChange(totalPages)}>{lastPage}</button>
            </div>
        </div>
        <div className='text-secondary text-uppercase'>
            Page {currentPage} of {totalPages}
        </div>
    </div>
  )
}
