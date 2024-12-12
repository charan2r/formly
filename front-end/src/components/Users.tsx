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
  DialogActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType?: string;
  updatedAt?: string;
}

interface EditUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType?: string;
}

interface Role {
  roleId: string;
  role: string;
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
  const [filters, setFilters] = useState({ userId: '', firstName: '', lastName: '', email: '', phoneNumber: '', roleId: '' });
  const [orderBy, setOrderBy] = useState<keyof Users>('email');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [userDetails, setUserDetails] = useState<Users | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditUserForm | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: '',
    userType: 'SubUser',
    organizationId: ''
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/users`);
        console.log(response.data)
        setUsers(response.data.data[0]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!user?.organizationId) return;
        
        const response = await api.get(`/roles/organization/${user.organizationId}`);
        if (response.data.status === 'success') {
          setRoles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoles();
  }, [user?.organizationId]);

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '100%'
    }
  }));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(userId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newSelectedUsers = users.reduce((acc, user) => {
      acc[user.id] = checked;
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev) => ({
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

  const handleRequestSort = (property: keyof Users) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCreateUser = async () => {
    try {
      const response = await api.post('/users/create', newUser);
      setUsers([...users, response.data.data]);
      setCreateUserOpen(false);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await api.get(`/users/details?userId=${userId}`);
      setUserDetails(response.data);
      setDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleEditUser = async (userId: string) => {
    try {
      const response = await api.get(`/users/details?userId=${userId}`);
      setEditFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || '',
        roleId: response.data.roleId || ''
      });
      setEditDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      toast.error("Failed to fetch user details for editing");
    }
  };

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleUpdateUser = async () => {
    if (!editFormData) return;

    try {
      await api.put(`/users/edit/?id=${editFormData.id}`, editFormData);
      // Refresh the users list
      const response = await api.get(`/users?userId=${user.userId}`);
      setUsers(response.data.data);
      setEditDialogOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setConfirmationOpen(true);
    handleMenuClose();
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/user/delete?id=${userToDelete}`);
      setUsers((prev) => prev.filter((org) => org.userId !== userToDelete));
      setConfirmationOpen(false);
      toast.success("User has been deleted successfully!", {
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
      toast.error("Failed to delete the user. Please try again.", {
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

  const handleBulkDeleteUsers = async () => {
    try {
      const userIdsToDelete = Object.entries(selectedUsers)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      // Make API call to delete multiple users
      await Promise.all(
        userIdsToDelete.map(id => api.delete(`/user/delete?id=${id}`))
      );

      // Update local state
      setUsers(prev => prev.filter(user => !userIdsToDelete.includes(user.id)));
      setSelectedUsers({});
      setConfirmationOpen(false);

      toast.success("Users have been deleted successfully!", {
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
      console.error('Error deleting users:', error);
      toast.error("Failed to delete users. Please try again.", {
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

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      roleId: event.target.value,
      userType: 'SubUser',
      organizationId: user?.organizationId
    });
  };

  const handleEditFormRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        roleId: event.target.value
      });
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
    <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Atlas corp
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
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
              user?.permissions.includes('Delete User') && (
                <Button
                  variant="contained"
                  onClick={() => setConfirmationOpen(true)}
                sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                >
                  <Delete sx={{ marginRight: 1 }} />
                  Delete
                </Button>
              )
            ) : (
              user?.permissions.includes('Add User') || user?.userType === 'Admin' && (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                  onClick={() => setCreateUserOpen(true)}
                >
                  <AddIcon sx={{ marginRight: 1 }} />
                  Add Users
                </Button>
              )
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
                  padding: '1px',
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
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', padding: '1px' }} />
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '1px', position: 'relative' }}>
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
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '1px', position: 'relative' }}>
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
              <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '1px', position: 'relative' }}>
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
              <TableRow key={row.id}>
                <TableCell padding="checkbox" >
                  <Checkbox
                    checked={!!selectedUsers[row.id]}
                    onChange={() => handleSelectUser(row.id)}
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
                <TableCell>{roles.find(role => role.roleId === row.roleId)?.role || row.userType}</TableCell>
                <TableCell>{row.updatedAt ? new Date(row.updatedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : ''}</TableCell>
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
                    {user?.permissions.includes('View User') || user?.userType === 'Admin' && (
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
                    )}
                    {user?.permissions.includes('Edit User') || user?.userType === 'Admin' && (
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
                    )}
                    {user?.permissions.includes('Delete User') || user?.userType === 'Admin' && (
                      <MenuItem
                        onClick={() => handleDeleteClick(row.id)}
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
                    )}
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

      {/* Dialog to add User details */}
      <Dialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
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
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => setCreateUserOpen(false)}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
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
                Create an Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Boost your employee's productivity with <br/> Digital forms.
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              <Box display="flex" gap={2} mt={-3} >
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>First Name</Typography>
                  <TextField
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    fullWidth
                    placeholder='Enter your first name'
                    variant="outlined"
                    size="small"
                    inputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '5px',
                        width: '100%',
                        '&::placeholder': {
                          fontSize: '0.8rem',
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Last Name</Typography>
                  <TextField
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    fullWidth
                    placeholder='Enter your last name'
                    variant="outlined"
                    size="small"
                    inputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '5px',
                        width: '100%',
                        '&::placeholder': {
                          fontSize: '0.8rem',
                        }
                      }
                    }}
                  />
                </Grid>
              </Box>

              <Grid item xs={12} sm={6} mt={-2}>
                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Email</Typography>
                <TextField
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  fullWidth
                  placeholder='Enter your email'
                  variant="outlined"
                  size="small"
                  inputProps={{
                    sx: {
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      width: '100%',
                      '&::placeholder': {
                        fontSize: '0.8rem',
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} mt={-2}>
                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Phone</Typography>
                <TextField
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  fullWidth
                  placeholder='Enter your phone number'
                  variant="outlined"
                  size="small"
                  inputProps={{
                    sx: {
                      backgroundColor: '#ffffff',
                      borderRadius: '5px',
                      width: '100%',
                      '&::placeholder': {
                        fontSize: '0.8rem',
                      }
                    }
                  }}
                />
              </Grid>

              <Box display="flex" gap={2} alignItems="flex-end" sx={{ width: '100%' }} mt={-2}>
                <Grid item xs={10} sm={9.5} sx={{ width: '65%' }}>
                  {/* Role Type Field */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                      Role
                    </Typography>
                    <TextField
                      name="roleId"
                      value={newUser.roleId}
                      onChange={handleRoleChange}
                      select
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    >
                      <MenuItem value="" disabled style={{ textAlign: 'center', color: 'gray' }}>
                        Select a Role
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.roleId} value={role.roleId}>
                          {role.role}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2.5} sx={{ width: '35%' }}>
                  <Button
                    variant="contained"
                    onClick={handleCreateUser}
                    fullWidth
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '20px',
                        height: '40px',
                        '&:hover': { backgroundColor: '#333' }
                    }}
                  >
                    Create
                  </Button>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

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
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={handleCloseDialog}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
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
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => setEditDialogOpen(false)}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
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
                      name="roleId"
                      value={editFormData.roleId || ''}
                      onChange={handleEditFormRoleChange}
                      select
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                      }}
                    >
                      <MenuItem value="" disabled style={{ textAlign: 'center', color: 'gray' }}>
                        Select a Role
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.roleId} value={role.roleId}>
                          {role.role}
                        </MenuItem>
                      ))}
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

      {/* Confirmation Dialog for Delete User */}
      <StyledDialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <Box sx={{ textAlign: 'center', pb: 2 }}>
          <IconButton
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => setConfirmationOpen(false)}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
            Delete User
          </Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>
            Are you sure you want to delete?
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              onClick={() => setConfirmationOpen(false)}
              sx={{
                bgcolor: 'black',
                color: 'white',
                borderRadius: '20px',
                px: 3,
                py: 1,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
              }}
            >
              No, Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeleteUser}
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: '20px',
                px: 3,
                py: 1,
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'black'
                }
              }}
            >
              Yes, Delete
            </Button>
          </Box>
        </Box>
      </StyledDialog>

      {/* Add this new Dialog for Bulk Delete */}
      <Dialog 
        open={selectedCount > 0 && confirmationOpen} 
        onClose={() => setConfirmationOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '24px',
            minWidth: '400px'
          }
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Delete Users
          </Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>
            Are you sure you want to delete these users?
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              onClick={() => setConfirmationOpen(false)}
              sx={{
                bgcolor: 'black',
                color: 'white',
                borderRadius: '20px',
                px: 3,
                py: 1,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
              }}
            >
              No, Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleBulkDeleteUsers}
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: '20px',
                px: 3,
                py: 1,
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'black'
                }
              }}
            >
              Yes, Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default Users;
