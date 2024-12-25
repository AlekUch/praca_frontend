import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, InputBase, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UndoIcon from "@mui/icons-material/Undo";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'jspdf/dist/jspdf.umd.min.js';
import './DataGridStyles.css';

const Table = ({ columns,
        rows,
        onEdit, // Funkcja dynamiczna do obsługi edycji
        onArchive, // Funkcja dynamiczna do obsługi archiwizacji
        archivalField = "archival", // Nazwa pola odpowiadającego za status archiwizacji
    }) => {
    // Dodajemy kolumnę akcji dynamicznie
    const actionColumn = {
        field: "actions",
        headerName: "",
        minWidth:200,
        sortable: false,
        renderCell: (params) => {
            const data = params.row.originalData; // Pobieramy oryginalny obiekt danych
            const isArchived = data[archivalField]; // Sprawdzamy status archiwizacji dynamicznie

            return !isArchived ? (
                <>
                    <Tooltip title="Edytuj">
                        <IconButton
                            onClick={() => onEdit(data)} // Wywołujemy dynamiczną funkcję edycji
                            style={{ marginRight: "5px" }}
                        >
                            <EditIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Archiwizuj">
                        <IconButton onClick={() => onArchive(data, true)}> {/* Wywołujemy dynamiczną funkcję archiwizacji */}
                            <ArchiveIcon style={{ color: "red" }} />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Cofnij archiwizację">
                    <IconButton onClick={() => onArchive(data, false)}> {/* Wywołujemy dynamiczną funkcję cofnięcia archiwizacji */}
                        <UndoIcon style={{ color: "green" }} />
                    </IconButton>
                </Tooltip>
            );
        },
    };
    const [filterText, setFilterText] = useState('');
    const [filteredRows, setFilteredRows] = useState(rows);
    const [expandedRows, setExpandedRows] = useState({});

  

    // Przetwarzamy kolumny, aby dodać renderowanie z rozwijaniem
    const toggleRowExpand = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    // Przetwarzamy kolumny, aby dodać renderowanie komórek z rozwijaniem
    const processedColumns = columns.map((column) => ({
        ...column,
        renderCell: (params) => {
            const value = params.value;
            const isExpanded = expandedRows[params.id];

            if (typeof value === "string" && value.length > 30) {
                return (
                    <div
                        style={{
                            whiteSpace: isExpanded ? "normal" : "nowrap",
                            wordWrap: isExpanded ? "break-word" : "normal",
                            overflow: isExpanded ? "visible" : "hidden",
                            textOverflow: isExpanded ? "unset" : "ellipsis",
                            cursor: !isExpanded ? "pointer" : "default",
                        }}
                        onClick={() => !isExpanded && toggleRowExpand(params.id)} // Rozwijanie po kliknięciu
                    >
                        {isExpanded ? (
                            <span>
                                {value}{" "}
                                <Button
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Zapobiega wyzwoleniu onClick wiersza
                                        toggleRowExpand(params.id);
                                    }}
                                    style={{ marginLeft: 8, color: "red" }}
                                >
                                    Zwiń
                                </Button>
                            </span>
                        ) : (
                            <span>
                                {`${value.substring(0, 30)}`}{" "}
                                <Button
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Zapobiega wyzwoleniu onClick wiersza
                                        toggleRowExpand(params.id);
                                    }}
                                    style={{
                                        marginLeft: 8,
                                        color: "blue",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Rozwiń
                                </Button>
                            </span>
                        )}
                    </div>
                );
            }

            return (
                <div
                    style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                    }}
                >
                    {value}
                </div>
            );
        },
    }));



    const handleSearchChange = (event) => {
        const query = event.target.value;
        setFilterText(query);

        // Filtrowanie danych na podstawie tekstu
        if (query === '') {
            setFilteredRows(rows); // Przywrócenie wszystkich wierszy, gdy pole wyszukiwania jest puste
        } else {
            const filtered = rows.filter((row) => {
                return Object.values(row).some(
                    (value) =>
                        value
                            .toString()
                            .toLowerCase()
                            .includes(query.toLowerCase()) // Sprawdzanie, czy wartość w wierszu pasuje do wyszukiwanego tekstu
                );
            });
            setFilteredRows(filtered); // Ustawienie przefiltrowanych wierszy
        }
    };

    const handlePrint = () => {
        // Tworzenie nowego okna do drukowania
        const printWindow = window.open('', '', 'width=800,height=600');

        if (printWindow) {
            // Składanie HTML do wydruku
            const printContent = `
        <html>
          <head>
            <title>${ 'DANE AGROCHEM'}</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid black; }
            </style>
          </head>
          <body>
            <h2>${'DANE AGROCHEM'}</h2>
            <table>
              <thead>
                <tr>
                  ${columns.map(col => `<th>${col.headerName}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${filteredRows.map(row => `
                  <tr>
                    ${columns.map(col => `<td>${row[col.field]}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

            // Wstawienie zawartości HTML do nowego okna
            printWindow.document.write(printContent);

            // Wywołanie funkcji do drukowania w nowym oknie
            printWindow.document.close(); // Koniec pisania w dokumencie
            printWindow.print();
        }
    };




    return (
        <Paper sx={{
            maxWidth: 1200,
            margin: "5% auto",
            padding: "10px",
            borderRadius: "10px",
            overflow: "auto",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            height: "auto",
            flexGrow: "0"
            }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                <InputBase
                  value={filterText}
                  onChange={handleSearchChange}
                  placeholder="Wyszukaj..."
                  style={{ padding: '5px', width: '200px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    style={{ marginLeft: '10px' }}// Przekazujemy tytuł, kolumny i dane
                >
                    Drukuj/PDF
                </Button>
            </div>
            
               
            <DataGrid
                rows={filteredRows}
                columns={[...processedColumns, actionColumn]}
                pageSizeOptions={[8, 16,24,32]}
                selectionModel={[]}
                disableSelectionOnClick={true}
                style={{ wordWrap: 'break-word' }}
                getRowHeight={(params) =>
                    expandedRows[params.id] ? 'auto' : null // Dynamicznie ustawiamy wysokość wiersza
                }
                localeText={{
                    paginationRowsPerPage: 'Wierszy na stronę',
                    noRowsLabel: 'Brak wierszy',
                    noResultsOverlay: 'Brak wyników',
                    // Możesz dodać inne tłumaczenia, np.
                    columnMenuSortAsc: 'Sortuj rosnąco',
                    columnMenuSortDesc: 'Sortuj malejąco',
                    columnMenuFilter: 'Filtruj',
                    columnMenuHideColumn: 'Ukryj kolumnę',
                    pagination: {
                        labelRowsPerPage: 'Wierszy na stronę',
                    },
                    footerRowSelected: (count) =>
                         ``,

                }} 
                initialState={{
                    pagination: { paginationModel: { pageSize: 8, page: 0 } },
                }}
               
                />
            
            </Paper>
    );
};

export default Table;
