import React, { useEffect, useState } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from 'carbon-components-react';

const { Header, Body } = DataTable;

function ListModels({ apiKey, region }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!apiKey || !region) return;

    fetch(
      `https://api.${region.id}.natural-language-understanding.watson.cloud.ibm.com/v1/models/classifications?version=2022-04-07`,
      {
        headers: {
          Authorization: `Basic ${btoa('apikey:' + apiKey)}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedRows = data.models.map((m) => ({
          id: m.model_id,
          name: m.name,
          modelId: m.model_id,
          status: m.status
        }));
        setRows(formattedRows);
      });
  }, [apiKey, region]);

  const headers = [
    { key: 'name', header: 'Model Name' },
    { key: 'modelId', header: 'Model ID' },
     { key: 'status', header: 'Status' }
  ];

  if (!rows.length) {
  return (
    <div style={{ padding: '1rem', color: '#525252' }}>
      No classification models found.
    </div>
  );
}


  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getHeaderProps, getRowProps }) => (
        <Table size='lg'>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow {...getRowProps({ row })}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
}

export default ListModels;
