import React, { useState, useEffect } from 'react';
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
  Pagination,
  TableSortLabel,
  Popover,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ArrowForward, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

interface Organization {
  orgId: string;
  name: string;
  category?: string | null;
  lastActive?: string | null;
}

const SquarePagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '5px',
    fontSize: '1.25rem',
    marginTop: '15px',
    padding: theme.spacing(2.5, 2.5),
  },
  '& .Mui-selected': {
    backgroundColor: '#000000 !important',
    color: 'white !important',
    '&:hover': {
      backgroundColor: 'black',
    },
  },
}));

const DataTable: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganizations, setSelectedOrganizations] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ name: '', type: '', category: '',lastActive: '' });
  const [orderBy, setOrderBy] = useState<keyof Organization>('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/organization'); 
        console.log(response.data)
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organization data:', error);
      }
    };

    fetchOrganizations();
  }, []);


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newSelectedOrganizations = organizations.reduce((acc, org) => {
      acc[org.orgId] = checked;  // Apply the same checked state to all organizations
      return acc;
    }, {} as Record<number, boolean>);
    
    setSelectedOrganizations(newSelectedOrganizations);
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

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: event.target.value,
    }));
  };

  const handleRequestSort = (property: keyof Organization) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredData = organizations
  .filter((org) => {
    const nameMatches = org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        org.name.toLowerCase().includes(filters.name.toLowerCase());
    
    const categoryMatches = org.category 
      ? org.category.toLowerCase().includes(filters.category.toLowerCase())
      : !filters.category; // If org.category is null, match only if filters.category is empty

    const lastActiveMatches = org.lastActive
      ? org.lastActive.toLowerCase().includes(filters.lastActive.toLowerCase())
      : !filters.lastActive; // If org.lastActive is null, match only if filters.lastActive is empty

    return nameMatches && categoryMatches && lastActiveMatches;
  })
  .sort((a, b) => {
    const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
    return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
  });

  const selectedCount = Object.values(selectedOrganizations).filter(Boolean).length;

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }}/>
          </IconButton>
            <ArrowForward style={{ color: 'black' }}/>
          <Typography variant="body2" color="textSecondary">
            Overview
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Organization Management</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Manage your organizations and their account permissions here.
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="span">
            <strong>All organizations</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
            <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: '20px', padding: '2px', paddingRight: '15px', paddingLeft: '15px', display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ borderRadius: '20px', color: 'black' }} onClick={handleFilterToggle}
              >
                Filters
              </Button>
            </Box>
            {selectedCount > 0 ? (
              <Button
                variant="contained"
                sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
              >
                <Delete sx={{ marginRight: 1 }} />
                Delete
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
              >
                <AddIcon sx={{ marginRight: 1 }} />
                Add Organization
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: '400px', height: 'auto', overflow: 'auto' }}>
      <Table stickyHeader sx={{ marginTop: '10px' }}>
       <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderStartStartRadius: '20px',
                  borderEndStartRadius: '20px',
                  padding: '4px', // Adjust top and bottom padding here
                }}
              >
               <Checkbox
        onChange={handleSelectAll}
        checked={
          organizations.length > 0 && 
          organizations.every((org) => selectedOrganizations[org.orgId])
        }
        indeterminate={
          organizations.some((org) => selectedOrganizations[org.orgId]) &&
          !organizations.every((org) => selectedOrganizations[org.orgId])
        }
      />
              </TableCell>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: '#f9f9f9',
                  padding: '4px', // Adjust top and bottom padding here
                }}
              />
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  padding: '4px', // Adjust top and bottom padding here
                }}
              >
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('name')}
                >
                  Organization
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  padding: '4px', // Adjust top and bottom padding here
                }}
              >
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('category')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  padding: '4px', // Adjust top and bottom padding here
                }}
              >
                <TableSortLabel
                  active={orderBy === 'lastActive'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('lastActive')}
                >
                  Last Active
                </TableSortLabel>
              </TableCell>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderStartEndRadius: '20px',
                  borderEndEndRadius: '20px',
                  padding: '1px', // Adjust top and bottom padding here
                }}
              />
            </TableRow>
            {showFilters && (
              <TableRow>
                <TableCell padding="checkbox" colSpan={2} />
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Name"
                    value={filters.name}
                    onChange={(e) => handleFilterChange(e, 'name')}
                    sx={{ width: '40%', padding: 0, marginRight: '8px' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Type"
                    value={filters.type}
                    onChange={(e) => handleFilterChange(e, 'type')}
                    sx={{ width: '40%', padding: 0, marginRight: '8px' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Last Active"
                    value={filters.lastActive}
                    onChange={(e) => handleFilterChange(e, 'lastActive')}
                    sx={{ width: '40%', padding: 0, borderRadius: 26 }}
                  />
                </TableCell>
                <TableCell padding="checkbox" />
              </TableRow>
            )}
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} sx={{ height: '60px' }}>
                <TableCell padding="checkbox">
                <Checkbox
          checked={!!selectedOrganizations[row.orgId]}  // Toggle specific checkbox
          onChange={() => handleSelectOrganization(row.orgId)}
        />
                </TableCell>
                <TableCell padding="checkbox">
                  <Avatar sx={{ width: '34px', height: '34px'  }}>O</Avatar>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.lastActive}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Popover
                    open={Boolean(menuAnchor) && selectedRowId === row.id}
                    anchorEl={menuAnchor}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.25)', // Slightly transparent light gray
                        color: 'black',
                        padding: '5px',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center', // Center align text
                        fontSize: '0.875rem', // Smaller font size
                        minHeight: '30px', // Reduced height
                        minWidth: '100px', // Increased width
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      View
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center', // Center align text
                        fontSize: '0.875rem', // Smaller font size
                        minHeight: '30px', // Reduced height
                        minWidth: '100px', // Increased width
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center', // Center align text
                        color: 'red', // Red text color for "Delete"
                        fontSize: '0.875rem', // Smaller font size
                        minHeight: '30px', // Reduced height
                        minWidth: '100px', // Increased width
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Popover>
                </TableCell>



              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <SquarePagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          color="primary"
        />
      </Box>
    </Paper>
  );
};

export default DataTable;
