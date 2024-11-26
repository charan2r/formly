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
  Grid,
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
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


interface form {
  formId: string;
  name: string;
  category?: string | null;
  createdBy: string;
  lastModifiedDate: string;
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

const FormTable: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForms, setSelectedForms] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ name: '', type: '', category: '', lastActive: '' });
  const [orderBy, setOrderBy] = useState<keyof Form>('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [formDetails, setFormDetails] = useState<Forms | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormForm | null>(null);
  const [newForm, setNewForm] = useState({
        name: 'Google',
        type: 'Employees',
        formName: 'Staff',
        description: 'for office'
  });


  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/form');
        // Filter form where the status is 'active'
        const activeForms = response.data.data.filter(frm => frm.status === 'active');
        console.log(activeForms);
        setForms(activeForms);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchForms();
  }, []);

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

   // Handler for form submission
   const handleUpdateForm = async () => {
    if (!editFormData) return;

    try {
      await axios.put(`http://localhost:3001/forms/${editFormData.id}`, editFormData);
      // Refresh the users list
      const response = await axios.get('http://localhost:3001/forms?organizationId=a27affb6-a80a-41a1-bb8f-a57db98417b9');
      setOrganizations(response.data.data);
      setEditDialogOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };


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
    const newSelectedForms = forms.reduce((acc, frm) => {
      acc[frm.formId] = checked;  // Apply the same checked state to all forms
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedForms(newSelectedForms);
  };


  const handleSelectForm = (id: number) => {
    setSelectedForms((prev) => ({
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

  const handleRequestSort = (property: keyof form) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteConfirmation = (formId: string) => {
    setFormToDelete(formId);
    setConfirmationOpen(true);
  };

  const handleBulkDeleteConfirmation = () => {
    setConfirmationBulkOpen(true);
  };



  const handleDeleteForms = async () => {

    try {
      const response = await axios.delete('http://localhost:3001/form/bulk-delete', {
        data: { ids: Object.keys(selectedForms) },
      });

      // Filter out the organizations that were deleted
      setForms((prevForms) =>
        prevForms.filter(frm => !Object.keys(selectedForms).includes(frm.formId))
      );

      toast.success("Form has been deleted successfully!", {
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

      setSelectedForms([]);
      setConfirmationBulkOpen(false);
    } catch (error) {
      toast.error("Failed to delete the form. Please try again.", {
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
    };
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormDetails(null);
  };
  

  const handleCreateForm = async () => {
    try {
        const response = await axios.post('http://localhost:3001/form', newForm);
        setForms([...forms, response.data]);
        setCreateFormOpen(false);
        toast.success("Form created successfully!");
    } catch (error) {
        toast.error("Failed to create form");
    }
  };

  // Method to handle deletion of an organization
  const handleDeleteForm = async () => {
    try {
      await axios.delete(`http://localhost:3001/form/delete?id=${formToDelete}`);
      setForms((prev) => prev.filter((frm) => frm.formId !== formToDelete));
      setConfirmationOpen(false); // Close confirmation dialog
      toast.success("Form has been deleted successfully!", {
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
      toast.error("Failed to delete the form. Please try again.", {
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

  const filteredData = forms
    .filter((frm) => {
      const nameMatches = frm.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        frm.name.toLowerCase().includes(filters.name.toLowerCase());

      const categoryMatches = frm.category
        ? frm.category.toLowerCase().includes(filters.category.toLowerCase())
        : !filters.category; // If org.category is null, match only if filters.category is empty

      const lastActiveMatches = frm.lastActive
        ? frm.lastActive.toLowerCase().includes(filters.lastActive.toLowerCase())
        : !filters.lastActive; // If org.lastActive is null, match only if filters.lastActive is empty

      return nameMatches && categoryMatches && lastActiveMatches;
    })
    .sort((a, b) => {
      const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
      return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
    });

  const selectedCount = Object.values(selectedForms).filter(Boolean).length;

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
          Form Repostory
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Form Repostory</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
        Manage your forms here.
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="span">
            <strong>All forms</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
                onClick={() => setEditDialogOpen(true)}
              >
                <AddIcon sx={{ marginRight: 1 }} />
                Add Form
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
                                        forms.length > 0 &&
                                        forms.every((frm) => selectedForms[frm.formId])
                                    }
                                    indeterminate={
                                        forms.some((frm) => selectedForms[frm.formId]) &&
                                        !forms.every((frm) => selectedForms[frm.formId])
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
                                    Form Name
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
                                    Type
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
                                    active={orderBy === 'createdDate'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('createdDate')}
                                >
                                    Created Date
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
                                            value={filters.createdDate}
                                            onChange={(e) => handleFilterChange(e, 'createdDate')}
                                            sx={{ width: '100%', marginTop: '4px' }}
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                                <TableSortLabel
                                    active={orderBy === 'createdBy'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('createdBy')}
                                >
                                    Created By
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
                                            value={filters.createdBy}
                                            onChange={(e) => handleFilterChange(e, 'createdBy')}
                                            sx={{ width: '100%', marginTop: '4px' }}
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                                <TableSortLabel
                                    active={orderBy === 'lastModifiedDate'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('lastModifiedDate')}
                                >
                                    Last Modified Date
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
                                            value={filters.lastModifiedDate}
                                            onChange={(e) => handleFilterChange(e, 'lastModifiedDate')}
                                            sx={{ width: '100%', marginTop: '4px' }}
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                                <TableSortLabel
                                    active={orderBy === 'lastModifiedBy'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('lastModifiedByy')}
                                >
                                    Last Modified By
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
                                            value={filters.lastModifiedBy}
                                            onChange={(e) => handleFilterChange(e, 'lastModifiedBy')}
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
                            <TableRow key={row.formId} sx={{ height: '60px' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={!!selectedForms[row.formId]}
                                        onChange={() => handleSelectForms(row.formId)}
                                    />
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{new Date(row.createdDate).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}</TableCell>
                                <TableCell>{row.createdBy}</TableCell>
                                <TableCell>{new Date(row.lastModifiedDate).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}</TableCell>
                                <TableCell>{row.lastModifiedBy}</TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton onClick={(event) => handleMenuOpen(event, row.formId)}>
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
                      onClick={() => {
                        handleMenuClose();
                        navigate(`/edit-form/${row.formId}`);
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
                        navigate(`/share-form/${row.formId}`);
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
                      Share
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteConfirmation(row.formId)}
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
          <Typography>Are you sure you want to delete this form?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="black">
            Cancel
          </Button>
          <Button onClick={handleDeleteForm} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationBulkOpen} onClose={() => setConfirmationBulkOpen(false)} sx={{}}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete these forms?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationBulkOpen(false)} color="black">
            Cancel
          </Button>
          <Button onClick={handleDeleteForms} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Form Dialog */}
      <Dialog
                open={createFormOpen}
                onClose={() => setCreateFormOpen(false)}
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
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Create Form
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Boost your employee’s productivity with digital forms.
                            </Typography>
                        </Box>


                    </Box>

                    <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
                        <Box display="flex" flexDirection="column" gap={2.5}>
                            {/* First Row: Form Type and Page Size */}
                            <Box display="flex" gap={2} width="100%">
                                {/* Form Type Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                                     Template
                                    </Typography>
                                    <TextField
                                        select
                                        value={newForm.type}
                                        size="small"
                                        onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                                        fullWidth
                                        InputProps={{
                                            sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                        }}
                                    >
                                        <MenuItem value="Employees">Employees</MenuItem>
                                        {/* Add more options as needed */}
                                    </TextField>
                                </Box>

                                {/* Page Size Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                                        Template Type
                                    </Typography>
                                    <TextField
                                        value={newForm.formName}
                                        size="small"
                                        onChange={(e) => setNewForm({ ...newForm, formName: e.target.value })}
                                        fullWidth
                                        InputProps={{
                                            sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Second Row: Form Name */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Form Name</Typography>
                                <TextField
                                    value={newForm.name}
                                    InputProps={{ 
                                        readOnly: true,
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} mt={-2}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Description</Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={newForm.description}
                                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                                    InputProps={{
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                    }}
                                />
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 5 }}>
                        <Button
                            variant="contained"
                            onClick={() => console.log('Preview clicked')} // Add your preview logic here
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '20px',
                                width: '30%',
                                marginTop: '-20px',
                                marginBottom: '-25px',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Preview
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateForm}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '20px',
                                width: '30%',
                                marginTop: '-20px',
                                marginBottom: '-25px',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Create
                        </Button>
                    </DialogActions>
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
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Update a Form
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Boost your employee’s productivity
                            with digital forms.
                            </Typography>
                        </Box>


                    </Box>

                    <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
                        <Box display="flex" flexDirection="column" gap={2.5}>
                            {/* First Row: Form Type and Page Size */}
                            <Box display="flex" gap={2} width="100%">
                                {/* Form Type Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                                     Template
                                    </Typography>
                                    <TextField
                                        select
                                        value={newForm.type}
                                        size="small"
                                        onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                                        fullWidth
                                        InputProps={{
                                            sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                        }}
                                    >
                                        <MenuItem value="Employees">Employees</MenuItem>
                                        <MenuItem value="Employees">Survey</MenuItem>
                                        {/* Add more options as needed */}
                                    </TextField>
                                </Box>

                                {/* Page Size Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                                        Template Type
                                    </Typography>
                                    <TextField
                                        value={newForm.formName}
                                        size="small"
                                        onChange={(e) => setNewForm({ ...newForm, formName: e.target.value })}
                                        fullWidth
                                        InputProps={{
                                            sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Second Row: Form Name */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Form Name</Typography>
                                <TextField
                                    value={newForm.name}
                                    InputProps={{ 
                                        readOnly: false,
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} mt={-2}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Description</Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={newForm.description}
                                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                                    InputProps={{
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                    }}
                                />
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 5 }}>
                        <Button
                            variant="contained"
                            onClick={() => console.log('Preview clicked')} // Add your preview logic here
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '20px',
                                width: '30%',
                                marginTop: '-20px',
                                marginBottom: '-25px',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Preview
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateForm}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '20px',
                                width: '30%',
                                marginTop: '-20px',
                                marginBottom: '-25px',
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Box>
      </Dialog>

      <ToastContainer></ToastContainer>
    </Paper>
  );
};

export default FormTable;
