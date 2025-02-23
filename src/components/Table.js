import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, InputBase, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from '@mui/icons-material/Delete';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'jspdf/dist/jspdf.umd.min.js';
import './Table.module.css';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Table = ({ columns,
        rows,
        onEdit, 
        onArchive,
        onDelete,
        auth,
    archivalField ,
    title,    
    }) => {

    const actionColumn = auth ? {
        field: "actions",
        headerName: "",
        minWidth:  onEdit && onArchive && onDelete ? 170: 110 ,
        sortable: false,
        renderCell: (params) => {
            const data = params.row.originalData; 

            if (archivalField === "brak") {
                return (
                    <>
                        <Tooltip title="Edytuj">
                            <IconButton
                                onClick={() => onEdit(data)} 
                                style={{ marginRight: "2px" }}
                            >
                                <EditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        
                    </>
                );
            }

            if (!data || !(archivalField in data)) {
                return (
                    <>
                        <Tooltip title="Edytuj">
                            <IconButton
                                onClick={() => onEdit(data)} 
                                style={{ marginRight: "2px" }}
                            >
                                <EditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                            <IconButton onClick={() => onDelete(data)}> 
                                <DeleteIcon  style={{ color: "red" }} />
                            </IconButton>
                        </Tooltip>
                    </>
                ); 
            }

            const isArchived = data[archivalField]; 

            return !isArchived ? (
                <>
                    <Tooltip title="Edytuj">
                        <IconButton
                            onClick={() => onEdit(data)} 
                            style={{ marginRight: "2px" }}
                        >
                            <EditIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Archiwizuj">
                        <IconButton onClick={() => onArchive(data, true)}> 
                            <ArchiveIcon style={{ color: "red" }} />
                        </IconButton>
                    </Tooltip>
                    {onDelete &&
                        <Tooltip title="Usuń">
                            <IconButton onClick={() => onDelete(data)}> 
                                <DeleteIcon style={{ color: "red" }} />
                            </IconButton>
                        </Tooltip>
                        }
                </>
            ) : (
                <Tooltip title="Cofnij archiwizację">
                    <IconButton onClick={() => onArchive(data, false)}> 
                        <UndoIcon style={{ color: "green" }} />
                    </IconButton>
                </Tooltip>
            );
        },
    }
    :null;
    const [filterText, setFilterText] = useState('');
    const [filteredRows, setFilteredRows] = useState(rows);
    const [expandedRows, setExpandedRows] = useState({});

  
    const toggleRowExpand = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };


    const processedColumns = columns.map((column, colIndex) => ({
        ...column,
        renderCell: (params) => {
            const rowHasLongText = Object.values(params.row).some(
                (value) => typeof value === "string" && value.length > 70
            );
            const isFirstColumn = colIndex === 0;
            const isExpanded = expandedRows[params.id];

            if (rowHasLongText && isFirstColumn) {
                return (
                    <div
                        style={{
                            whiteSpace: isExpanded ? "normal" : "nowrap",
                            wordWrap: isExpanded ? "break-word" : "normal",
                            overflow: isExpanded ? "visible" : "hidden",
                            textOverflow: isExpanded ? "unset" : "ellipsis",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onClick={() => toggleRowExpand(params.id)}
                    >
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpand(params.id);
                            }}
                            style={{ marginRight: 1, color: isExpanded ? "red" : "blue" }}
                        >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <span>
                            {isExpanded
                                ? params.row[column.field] // Tylko wartość dla tej kolumny
                                : `${params.row[column.field]?.substring(0, 70)}`}
                        </span>
                    </div>
                );
            }

            if (typeof params.value === "string" && params.value.length > 70) {
                return (
                    <div
                        style={{
                            whiteSpace: isExpanded ? "normal" : "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {isExpanded
                            ? params.value 
                            : `${params.value.substring(0, 70)}...`} 
                    </div>
                );
            }

            return <div>{params.value}</div>;
        },
    }));



    const handleSearchChange = (event) => {
        const query = event.target.value;
        setFilterText(query);

        if (query === '') {
            setFilteredRows(rows); 
        } else {
            const filtered = rows.filter((row) => {
                return Object.values(row).some(
                    (value) =>
                        value
                            .toString()
                            .toLowerCase()
                            .includes(query.toLowerCase()) 
                );
            });
            setFilteredRows(filtered); 
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');

        if (printWindow) {
            const printContent = `
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; border: 1px solid black; text-align: center; }
                        img { max-width: 200px; height: auto; }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    <table>
                        <thead>
                            <tr>
                                ${columns
                    .filter(col => col.headerName !== 'Szczegóły') 
                    .map(col => `<th>${col.headerName}</th>`)
                    .join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredRows.map(row => `
                                <tr>
                                    ${columns
                            .filter(col => col.headerName !== 'Szczegóły') 
                            .map(col => {
                                if (col.field === 'photo') {
                                    const photoSrc = row.photo?.props?.src || null;
                                    return `<td>${photoSrc ? `<img src="${photoSrc}" alt="Zdjęcie" />` : ''}</td>`;
                                }
                                return `<td>${row[col.field] || ''}</td>`;
                            })
                            .join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };






    return (
        <Paper sx={{
            width:"auto",
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
                    style={{ marginLeft: '10px' }}
                >
                    Drukuj/PDF
                </Button>
            </div>
            
               
            <DataGrid
                rows={filteredRows}
                columns={[...processedColumns, ...(actionColumn ? [actionColumn] : [])]}
                pageSizeOptions={[8, 16,24,32]}
                selectionModel={[]}
                disableSelectionOnClick={true}
                style={{ wordWrap: 'break-word', fontSize:'12px' }}
                getRowHeight={(params) =>
                    expandedRows[params.id] ? 'auto' : null 
                }
                localeText={{
                    paginationRowsPerPage: 'Wierszy na stronę',
                    noRowsLabel: 'Brak wierszy',
                    noResultsOverlay: 'Brak wyników',
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
