

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {

  return (
    <div className="pagination-container">
      <button
        onClick={() => setCurrentPage((prev) => prev-1)}
        disabled={currentPage === 1}
        className="btn"
      >
        Prev
      </button>
      <p>
        {currentPage} / {totalPages}
      </p>
      <button
        onClick={() => setCurrentPage((prev) => prev+1)}
        disabled={currentPage === totalPages}
        className="btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
