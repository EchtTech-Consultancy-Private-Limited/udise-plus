
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import React, {useCallback, useMemo, useState } from 'react';


export default function TestReport() {

    const [show, setShow] = useState(false);

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: 800 }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
      { field: 'athlete', filter: 'agTextColumnFilter', minWidth: 200 },
      { field: 'age' },
      { field: 'country', minWidth: 180 },
      { field: 'year' },
      { field: 'date', minWidth: 150 },
      { field: 'gold' },
      { field: 'silver' },
      { field: 'bronze' },
      { field: 'total' },
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 100,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true,
        filter: true,
      };
    }, []);
    const autoGroupColumnDef = useMemo(() => {
      return {
        minWidth: 200,
      };
    }, []);
    const sideBar = useMemo(() => {
      return {
        toolPanels: [
          'columns',
          {
            id: 'filters',
            labelKey: 'filters',
            labelDefault: 'Filters',
            iconKey: 'menu',
            toolPanel: 'agFiltersToolPanel',
          },
          {
            id: 'filters 2',
            labelKey: 'filters',
            labelDefault: 'Filters XXXXXXXX',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
        ],
        defaultToolPanel: 'filters',
      };
    }, []);
  
    const onGridReady = useCallback((params) => {
      fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((resp) => resp.json())
        .then((data) => {
            setRowData(data)
        });
    }, []);
    return (
        <div style={containerStyle}>
        <div
            style={gridStyle}
            className={
            "ag-theme-quartz"
            }
        >
            <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={sideBar}
            onGridReady={onGridReady}
            />
        </div>
        </div>
    )
}