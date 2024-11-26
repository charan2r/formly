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
import sampleFormData from './formData';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';

interface form {
  templateId: number;
  name: string;
  category: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

interface EditFormData {
  name: string; 
  type: string;
  formName: string;
  description: string;
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
  const [forms, setForms] = useState<form[]>(sampleFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForms, setSelectedForms] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ name: '', type: '', category: '', lastActive: '' });
  const [orderBy, setOrderBy] = useState<keyof form>('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [formDetails, setFormDetails] = useState<Forms | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: 'Survey',
    type: 'Survey',
    formName: 'Staff',
    description: 'for office'
  });
  const [newForm, setNewForm] = useState({
        name: '',
        type: '',
        formName: '',
        description: ''
  });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Handler for form submission
   const handleUpdateForm = async () => {
    try {
      // Update the form in your forms array
      setForms(prevForms => prevForms.map(form => 
        form.templateId === selectedRowId
          ? {
              ...form,
              name: editFormData.name,
              category: editFormData.type,
              lastModifiedDate: new Date().toISOString(),
              lastModifiedBy: 'Current User' // Replace with actual user name
            }
          : form
      ));

      setEditDialogOpen(false);
      toast.success("Form updated successfully!", {
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
      toast.error("Failed to update form");
    }
  };

  const handleEditClick = (form: form | undefined) => {
    if (!form) return;
    
    setEditFormData({
      name: form.name,
      type: form.category,
      formName: form.name,
      description: 'for office' // You might want to add description to your form interface if needed
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (form: form | undefined) => {
    if (!form) return;
    setViewFormData(form);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation(); // Prevent event bubbling
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newSelectedForms = forms.reduce((acc, form) => {
      acc[form.templateId] = checked;
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
    .filter((form) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search across multiple fields
      return (
        form.name.toLowerCase().includes(searchLower) ||
        form.category.toLowerCase().includes(searchLower) ||
        form.createdBy.toLowerCase().includes(searchLower) ||
        form.lastModifiedBy.toLowerCase().includes(searchLower)
      );
    })
    .filter((form) => {
      // Apply additional filters if they exist
      const nameMatches = filters.name ? form.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const categoryMatches = filters.category ? form.category.toLowerCase().includes(filters.category.toLowerCase()) : true;
      const lastActiveMatches = filters.lastActive ? form.lastModifiedDate.toLowerCase().includes(filters.lastActive.toLowerCase()) : true;

      return nameMatches && categoryMatches && lastActiveMatches;
    })
    .sort((a, b) => {
      if (orderBy) {
        const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
        return (a[orderBy] ?? "").toString().localeCompare((b[orderBy] ?? "").toString()) * orderMultiplier;
      }
      return 0;
    });

  const selectedCount = Object.values(selectedForms).filter(Boolean).length;

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleCloseCreateDialog = () => {
    setCreateFormOpen(false);
    setNewForm({
      name: '',
      type: '',
      formName: '',
      description: ''
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({
      name: '',
      type: '',
      formName: '',
      description: ''
    });
  };

  const handleShareClick = () => {
    // Generate or get your share URL here
    setShareUrl('https://www.example.com/share/form/' + selectedRowId);
    setShareDialogOpen(true);
    handleMenuClose();
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
                onClick={() => setCreateFormOpen(true)}
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',  // Add this
                                    paddingLeft: '16px'  // Add this for some spacing
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Form Name
                                </TableSortLabel>
                                {showFilters && (
                                    <div style={{ position: 'absolute', top: '70%', width: '45%', right: 0 }}>
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',  // Add this
                                    paddingLeft: '16px'  // Add this for some spacing
                                }}
                            >
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',
                                    paddingLeft: '16px'
                                }}
                            >
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',
                                    paddingLeft: '16px'
                                }}
                            >
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',
                                    paddingLeft: '16px'
                                }}
                            >
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
                            <TableCell 
                                sx={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '4px', 
                                    position: 'relative',
                                    textAlign: 'left',
                                    paddingLeft: '16px'
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'lastModifiedBy'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('lastModifiedBy')}
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
                            <TableRow key={row.templateId} sx={{ height: '60px' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={!!selectedForms[row.templateId]}
                                        onChange={() => handleSelectForm(row.templateId)}
                                    />
                                </TableCell>
                                <TableCell padding="checkbox" />
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>{row.name}</TableCell>
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>{row.category}</TableCell>
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>
                                    {row.createdDate}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>{row.createdBy}</TableCell>
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>
                                    {row.lastModifiedDate}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'left', paddingLeft: '16px' }}>{row.lastModifiedBy}</TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton onClick={(event) => handleMenuOpen(event, row.templateId)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={menuAnchor}
                                        open={Boolean(menuAnchor) && selectedRowId === row.templateId}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'center',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
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
                                                handleEditClick(forms.find(form => form.templateId === selectedRowId)!);
                                                handleMenuClose();
                                            }}
                                            sx={{
                                                backgroundColor: 'white',
                                                borderRadius: '10px',
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
                                            onClick={() => {
                                                handleViewClick(forms.find(form => form.templateId === selectedRowId));
                                            }}
                                            sx={{
                                                backgroundColor: 'white',
                                                borderRadius: '10px',
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
                                            onClick={handleShareClick}
                                            sx={{
                                                backgroundColor: 'white',
                                                borderRadius: '10px',
                                                margin: '5px',
                                                justifyContent: 'center',
                                                fontSize: '0.875rem',
                                                minHeight: '30px',
                                                minWidth: '100px',
                                                '&:hover': { backgroundColor: '#f0f0f0' },
                                            }}
                                        >
                                            Share
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleDeleteConfirmation(selectedRowId!.toString());
                                                handleMenuClose();
                                            }}
                                            sx={{
                                                backgroundColor: 'white',
                                                borderRadius: '10px',
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
                                    </Menu>
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
      <Dialog 
        open={confirmationOpen} 
        onClose={() => setConfirmationOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Back arrow */}
          <IconButton
            onClick={() => setConfirmationOpen(false)}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Content */}
          <Box sx={{ 
            textAlign: 'center', 
            mt: 3 
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              mb: 2
            }}>
              Delete Form
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
              Are you sure you want to delete?
            </Typography>

            {/* Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2
            }}>
              <Button
                onClick={() => setConfirmationOpen(false)}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                No, Cancel
              </Button>
              
              <Button
                onClick={handleDeleteForm}
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Yes, Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmationBulkOpen} 
        onClose={() => setConfirmationBulkOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setConfirmationBulkOpen(false)}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ 
            textAlign: 'center', 
            mt: 3 
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              mb: 2
            }}>
              Delete Forms
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
              Are you sure you want to delete selected forms?
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2
            }}>
              <Button
                onClick={() => setConfirmationBulkOpen(false)}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                No, Cancel
              </Button>
              
              <Button
                onClick={handleDeleteForms}
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Yes, Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Create Form Dialog */}
      <Dialog
                open={createFormOpen}
                onClose={handleCloseCreateDialog}
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
                        onClick={handleCloseCreateDialog}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    {/* Header section */}
                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'center', mb: 3, mt: 2 }}>
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
                            Create
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
             {/* Add Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
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
                        onClick={handleCloseEditDialog}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    {/* Header section */}
                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'center', mb: 3, mt: 2 }}>
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
                                        name="type"
                                        value={editFormData.type}
                                        size="small"
                                        onChange={handleEditFormChange}
                                        fullWidth
                                        InputProps={{
                                            sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                        }}
                                    >
                                        <MenuItem value="Employees">Employees</MenuItem>
                                        <MenuItem value="Survey">Survey</MenuItem>
                                        {/* Add more options as needed */}
                                    </TextField>
                                </Box>

                                {/* Page Size Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>
                                        Template Type
                                    </Typography>
                                    <TextField
                                        name="formName"
                                        value={editFormData.formName}
                                        size="small"
                                        onChange={handleEditFormChange}
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
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    InputProps={{ 
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
                                    name="description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
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
                            onClick={() => setEditDialogOpen(false)}
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
                            onClick={handleUpdateForm}
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

      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Close button */}
          <IconButton
            onClick={() => setShareDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: -12,
              top: -12,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Dialog title */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Share with
          </Typography>

          {/* Share options */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            mb: 4 
          }}>
            <IconButton
              onClick={() => {
                const subject = encodeURIComponent('Shared Form');
                const body = encodeURIComponent(`I'd like to share this form with you: ${shareUrl}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              sx={{
                backgroundColor: '#FFF0F0',
                width: 56,
                height: 56,
                '&:hover': { backgroundColor: '#FFE0E0' }
              }}
            >
              <EmailIcon />
            </IconButton>
            
            <IconButton
              sx={{
                backgroundColor: '#FFF0F0',
                width: 56,
                height: 56,
                '&:hover': { backgroundColor: '#FFE0E0' }
              }}
            >
              <DescriptionIcon />
            </IconButton>
            
            <IconButton
              sx={{
                backgroundColor: '#FFF0F0',
                width: 56,
                height: 56,
                '&:hover': { backgroundColor: '#FFE0E0' }
              }}
            >
              <PrintIcon />
            </IconButton>
          </Box>

          {/* Share link */}
          <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
            Or share with link
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '8px 12px',
          }}>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {shareUrl}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Dialog>

      <ToastContainer></ToastContainer>
    </Paper>
  );
};

export default FormTable;
