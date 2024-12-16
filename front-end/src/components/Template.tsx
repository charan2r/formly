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
    Box,
    Pagination,
    TableSortLabel,
    Popover,
    DialogActions,
    DialogContent,
    Dialog,
    DialogTitle,
    Grid,
    CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

interface Template {
    formTemplateId: string;
    name: string;
    description: string;
    version: number;
    status: string;
    category: {
        categoryId: string;
        name: string;
    };
    createdDate: string;
    lastModifiedDate: string;
    // ... other optional fields
}

interface Category {
    categoryId: number;
    name: string;
    description: string;
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

const Template: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ name: '', category: '', createdDate: '', lastModifiedDate: '' });
    const [orderBy, setOrderBy] = useState<'name' | 'category' | 'createdDate' | 'lastModifiedDate'>('name');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
    const [templateDetails, setTemplateDetails] = useState<Templates | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        categoryId: '',
        pageSize: 'A4',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editTemplateOpen, setEditTemplateOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        categoryId: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/form-templates');
                console.log(response.data);
                // Filter Templates where the status is 'active'
                const activeTemplates = response.data.data
                // console.log(activeTemplates);
                setTemplates(response.data.data);
            } catch (error) {
                console.error('Error fetching templates data:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get(`/categories/organization/${user?.organizationId}`);
                console.log(response.data);
                setCategories(response.data.data);
                const activeCategories = response.data.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchTemplates();
        fetchCategories();
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, templateId: string) => {
        setMenuAnchor(event.currentTarget);
        setSelectedRowId(templateId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedRowId(null);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedTemplates(templates.map(template => template.formTemplateId));
        } else {
            setSelectedTemplates([]);
        }
    };

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplates(prev => {
            if (prev.includes(templateId)) {
                return prev.filter(id => id !== templateId);
            } else {
                return [...prev, templateId];
            }
        });
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

    const handleRequestSort = (property: keyof Template) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleDeleteConfirmation = (templateId: string) => {
        setTemplateToDelete(templateId);
        setConfirmationOpen(true);
    };

    const handleBulkDeleteConfirmation = () => {
        if (selectedTemplates.length > 0) {
            setConfirmationBulkOpen(true);
        } else {
            toast.warning('Please select templates to delete', toastConfig);
        }
    };

    // Common toast style configuration
    const toastConfig = {
        position: "top-right" as const,
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
    };

    const handleCreateTemplate = async () => {
        try {
            console.log(newTemplate);
            const response = await api.post('/form-templates/create', {
                ...newTemplate,
                organizationId: user?.organizationId,
                categoryId: newTemplate.categoryId,
                pageSize: newTemplate.pageSize,
                status: 'active',
                version: 1
            });
            setTemplates([...templates, response.data]);
            setCreateTemplateOpen(false);

            toast.success("Template has been created successfully!", toastConfig);

            // Navigate to edittemplate route with formTemplateId as parameter
            navigate(`/edittemplate/${response.data.formTemplateId}`, {
                state: { templateData: response.data }
            });
        } catch (error) {
            toast.error("Failed to create template. Please try again.", toastConfig);
        }
    };

    const handleDeleteTemplates = async () => {
        try {
            await api.delete('/form-templates/bulk-delete', {
                data: { ids: Object.keys(selectedTemplates) },
            });

            setTemplates((prevTemplates) =>
                prevTemplates.filter(temp => !Object.keys(selectedTemplates).includes(temp.formTemplateId))
            );

            setSelectedTemplates({});
            setConfirmationBulkOpen(false);

            toast.success("Templates have been deleted successfully!", toastConfig);
        } catch (error) {
            toast.error("Failed to delete the Templates. Please try again.", toastConfig);
        }
    };

    const handleDeleteTemplate = async () => {
        if (!templateToDelete) return;

        try {
            setLoading(true);
            console.log('Deleting template with ID:', templateToDelete);

            const response = await api.delete(`/form-templates/delete?id=${templateToDelete}`);
            console.log('Single Delete API Response:', response.data);

            if (response.data.status === 'success') {
                setTemplates(prev => prev.filter(template => template.formTemplateId !== templateToDelete));
                toast.success("Template deleted successfully!", toastConfig);
            } else {
                console.error('Delete failed:', response.data.message);
                toast.error("Failed to delete template", toastConfig);
            }
        } catch (error) {
            console.error('Delete error:', error);
            console.error('Error response:', error.response?.data);
            toast.error("Failed to delete template. Please try again.", toastConfig);
        } finally {
            setLoading(false);
            setConfirmationOpen(false);
            setTemplateToDelete(null);
        }
    };

    const StyledDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialog-paper': {
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%'
        }
    }));

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setTemplateDetails(null);
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return category?.name || 'N/A';
    };

    const filteredData = templates
        .filter((temp) => {
            const nameMatches = temp.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                temp.name?.toLowerCase().includes(filters.name.toLowerCase());

            const categoryMatches = temp.category?.name
                ? temp.category.name.toLowerCase()
                    .includes(filters.category.toLowerCase())
                : !filters.category;

            const createdDateMatches = temp.createdDate
                ? new Date(temp.createdDate).toLocaleDateString().toLowerCase()
                    .includes(filters.createdDate.toLowerCase())
                : !filters.createdDate;

            const lastModifiedDateMatches = temp.lastModifiedDate
                ? new Date(temp.lastModifiedDate).toLocaleDateString().toLowerCase()
                    .includes(filters.lastModifiedDate.toLowerCase())
                : !filters.lastModifiedDate;

            return nameMatches && categoryMatches && createdDateMatches && lastModifiedDateMatches;
        })
        .sort((a, b) => {
            const orderMultiplier = orderDirection === 'asc' ? 1 : -1;

            switch (orderBy) {
                case 'name':
                    return (a.name || "").localeCompare(b.name || "") * orderMultiplier;
                case 'category':
                    return (a.category?.name || "").localeCompare(b.category?.name || "") * orderMultiplier;
                case 'createdDate':
                    return (new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) * orderMultiplier;
                case 'lastModifiedDate':
                    return (new Date(a.lastModifiedDate).getTime() - new Date(b.lastModifiedDate).getTime()) * orderMultiplier;
                default:
                    return 0;
            }
        });

    const selectedCount = Object.values(selectedTemplates).filter(Boolean).length;

    const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleEditTemplate = async () => {
        try {
            const response = await api.patch(
                `/form-templates/edit?id=${selectedTemplate?.formTemplateId}`, editFormData
            );

            setTemplates(prevTemplates =>
                prevTemplates.map(temp =>
                    temp.formTemplateId === selectedTemplate?.formTemplateId
                        ? { ...temp, ...response.data }
                        : temp
                )
            );

            setEditTemplateOpen(false);
            toast.success("Template has been updated successfully!", toastConfig);
        } catch (error) {
            toast.error("Failed to update template. Please try again.", toastConfig);
        }
    };

    const handleDelete = async (templateId: string) => {
        try {
            setLoading(true);
            const response = await api.delete(`/form-templates/delete?id=${templateId}`);

            if (response.data.status === 'success') {
                toast.success('Template deleted successfully', toastConfig);
                setTemplates(prev => prev.filter(template => template.formTemplateId !== templateId));
            }
        } catch (error) {
            toast.error('Failed to delete template', toastConfig);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedTemplates.length === 0) {
            toast.warning('Please select templates to delete', toastConfig);
            return;
        }

        try {
            setLoading(true);
            console.log('Deleting templates with IDs:', selectedTemplates);

            const response = await api.delete('/form-templates/bulk-delete', {
                data: { ids: selectedTemplates }
            });
            console.log('Bulk Delete API Response:', response.data);

            if (response.data.status === 'success') {
                setTemplates(prev => prev.filter(template => !selectedTemplates.includes(template.formTemplateId)));
                setSelectedTemplates([]);
                toast.success(`Successfully deleted ${selectedTemplates.length} templates`, toastConfig);
            } else {
                console.error('Bulk delete failed:', response.data.message);
                toast.error("Failed to delete templates", toastConfig);
            }
        } catch (error) {
            console.error('Bulk delete error:', error);
            console.error('Error response:', error.response?.data);
            toast.error("Failed to delete templates. Please try again.", toastConfig);
        } finally {
            setLoading(false);
            setConfirmationBulkOpen(false);
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
                        Atlas corp.
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
                    <Typography variant="body2" color="textSecondary">
                        Templates Repository
                    </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">Templates Repository</Typography>
                <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
                    Manage your templates here.
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="span">
                        <strong>All templates</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
                            (user?.userType === 'Admin' || user?.permissions?.includes('Delete Template')) && (
                                <Button
                                    variant="contained"
                                    onClick={() => handleBulkDeleteConfirmation()}
                                    sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                                >
                                    <Delete sx={{ marginRight: 1 }} />
                                    Delete
                                </Button>
                            )
                        ) : (
                            (user?.userType === 'Admin' || user?.permissions?.includes('Create Template')) && (
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                                    onClick={() => setCreateTemplateOpen(true)}
                                >
                                    <AddIcon sx={{ marginRight: 1 }} />
                                    Add Templates
                                </Button>
                            )
                        )}
                    </Box>
                </Box>
            </Box>
            <TableContainer sx={{ overflow: 'auto' }}>
                <Table stickyHeader sx={{ marginTop: '25px' }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                padding="checkbox"
                                sx={{
                                    backgroundColor: '#f9f9f9',
                                    borderStartStartRadius: '20px',
                                    borderEndStartRadius: '20px',
                                    padding: '8px',
                                    height: '48px',
                                    width: '48px'
                                }}
                            >
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        templates.length > 0 &&
                                        templates.every((temp) => selectedTemplates.includes(temp.formTemplateId))
                                    }
                                    indeterminate={
                                        templates.some((temp) => selectedTemplates.includes(temp.formTemplateId)) &&
                                        !templates.every((temp) => selectedTemplates.includes(temp.formTemplateId))
                                    }
                                />
                            </TableCell>
                            <TableCell sx={{
                                backgroundColor: '#f9f9f9',
                                padding: '8px',
                                height: '48px',
                                width: '30%'
                            }}>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Template Name
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
                            <TableCell sx={{
                                backgroundColor: '#f9f9f9',
                                padding: '8px',
                                height: '48px',
                                width: '25%'
                            }}>
                                <TableSortLabel
                                    active={orderBy === 'category'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('category')}
                                >
                                    Category
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
                            <TableCell sx={{
                                backgroundColor: '#f9f9f9',
                                padding: '8px',
                                height: '48px',
                                width: '20%'
                            }}>
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
                            <TableCell sx={{
                                backgroundColor: '#f9f9f9',
                                padding: '8px',
                                height: '48px',
                                width: '20%'
                            }}>
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
                            <TableCell sx={{
                                backgroundColor: '#f9f9f9',
                                padding: '8px',
                                width: '48px',
                                height: '48px',
                                borderStartEndRadius: '20px',
                                borderEndEndRadius: '20px'
                            }} />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow
                                key={row.formTemplateId}
                                sx={{
                                    height: '48px',
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                <TableCell padding="checkbox" sx={{ width: '48px' }}>
                                    <Checkbox
                                        checked={selectedTemplates.includes(row.formTemplateId)}
                                        onChange={() => handleSelectTemplate(row.formTemplateId)}
                                    />
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{getCategoryName(row.categoryId)}</TableCell>
                                <TableCell>
                                    {new Date(row.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </TableCell>
                                <TableCell>
                                    {new Date(row.updatedAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton onClick={(event) => handleMenuOpen(event, row.formTemplateId)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Popover
                                        open={Boolean(menuAnchor) && selectedRowId === row.formTemplateId}
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
                                        {(user?.userType === 'Admin' || user?.permissions?.includes('View Template')) && (
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    setSelectedTemplate(row);
                                                    navigate(`/viewtemplate/${row.formTemplateId}`, {
                                                        state: { templateData: row }
                                                    });
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
                                        )}
                                        {(user?.userType === 'Admin' || user?.permissions?.includes('Edit Template')) && (
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose();
                                                    setSelectedTemplate(row);
                                                    navigate(`/edittemplate/${row.formTemplateId}`, {
                                                        state: { templateData: row }
                                                    });
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
                                        )}
                                        {(user?.userType === 'Admin' || user?.permissions?.includes('Delete Template')) && (
                                            <MenuItem
                                                onClick={() => handleDeleteConfirmation(row.formTemplateId)}
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

            {/* Single Delete Confirmation Dialog */}
            <Dialog
                open={confirmationOpen}
                onClose={() => {
                    setConfirmationOpen(false);
                    setTemplateToDelete(null);
                }}
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
                        Delete Template
                    </Typography>
                    <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                        Are you sure you want to delete this template?
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center'
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setConfirmationOpen(false);
                                setTemplateToDelete(null);
                            }}
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
                            onClick={handleDeleteTemplate}
                            disabled={loading}
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
                            {loading ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog
                open={confirmationBulkOpen}
                onClose={() => setConfirmationBulkOpen(false)}
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
                        Delete Templates
                    </Typography>
                    <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                        Are you sure you want to delete {selectedTemplates.length} selected template{selectedTemplates.length > 1 ? 's' : ''}?
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center'
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => setConfirmationBulkOpen(false)}
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
                            onClick={handleBulkDelete}
                            disabled={loading}
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
                            {loading ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Dialog to add template details */}
            <Dialog
                open={createTemplateOpen}
                onClose={() => setCreateTemplateOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '16px',
                        maxWidth: '550px',
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
                        onClick={() => setCreateTemplateOpen(false)}
                    >
                        <ArrowBackIcon sx={{ fontSize: 22 }} />
                    </IconButton>

                    {/* Header section */}
                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'center', mb: 4, mt: 2 }}>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Create Template
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create custom template for your enterprise needs
                            </Typography>
                        </Box>
                    </Box>

                    {/* Form Content */}
                    <DialogContent sx={{ px: 3, ml: 5, mr: 5 }}>
                        <Box display="flex" flexDirection="column" gap={2.5}>
                            <Grid item xs={12} sm={6} mt={-2.5}>
                                    <Typography variant="subtitle2" gutterBottom sx={{
                                        mb: 0.5,
                                        color: '#555',
                                        fontWeight: 500
                                    }}>
                                        Template Name
                                    </Typography>
                                    <TextField
                                        value={newTemplate.name}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            sx: {
                                                backgroundColor: '#ffffff',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                '&:focus': {
                                                    boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
                                                }
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Category and Page Size */}
                                <Grid item xs={12} container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" gutterBottom sx={{
                                            mb: 0.5,
                                            color: '#555',
                                            fontWeight: 500
                                        }}>
                                            Category
                                        </Typography>
                                        <TextField
                                            select
                                            value={newTemplate.categoryId}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, categoryId: e.target.value })}
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                sx: {
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    height: '40px'
                                                }
                                            }}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" gutterBottom sx={{
                                            mb: 0.5,
                                            color: '#555',
                                            fontWeight: 500
                                        }}>
                                            Page Size
                                        </Typography>
                                        <TextField
                                            select
                                            value={newTemplate.pageSize}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, pageSize: e.target.value })}
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                sx: {
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    height: '40px'
                                                }
                                            }}
                                        >
                                            <MenuItem value="A4">A4</MenuItem>
                                            <MenuItem value="A3">A3</MenuItem>
                                            <MenuItem value="Letter">Letter</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom sx={{
                                        mb: 0.5,
                                        color: '#555',
                                        fontWeight: 500
                                    }}>
                                        Description
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={newTemplate.description}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#ffffff',
                                                borderRadius: '8px',
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '8px 12px'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                           
                        </Box>
                    </DialogContent>

                    {/* Actions */}
                    <DialogActions sx={{
                        p: 3, 
                        justifyContent: 'center'
                    }}>
                        <Button
                            variant="contained"
                            onClick={handleCreateTemplate}
                            disabled={!newTemplate.name || !newTemplate.categoryId || !newTemplate.pageSize || isSubmitting}
                            sx={{
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                borderRadius: '25px',
                                width: '120px',
                                padding: '8px 16px',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#333'
                                },
                                '&:disabled': {
                                    backgroundColor: '#666',
                                    color: '#fff'
                                }
                            }}
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={editTemplateOpen}
                onClose={() => setEditTemplateOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '16px',
                        backgroundColor: '#f9f9f9',
                    }
                }}
            >
                <DialogTitle>Edit Template</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Template Name"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Category"
                            value={editFormData.categoryId}
                            onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                            fullWidth
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ 
                            backgroundColor: '#f5f5f5',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                        onClick={() => setEditTemplateOpen(false)}
                    >
                        <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
                    </Button>
                    <Button
                        onClick={handleEditTemplate}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': { backgroundColor: '#333' }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer></ToastContainer>

            {/* Loading Overlay */}
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}


        </Paper >
    );
};

export default Template;
