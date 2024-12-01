document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#market-table tbody");
    const searchBox = document.getElementById("search-box");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const pageNumberDisplay = document.getElementById("page-number");

    let currentPage = 1;
    const rowsPerPage = 10;
    let marketData = [];

    // Fetch CSV data
    fetch("../market.csv")
        .then(response => response.text())
        .then(data => {
            marketData = parseCSV(data);
            renderTable();
        });

    // Parse CSV function
    function parseCSV(data) {
        const rows = data.split("\n").filter(row => row.trim() !== "");
        const headers = rows.shift().split(",");
        return rows.map(row => {
            const values = row.split(",");
            return headers.reduce((acc, header, index) => {
                acc[header.trim()] = values[index].trim();
                return acc;
            }, {});
        });
    }

    // Render table function
    function renderTable() {
        tableBody.innerHTML = "";
        const filteredData = filterData(searchBox.value);
        const paginatedData = paginateData(filteredData, currentPage, rowsPerPage);

        paginatedData.forEach(row => {
            const tableRow = document.createElement("tr");
            Object.values(row).forEach(value => {
                const tableCell = document.createElement("td");
                tableCell.textContent = value;
                tableRow.appendChild(tableCell);
            });
            tableBody.appendChild(tableRow);
        });

        updatePagination(filteredData.length);
    }

    // Filter data based on search
    function filterData(query) {
        return marketData.filter(row => 
            Object.values(row).some(value => value.toLowerCase().includes(query.toLowerCase()))
        );
    }

    // Paginate data
    function paginateData(data, page, rowsPerPage) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    }

    // Update pagination
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        pageNumberDisplay.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    // Event listeners
    searchBox.addEventListener("input", renderTable);

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage * rowsPerPage < filterData(searchBox.value).length) {
            currentPage++;
            renderTable();
        }
    });
});
