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
  MenuItem,
  Avatar,
  Box,
  Pagination,
  TableSortLabel,
  Popover,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ArrowForward, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

interface Users {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userType?: string;
  lastLogin?: string;
}

interface EditUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType?: string;
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

const Users: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ userId: '', firstName: '', lastName: '', email: '', phoneNumber: '', userType: '' });
  const [orderBy, setOrderBy] = useState<keyof Users>('email');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [userDetails, setUserDetails] = useState<Users | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditUserForm | null>(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users?userId=a27affb6-a80a-41a1-bb8f-a57db98417b9');
        console.log(response.data)
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
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
    const newSelectedUsers = users.reduce((acc, org) => {
      acc[org.userId] = checked;
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectUser = (id: number) => {
    setSelectedUser((prev) => ({
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

  const handleRequestSort = (property: keyof U) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/details?userId=${userId}`);
      setUserDetails(response.data);
      setDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
    }
  };

  // New handler for edit button click
  const handleEditUser = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/details?userId=${userId}`);
      setEditFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || '',
        userType: response.data.userType || ''
      });
      setEditDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
    }
  };

  // Handler for form input changes
  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  // Handler for form submission
  const handleUpdateUser = async () => {
    if (!editFormData) return;

    try {
      await axios.put(`http://localhost:3001/users/${editFormData.id}`, editFormData);
      // Refresh the users list
      const response = await axios.get('http://localhost:3001/users?organizationId=a27affb6-a80a-41a1-bb8f-a57db98417b9');
      setOrganizations(response.data.data);
      setEditDialogOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredData = users
    .filter((org) => {
      const nameMatches = org.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        org.firstName.toLowerCase().includes(filters.firstName.toLowerCase());

      const categoryMatches = org.lastName
        ? org.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
        : !filters.lastName;

      const lastActiveMatches = org.email
        ? org.email.toLowerCase().includes(filters.email.toLowerCase())
        : !filters.email;

      return nameMatches && categoryMatches && lastActiveMatches;
    })
    .sort((a, b) => {
      const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
      return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
    });


  const selectedCount = Object.values(selectedUsers).filter(Boolean).length;

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setUserDetails(null);
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Atlas corp
          </Typography>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            User Management
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Users Management</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Manage your teams and their account permissions here.
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="span">
            <strong>All Users</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
                Add Users
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
                  position: 'relative',
                }}
              >
                <Checkbox
                  onChange={handleSelectAll}
                  checked={
                    users.length > 0 &&
                    users.every((org) => selectedUsers[org.id])
                  }
                  indeterminate={
                    users.some((org) => selectedUsers[org.id]) &&
                    !users.every((org) => selectedUsers[org.id])
                  }
                />
              </TableCell>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', padding: '4px' }} />
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('email')}
                >
                  Username
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
                      value={filters.email}
                      onChange={(e) => handleFilterChange(e, 'email')}
                      sx={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                <TableSortLabel
                  active={orderBy === 'userType'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('userType')}
                >
                  Role
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
                      value={filters.userType}
                      onChange={(e) => handleFilterChange(e, 'userType')}
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
                  Last Active
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
              <TableRow key={row.id} sx={{ height: '60px' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedUsers[row.userId]}
                    onChange={() => handleSelectUser(row.userId)}
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <Avatar sx={{ width: '34px', height: '34px' }}>O</Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    {row.firstName} {row.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {row.email}
                  </Typography>
                </TableCell>
                <TableCell>{row.userType}</TableCell>
                <TableCell>{row.lastLogin ? new Date(row.lastActive).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : ''}</TableCell>
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
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        color: 'black',
                        padding: '5px',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleViewUser(row.id)}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        minHeight: '30px',
                        minWidth: '100px',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      View
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleEditUser(row.id)}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        minHeight: '30px',
                        minWidth: '100px',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        margin: '5px',
                        justifyContent: 'center',
                        color: 'red',
                        fontSize: '0.875rem',
                        minHeight: '30px',
                        minWidth: '100px',
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

      {/* Dialog to display user details */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '16px 28px 40px',
            maxWidth: '650px',
            backgroundColor: '#f9f9f9',
            boxShadow: '30px 30px 20px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Back button */}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Header section */}
          <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'center', mb: 4, mt: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: '#f5f5f5',
                color: '#666',
                marginRight: '30px'
              }}
            >
              {userDetails?.firstName?.[0] || 'U'}
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                View user
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Look through your user's information easily.
              </Typography>
            </Box>
          </Box>

          {/* View Form fields */}
          <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
            {userDetails ? (
              <Box display="flex" flexDirection="column" gap={2.5}>
                <Box display="flex" gap={2} mt={-3} >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>First Name</Typography>
                    <TextField
                      value={userDetails.firstName}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>last Name</Typography>
                    <TextField
                      value={userDetails.lastName}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    />
                  </Grid>
                </Box>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Email</Typography>
                  <TextField
                    value={userDetails.email}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Phone</Typography>
                  <TextField
                    value={userDetails.phoneNumber || ''}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Role</Typography>
                  <TextField
                    value={userDetails.userType || ''}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{
                      readOnly: true,
                      sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                    }}
                  />
                </Grid>
              </Box>

            ) : (
              <Typography>Loading user details...</Typography>
            )}
          </DialogContent>
        </Box>
      </Dialog>

      {/* Add Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '16px 28px 40px',
            maxWidth: '650px',
            backgroundColor: '#f9f9f9',
            boxShadow: '30px 30px 20px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Back button */}
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Header section */}
          <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'center', mb: 4, mt: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: '#f5f5f5',
                color: '#666',
                marginRight: '30px'
              }}
            >
              {editFormData?.firstName?.[0] || 'U'}
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Edit user
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modify users and keep the database updated
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
            {editFormData ? (
              <Box display="flex" flexDirection="column" gap={2.5}>
                {/* First Name and Last Name row */}
                <Box display="flex" gap={2} mt={-3} >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>First Name</Typography>
                    <TextField
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleEditFormChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Last Name</Typography>
                    <TextField
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleEditFormChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    />
                  </Grid>
                </Box>

                {/* Email field */}
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Email</Typography>
                  <TextField
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                    }}
                  />
                </Grid>

                {/* Phone field */}
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Phone</Typography>
                  <TextField
                    name="phoneNumber"
                    value={editFormData.phoneNumber || ''}
                    onChange={handleEditFormChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                    }}
                  />
                </Grid>

                {/* Role dropdown and Update button row */}
                <Box display="flex" gap={2} alignItems="flex-end" sx={{ width: '100%' }}>
                  <Grid item xs={10} sm={9.5} sx={{ width: '65%' }}>  
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Role</Typography>
                    <TextField
                      name="userType"
                      value={editFormData.userType || ''}
                      onChange={handleEditFormChange}
                      select
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    >
                      <MenuItem value="Form Creator">Form Creator</MenuItem>
                      <MenuItem value="Form Manager">Form Manager</MenuItem>
                      <MenuItem value="Form Viewer">Form Viewer</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={2.5} sx={{ width: '35%' }}>  
                    <Button
                      variant="contained"
                      onClick={handleUpdateUser}
                      fullWidth
                      sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '20px',
                        height: '40px',
                        '&:hover': { backgroundColor: '#333' }
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Typography>Loading user details...</Typography>
            )}
          </DialogContent>
        </Box>
      </Dialog>

    </Paper>
  );
};

export default Users;
