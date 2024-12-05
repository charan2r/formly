import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
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
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ArrowForward, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import auditTrailData from '../data/auditTrailData';

interface AuditTrail {
  audtId: string;
  tableName: string;
  type: string;
  action?: string | null;
  createdAt?: string | null;

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

const AuditTrail: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ tableName: '', type: '', action: '', createdAt: '' });
  const [orderBy, setOrderBy] = useState<keyof AuditTrail>('user');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
  const [auditTrailToDelete, setAuditTrailToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditTrails = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.get('/audit-trail/superadmin');
        console.log(response.data.data);
        setAuditTrails(response.data.data);
      } catch (error) {
        console.error('Error fetching audit trails:', error);
      }
    };

    fetchAuditTrails();
  }, [isAuthenticated, user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
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

  const handleRequestSort = (property: keyof AuditTrail) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteConfirmation = (audtId: string) => {
    setAuditTrailToDelete(audtId);
    setConfirmationOpen(true);
  };

  const handleBulkDeleteConfirmation = () => {
    setConfirmationBulkOpen(true);
  };

  const handleDeleteAuditTrails = async () => {
    try {
      const response = await api.delete('/auditTrail/bulk-delete', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        data: { ids: Object.keys(selectedAuditTrails) },
      });

      // Filter out the auditTrail that were deleted
      setAuditTrails((prevAuditTrails) =>
        prevAuditTrails.filter(audt => !Object.keys(selectedAuditTrails).includes(audt.audtId))
      );

      toast.success("AuditTrail has been deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error("Failed to delete the auditTrail. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  // Method to handle deletion of an auditTrail
  const handleDeleteAuditTrail = async () => {
    try {
      await axios.delete(`http://localhost:3001/auditTrail/delete?id=${auditTrailToDelete}`);
      setAuditTrails((prev) => prev.filter((audt) => audt.audtId !== auditTrailToDelete));
      setConfirmationOpen(false); // Close confirmation dialog
      toast.success("AuditTrail has been deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
    } catch (error) {
      toast.error("Failed to delete the auditTrail. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
    }
  };

  const filteredData = auditTrails
    .filter((audt) => {
      const userMatches = audt.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
        audt.type.toLowerCase().includes(filters.type.toLowerCase());

      const tableMatches = audt.tableName
        ? audt.tableName.toLowerCase().includes(filters.tableName.toLowerCase())
        : !filters.tableName; // If audt.table is null, match only if filters.table is empty

      const actionMatches = audt.action
        ? audt.action.toLowerCase().includes(filters.action.toLowerCase())
        : !filters.action; // If audt.action is null, match only if filters.action is empty

      const timeStampMatches = audt.createdAt
        ? audt.createdAt.toLowerCase().includes(filters.createdAt.toLowerCase())
        : !filters.createdAt; // If audt.timeStamp is null, match only if filters.timeStamp is empty

      return userMatches && tableMatches && actionMatches && timeStampMatches;
    })
    .sort((a, b) => {
      const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
      return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
    });

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
          Audit Trails
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Audit Trails</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Monitor any changes made throughout the platform admin accounts.
        </Typography>
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
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
                    <MenuIcon sx={{ color: 'grey.600' }} />
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
              sx={{ borderRadius: '20px', color: 'black' }} 
              onClick={handleFilterToggle}
            >
              Filters
            </Button>
          </Box>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table stickyHeader sx={{ marginTop: '25px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', padding: '4px' }}>
                <Avatar sx={{ width: '34px', height: '34px', visibility: 'hidden' }} /> {/* Placeholder for avatar alignment */}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' , marginLeft: '5%' }}>
                <TableSortLabel
                  active={orderBy === 'user'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('user')}
                >
                  Role
                </TableSortLabel>
                {showFilters && (
                  <div style={{ position: 'absolute', top: '70%', width: '45%', left: 0, right: 0 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      inputProps={{
                        style: {
                          height: "10px",
                        },
                      }}
                      placeholder="Filter"
                      value={filters.user}
                      onChange={(e) => handleFilterChange(e, 'user')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'table'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('table')}
                >
                  Table
                </TableSortLabel>
                {showFilters && (
                  <div style={{ position: 'absolute', top: '70%', width: '45%', left: 0, right: 0 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Filter"
                      inputProps={{
                        style: {
                          height: "10px",
                        },
                      }}
                      value={filters.table}
                      onChange={(e) => handleFilterChange(e, 'table')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'action'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('action')}
                >
                  Action
                </TableSortLabel>
                {showFilters && (
                  <div style={{ position: 'absolute', top: '70%', width: '45%', left: 0, right: 0 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Filter"
                      inputProps={{
                        style: {
                          height: "10px",
                        },
                      }}
                      value={filters.action}
                      onChange={(e) => handleFilterChange(e, 'action')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'timeStamp'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('timeStamp')}
                >
                  Timestamp
                </TableSortLabel>
                {showFilters && (
                  <div style={{ position: 'absolute', top: '70%', width: '45%', left: 0, right: 0 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Filter"
                      inputProps={{
                        style: {
                          height: "10px",
                        },
                      }}
                      value={filters.timeStamp}
                      onChange={(e) => handleFilterChange(e, 'timeStamp')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', borderStartEndRadius: '20px', borderEndEndRadius: '20px', padding: '1px' }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.audtId} sx={{ height: '60px' }}>
                <TableCell padding="checkbox">
                  <Avatar sx={{ width: '34px', height: '34px' }}>
                    {row.type?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.tableName || '-'}</TableCell>
                <TableCell>{row.action || '-'}</TableCell>
                <TableCell>
                  {row.createdAt 
                    ? new Date(row.createdAt).toLocaleString("en-GB", { 
                        day: "2-digit", 
                        month: "short", 
                        year: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit", 
                        hour12: true 
                      }) 
                    : '-'
                  }
                </TableCell>
                <TableCell padding="checkbox">
                  {/* <IconButton onClick={(event) => handleMenuOpen(event, row.audtId)}>
                    <MoreVertIcon />
                  </IconButton> */}
                  {/* <Popover
                    open={Boolean(menuAnchor) && selectedRowId === row.audtId}
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
  onClick={() => {
    handleMenuClose();
    navigate(`/view-auditTrial/${row.audtId}`);
  }}
  sx={{
    backgroundColor: 'white',
    borderRadius: '10px',
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
  onClick={() => {
    handleMenuClose();
    navigate(`/edit-auditTrails/${row.audtId}`);
  }}
  sx={{
    backgroundColor: 'white',
    borderRadius: '10px',
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
  onClick={() => {
    handleMenuClose();
    navigate(`/change-auditTrails/${row.audtId}`);
  }}
  sx={{
    backgroundColor: 'white',
    borderRadius: '10px',
    margin: '5px',
    justifyContent: 'center', // Center align text
    fontSize: '0.875rem', // Smaller font size
    minHeight: '30px', // Reduced height
    minWidth: '100px', // Increased width
    '&:hover': { backgroundColor: '#f0f0f0' },
  }}
>
  Change Admin
</MenuItem>
<MenuItem
  onClick={() => handleDeleteConfirmation(row.audtId)}
  sx={{
    backgroundColor: 'white',
    borderRadius: '10px',
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

              
                  </Popover> */}
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

  
      <ToastContainer></ToastContainer>
    </Paper>
  );
};

export default AuditTrail;
