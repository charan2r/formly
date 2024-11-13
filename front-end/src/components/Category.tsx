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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Category {
    categoryId: number;
    name: string;
    createdDate: string;
    createdBy: string;
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

const Category: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ name: '', createdBy: '', createdAt: '' });
    const [orderBy, setOrderBy] = useState<keyof Category>('name');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [categoryDetails, setCategoryDetails] = useState<Categories | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        createdBy: '',
        createdAt: ''
    });


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/category');
                // Filter Categories where the status is 'active'
                const activeCategories = response.data.data.filter(cat => cat.status === 'active');
                console.log(activeCategories);
                setCategories(activeCategories);
            } catch (error) {
                console.error('Error fetching categories data:', error);
            }
        };

        fetchCategories();
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
        const newSelectedCategories = categories.reduce((acc, temp) => {
            acc[temp.categoryId] = checked;  // Apply the same checked state to all Categories
            return acc;
        }, {} as Record<number, boolean>);

        setSelectedCategories(newSelectedCategories);
    };


    const handleSelectCategory = (id: number) => {
        setSelectedCategories((prev) => ({
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

    const handleRequestSort = (property: keyof Category) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleDeleteConfirmation = (templateId: string) => {
        setCategoryToDelete(templateId);
        setConfirmationOpen(true);
    };

    const handleBulkDeleteConfirmation = () => {
        setConfirmationBulkOpen(true);
    };

    const handleCreateCategory = async () => {
        try {
            const response = await axios.post('http://localhost:3001/category', newCategory);
            setCategories([...categories, response.data]);
            setCreateCategoryOpen(false);
            toast.success("Category created successfully!");
        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    const handleDeleteCategories = async () => {
        try {
            const response = await axios.delete('http://localhost:3001/category/bulk-delete', {
                data: { ids: Object.keys(selectedCategories) },
            });

            // Filter out the categoires that were deleted
            setCategories((prevCategories) =>
                prevCategories.filter(cat => !Object.keys(selectedCategories).includes(cat.categoryId))
            );

            toast.success("Category has been deleted successfully!", {
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

            setSelectedCategories([]);
            setConfirmationBulkOpen(false);
        } catch (error) {
            toast.error("Failed to delete the Category. Please try again.", {
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

    // Method to handle deletion of an category
    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:3001/category/delete?id=${categoryToDelete}`);
            setCategories((prev) => prev.filter((cat) => cat.categoryId !== categoryToDelete));
            setConfirmationOpen(false); 
            toast.success("Category has been deleted successfully!", {
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
            toast.error("Failed to delete the Category. Please try again.", {
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

    const filteredData = categories
        .filter((cat) => {
            const nameMatches = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                cat.name.toLowerCase().includes(filters.name.toLowerCase());

            const createdByMatches = cat.createdBy
                ? cat.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())
                : !filters.createdBy;

            const createdAtMatches = cat.createdAt
                ? cat.createdAt.toLowerCase().includes(filters.createdAt.toLowerCase())
                : !filters.createdAt;

            return nameMatches && createdByMatches && createdAtMatches;
        })
        .sort((a, b) => {
            const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
            return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
        });

    const selectedCount = Object.values(selectedCategories).filter(Boolean).length;

    const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setCategoryDetails(null);
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
                        Atlas corp.
                    </Typography>
                    <ArrowForward style={{ color: 'black' }} />
                    <Typography variant="body2" color="textSecondary">
                        Category management
                    </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">Category Managment</Typography>
                <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
                    Manage your categories here.
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="span">
                        <strong>All categories</strong> <span style={{ color: 'gray' }}>{filteredData.length}</span>
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
                                onClick={() => setCreateCategoryOpen(true)}
                            >
                                <AddIcon sx={{ marginRight: 1 }} />
                                Add Categories
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
                                        categories.length > 0 &&
                                        categories.every((cat) => selectedCategories[cat.categoryId])
                                    }
                                    indeterminate={
                                        categories.some((cat) => selectedCategories[cat.categoryId]) &&
                                        !categories.every((cat) => selectedCategories[cat.categoryId])
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
                                    Name
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
                                    active={orderBy === 'createdBy'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('createdBy')}
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
                                            value={filters.createdBy}
                                            onChange={(e) => handleFilterChange(e, 'createdBy')}
                                            sx={{ width: '100%', marginTop: '4px' }}
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderDirection}
                                    onClick={() => handleRequestSort('createdAt')}
                                >
                                    Created at
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
                                            value={filters.createdAt}
                                            onChange={(e) => handleFilterChange(e, 'createdAt')}
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
                            <TableRow key={row.categoryId} sx={{ height: '60px' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={!!selectedCategories[row.categoryId]}
                                        onChange={() => handleSelectCategory(row.categoryId)}
                                    />
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.createdBy}</TableCell>
                                <TableCell>{new Date(row.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}</TableCell>
                                                                <TableCell padding="checkbox">
                                    <IconButton onClick={(event) => handleMenuOpen(event, row.categoryId)}>
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
                                                navigate(`/view-category/${row.categoryId}`);
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
                                            onClick={() => {
                                                handleMenuClose();
                                                navigate(`/edit-category/${row.categoryId}`);
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
                                            onClick={() => handleDeleteConfirmation(row.categoryId)}
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
                    <Typography>Are you sure you want to delete this category?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCategory} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Confirmation Dialog */}
            <Dialog open={confirmationBulkOpen} onClose={() => setConfirmationBulkOpen(false)} sx={{}}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete these categories?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationBulkOpen(false)} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCategories} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create category Dialog */}
            <Dialog
                open={createCategoryOpen}
                onClose={() => setCreateCategoryOpen(false)}
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
                        <Box sx={{ textAlign: 'left', marginRight:'40px' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Create a Category
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Boost your employee's productivity with digital forms.
                            </Typography>
                        </Box>


                    </Box>

                    <DialogContent sx={{ px: 3, ml: 10, mr: 10 }}>
                        <Box display="flex" flexDirection="column" gap={2.5}>
                            <Grid item xs={12} sm={6} mt={-3.5}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Name</Typography>
                                <TextField
                                    value={newCategory.name}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} mt={-2}>
                                <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Description</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    InputProps={{
                                        sx: { backgroundColor: '#ffffff', borderRadius: '5px', width: '100%' },
                                    }}
                                />
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, justifyContent: 'right' }}>
                        <Button
                            variant="contained"
                            onClick={handleCreateCategory}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '20px',
                                width: '30%',
                                marginTop: '-20px',
                                marginBottom: '-25px',
                                marginRight:'80px',
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
            <ToastContainer></ToastContainer>
        </Paper >
    );
};

export default Category;
