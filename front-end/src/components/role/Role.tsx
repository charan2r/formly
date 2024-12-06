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
import api from '../../utils/axios';  // Import the authenticated axios instance
import { useAuth } from '../../context/AuthContext';  // Import useAuth
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Role {
  roleId: string;
  role: string;
  description?: string | null;
  lastActive?: string | null;
  createdAt?: string | null;
  organizationId: string;
  status: string;
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
  const { user } = useAuth();  // Get the authenticated user
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ role: '', description: '', createdAt: '', lastActive: '' });
  const [orderBy, setOrderBy] = useState<keyof Role>('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!user?.organizationId) return;
        
        const response = await api.get(`/roles/organization/${user.organizationId}`);
        if (response.data.status === 'success') {
          const activeRoles = response.data.data.filter(
            (role: Role) => role.status === 'active'
          );
          setRoles(activeRoles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Handle error appropriately
      }
    };

    fetchRoles();
  }, [user?.organizationId]);

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
    const newSelectedRoles = roles.reduce((acc, rol) => {
      acc[rol.roleId] = checked;  // Apply the same checked state to all roles
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedRoles(newSelectedRoles);
  };

  const handleSelectRole = (id: number) => {
    setSelectedRoles((prev) => ({
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

  const handleRequestSort = (property: keyof Role) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteConfirmation = (roleId: string) => {
    setRoleToDelete(roleId);
    setConfirmationOpen(true);
  };

  const handleBulkDeleteConfirmation = () => {
    setConfirmationBulkOpen(true);
  };

  const handleDeleteRoles = async () => {
    try {
      const selectedRoleIds = Object.keys(selectedRoles).filter(key => selectedRoles[key]);
      
      const response = await api.delete('/roles', {
        data: selectedRoleIds // Send array of IDs directly
      });

      if (response.data.status === 'success') {
        setRoles(prevRoles => 
          prevRoles.filter(role => !selectedRoleIds.includes(role.roleId))
        );
        toast.success(response.data.message || "Roles deleted successfully!");
        setSelectedRoles({});
      } else {
        throw new Error(response.data.message);
      }
      
      setConfirmationBulkOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete roles");
    }
  };

  const handleDeleteRole = async () => {
    try {
      if (!roleToDelete) return;

      const response = await api.delete(`/roles/${roleToDelete}`);
      
      if (response.data.status === 'success') {
        setRoles(prev => prev.filter(role => role.roleId !== roleToDelete));
        toast.success(response.data.message || "Role deleted successfully!");
      } else {
        throw new Error(response.data.message);
      }
      
      setConfirmationOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  const filteredData = roles
    .filter((rol) => {
      const nameMatches = rol.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
        rol.role.toLowerCase().includes(filters.role.toLowerCase());

      const categoryMatches = rol.description
        ? rol.description.toLowerCase().includes(filters.description.toLowerCase())
        : !filters.description; // If org.category is null, match only if filters.category is empty

      const lastActiveMatches = rol.createdAt
        ? rol.createdAt.toLowerCase().includes(filters.createdAt.toLowerCase())
        : !filters.createdAt; // If org.lastActive is null, match only if filters.lastActive is empty

      return nameMatches && categoryMatches && lastActiveMatches;
    })
    .sort((a, b) => {
      const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
      return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
    });

  const selectedCount = Object.values(selectedRoles).filter(Boolean).length;

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleAddRole = () => {
    if (!user?.organizationId) {
      toast.error("Organization context not found");
      return;
    }
    navigate('/addrole');
  };

  const handleEditRole = (roleId: string) => {
    if (!user?.organizationId) {
      toast.error("Organization context not found");
      return;
    }
    navigate(`/editrole/${roleId}`);
  };

  const AddRoleButton = () => (
    <Button
      variant="contained"
      sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px' }}
      onClick={handleAddRole}
    >
      <AddIcon sx={{ marginRight: 1 }} />
      Add Role
    </Button>
  );

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
          Role Management
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Role Management</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Manage your role and their account permissions here.
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="span">
            <strong>All role</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
                onClick={() => handleBulkDeleteConfirmation()}
                sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
              >
                <Delete sx={{ marginRight: 1 }} />
                Delete
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                onClick={() => navigate('/addrole')}
              >
                <AddIcon sx={{ marginRight: 1 }} />
                Add Role
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table stickyHeader sx={{ marginTop: '25px' }}>
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderStartStartRadius: '20px',
                  borderEndStartRadius: '20px',
                  padding: '4px',
                  position: 'relative', // Make this cell relative for absolute positioning of filter input
                }}
              >
                <Checkbox
                  onChange={handleSelectAll}
                  checked={
                    roles.length > 0 &&
                    roles.every((rol) => selectedRoles[rol.roleId])
                  }
                  indeterminate={
                    roles.some((rol) => selectedRoles[rol.roleId]) &&
                    !roles.every((rol) => selectedRoles[rol.roleId])
                  }
                />
              </TableCell>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', padding: '4px' }} />
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('name')}
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
                      value={filters.name}
                      onChange={(e) => handleFilterChange(e, 'name')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('category')}
                >
                  Created by
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
                      value={filters.category}
                      onChange={(e) => handleFilterChange(e, 'category')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'lastActive'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('lastActive')}
                >
                  Created At
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
                      value={filters.lastActive}
                      onChange={(e) => handleFilterChange(e, 'lastActive')}
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
              <TableRow key={row.roleId} sx={{ height: '60px' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedRoles[row.roleId]}  // Toggle specific checkbox
                    onChange={() => handleSelectRole(row.roleId)}
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <Avatar sx={{ width: '34px', height: '34px' }}>O</Avatar>
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : ''}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton onClick={(event) => handleMenuOpen(event, row.roleId)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Popover
                    open={Boolean(menuAnchor) && selectedRowId === row.roleId}
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
                        navigate(`/viewrole/${row.roleId}`);
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
                        handleEditRole(row.roleId);
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
                      onClick={() => handleDeleteConfirmation(row.roleId)}
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} sx={{}}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this role?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="black">
            Cancel
          </Button>
          <Button onClick={handleDeleteRole} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationBulkOpen} onClose={() => setConfirmationBulkOpen(false)} sx={{}}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete these roles?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationBulkOpen(false)} color="black">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoles} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </Paper>
  );
};

export default DataTable;
