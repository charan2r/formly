import React, { useState } from 'react';
import {
  Table,
  InputAdornment,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  IconButton,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

interface Organization {
  id: number;
  name: string;
  email: string;
  type: string;
  lastActive: string;
}

const sampleData: Organization[] = [
  { id: 1, name: 'Organization1', email: 'org1@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 2, name: 'Organization2', email: 'org2@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 3, name: 'Organization3', email: 'org3@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 4, name: 'Organization4', email: 'org4@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 5, name: 'Organization5', email: 'org5@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 6, name: 'Organization6', email: 'org6@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 7, name: 'Organization7', email: 'org7@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 8, name: 'Organization8', email: 'org8@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 9, name: 'Organization9', email: 'org9@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 10, name: 'Organization10', email: 'org10@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 11, name: 'Organization11', email: 'org11@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 12, name: 'Organization12', email: 'org12@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 13, name: 'Organization13', email: 'org13@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 14, name: 'Organization14', email: 'org14@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },
  { id: 15, name: 'Organization15', email: 'org15@example.com', type: 'IT', lastActive: 'Oct 6, 2024' },


];

const SquarePagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '0px', // Square corners
  },
}));

const DataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganizations, setSelectedOrganizations] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1); // Adjusted to start from 1 for Pagination
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleSelectOrganization = (id: number) => {
    setSelectedOrganizations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };



  const filteredData = sampleData.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage); // Adjusted to use zero-based index

  return (
    <Paper elevation={4} sx={{ padding: '16px',  margin: '16px', width: '100%', boxSizing: 'border-box' }}>
      <Box display="flex" flexDirection="column" gap={2} >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            Organizations
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: '-8px' }}>
          Organization Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your organizations and their account permissions here.
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{padding: '4px'}}>
          <Typography variant="h6">
            <strong>All organizations ({filteredData.length})</strong>
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <MenuIcon sx={{ color: 'grey.600' }} /> {/* Hamburger menu icon */}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: 'grey.600' }} />
                  </InputAdornment>
                ),
                style: { backgroundColor: '#f9f9f9', borderRadius: '20px' },
              }}
              sx={{
                border: 'none',
                borderRadius: '20px', 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: '20px', padding: '2px', paddingRight:'15px', paddingLeft:'15px', display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ borderRadius: '20px', color: 'black' }}
              >
                Filters
              </Button>
            </Box>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px' }}
            >
              + Add Organization
            </Button>
          </Box>
        </Box>
      </Box>
      <TableContainer sx={{ overflow: 'hidden', maxHeight: '400px' }}>
        <Table stickyHeader sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9f9f9', borderRadius: '20px' }}>
              <TableCell
                padding="checkbox"
                sx={{
                  borderBottom: 'none',
                  borderTopLeftRadius: '20px',
                  borderBottomLeftRadius: '20px',
                  backgroundColor: '#f9f9f9' // Background color for checkbox heading
                }}
              >
                <Checkbox
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelectedOrganizations(
                      sampleData.reduce((acc, org) => {
                        acc[org.id] = checked;
                        return acc;
                      }, {} as Record<number, boolean>)
                    );
                  }}
                />
              </TableCell>
              <TableCell
                padding="checkbox"
                sx={{
                  borderBottom: 'none',
                  backgroundColor: '#f9f9f9'
                }}
              />
              <TableCell sx={{ padding: '4px 8px', borderBottom: 'none', backgroundColor: '#f9f9f9' }}>
                Organization
              </TableCell>
              <TableCell sx={{ padding: '4px 8px', borderBottom: 'none', backgroundColor: '#f9f9f9' }}>
                Type
              </TableCell>
              <TableCell sx={{ padding: '4px 8px', borderBottom: 'none', backgroundColor: '#f9f9f9' }}>
                Last Active
              </TableCell>
              <TableCell padding="checkbox" sx={{ borderBottom: 'none', borderTopRightRadius: '20px', backgroundColor: '#f9f9f9', borderBottomRightRadius: '20px' }} />
            </TableRow>
          </TableHead>


          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid grey' }}>
                  <Checkbox
                    checked={!!selectedOrganizations[row.id]}
                    onChange={() => handleSelectOrganization(row.id)}
                  />
                </TableCell>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid grey' }}>
                  <Avatar alt={row.name} src="/path/to/icon.png" />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>
                  <Typography><strong>{row.name}</strong></Typography>
                  <Typography variant="caption" color="textSecondary">{row.email}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.type}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.lastActive}</TableCell>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid grey' }}>
                  <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor) && selectedRowId === row.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => { console.log('Edit clicked', selectedRowId); handleMenuClose(); }}>Edit</MenuItem>
                    <MenuItem onClick={() => { console.log('Delete clicked', selectedRowId); handleMenuClose(); }}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Centered Pagination */}
      <Box display="flex" justifyContent="center" sx={{ marginTop: 1, marginBottom: 2 }}>
        <SquarePagination
          count={Math.ceil(filteredData.length / rowsPerPage)} // Total number of pages
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>

    </Paper>
  );
};

export default DataTable;
