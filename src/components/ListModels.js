import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Copy } from '@carbon/icons-react';

import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button
} from 'carbon-components-react';

function ListModels({ apiKey, region }) {
  const [rows, setRows] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const headers = [
    { key: 'name', header: 'Model Name' },
    { key: 'modelId', header: 'Model ID' },
    { key: 'status', header: 'Status' }
  ];

  const fetchModels = async () => {
    if (!apiKey || !region) return;

    const url = `https://api.${region.id}.natural-language-understanding.watson.cloud.ibm.com/v1/models/classifications?version=2022-04-07`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${btoa('apikey:' + apiKey)}`
        }
      });

      const formattedRows = (response.data.models || []).map((m) => ({
        id: m.model_id,
        name: m.name,
        modelId: m.model_id,
        status: m.status
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error('Error fetching models:', error);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [apiKey, region]);

  if (!rows.length) {
    return (
      <div style={{ padding: '1rem', color: '#525252' }}>
        No classification models found.
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Button size="sm" kind="secondary" onClick={fetchModels}>
          Refresh
        </Button>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <Table size="lg">
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
                    <TableCell key={cell.id}>
                      {cell.info.header === 'modelId' ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <span>{cell.value}</span>
                          <Copy
                            size={16}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              navigator.clipboard.writeText(cell.value);
                              setCopiedId(cell.value);
                              setTimeout(() => setCopiedId(null), 1500);
                            }}
                          />
                          {copiedId === cell.value && (
                            <span
                              style={{
                                color: '#198038',
                                fontSize: '0.75rem'
                              }}
                            >
                              Copied
                            </span>
                          )}
                        </div>
                      ) : (
                        cell.value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </>
  );
}

export default ListModels;
