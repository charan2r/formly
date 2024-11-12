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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Template {
    templateId: string;
    name: string;
    category: string;
    createdDate: string;
    createdBy: string;
    lastModifiedDate: string;
    lastModifiedBy: string;
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
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<Record<number, boolean>>({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ name: '', type: '', category: '', lastActive: '' });
    const [orderBy, setOrderBy] = useState<keyof Template>('name');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationBulkOpen, setConfirmationBulkOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);


    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('http://localhost:3001/template');
                // Filter Templates where the status is 'active'
                const activeTemplates = response.data.data.filter(temp => temp.status === 'active');
                console.log(activeTemplates);
                setTemplates(activeTemplates);
            } catch (error) {
                console.error('Error fetching templates data:', error);
            }
        };

        fetchTemplates();
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
        const newSelectedTemplates = templates.reduce((acc, temp) => {
            acc[temp.templateId] = checked;  // Apply the same checked state to all Templates
            return acc;
        }, {} as Record<number, boolean>);

        setSelectedTemplates(newSelectedTemplates);
    };


    const handleSelectTemplate = (id: number) => {
        setSelectedTemplates((prev) => ({
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
        setConfirmationBulkOpen(true);
    };



    const handleDeleteTemplates = async () => {

        try {
            const response = await axios.delete('http://localhost:3001/template/bulk-delete', {
                data: { ids: Object.keys(selectedTemplates) },
            });

            // Filter out the organizations that were deleted
            setTemplates((prevTemplates) =>
                prevTemplates.filter(temp => !Object.keys(selectedTemplates).includes(temp.templateId))
            );

            toast.success("Template has been deleted successfully!", {
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

            setSelectedTemplates([]);
            setConfirmationBulkOpen(false);
        } catch (error) {
            toast.error("Failed to delete the Template. Please try again.", {
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

    // Method to handle deletion of an templates
    const handleDeleteTemplate = async () => {
        try {
            await axios.delete(`http://localhost:3001/template/delete?id=${templateToDelete}`);
            setTemplates((prev) => prev.filter((temp) => temp.templateId !== templateToDelete));
            setConfirmationOpen(false); // Close confirmation dialog
            toast.success("Template has been deleted successfully!", {
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
            toast.error("Failed to delete the Template. Please try again.", {
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

    const filteredData = templates
        .filter((temp) => {
            const nameMatches = temp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                temp.name.toLowerCase().includes(filters.name.toLowerCase());

            const categoryMatches = temp.category
                ? temp.category.toLowerCase().includes(filters.category.toLowerCase())
                : !filters.category; // If temp.category is null, match only if filters.category is empty

            const lastActiveMatches = temp.lastActive
                ? temp.lastActive.toLowerCase().includes(filters.lastActive.toLowerCase())
                : !filters.lastActive; // If temp.lastActive is null, match only if filters.lastActive is empty

            return nameMatches && categoryMatches && lastActiveMatches;
        })
        .sort((a, b) => {
            const orderMultiplier = orderDirection === 'asc' ? 1 : -1;
            return (a[orderBy] ?? "").localeCompare(b[orderBy] ?? "") * orderMultiplier;
        });

    const selectedCount = Object.values(selectedTemplates).filter(Boolean).length;

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
                        Atlas corp
                    </Typography>
                    <ArrowForward style={{ color: 'black' }} />
                    <Typography variant="body2" color="textSecondary">
                        Template repository
                    </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">Template repository</Typography>
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
                                onClick={() => navigate('/create-template')}
                            >
                                <AddIcon sx={{ marginRight: 1 }} />
                                Add Templates
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
            <TableContainer sx={{ maxHeight: '400px', overflow: 'auto' }}>
                <Table stickyHeader sx={{ marginTop: '25px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ backgroundColor: '#f9f9f9', padding: '4px' }}>
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={
                                        templates.length > 0 &&
                                        templates.every((temp) => selectedTemplates[temp.templateId])
                                    }
                                    indeterminate={
                                        templates.some((temp) => selectedTemplates[temp.templateId]) &&
                                        !templates.every((temp) => selectedTemplates[temp.templateId])
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
                            <TableCell sx={{ backgroundColor: '#f9f9f9', padding: '4px', position: 'relative' }}>
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
                            <TableRow key={row.templateId} sx={{ height: '60px' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={!!selectedTemplates[row.templateId]}
                                        onChange={() => handleSelectTemplate(row.templateId)}
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
                                    <IconButton onClick={(event) => handleMenuOpen(event, row.templateId)}>
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
                                                navigate(`/view-template/${row.templateId}`);
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
                                                navigate(`/edit-template/${row.templateId}`);
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
                                            onClick={() => handleDeleteConfirmation(row.templateId)}
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
                    <Typography>Are you sure you want to delete this template?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTemplate} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmationBulkOpen} onClose={() => setConfirmationBulkOpen(false)} sx={{}}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete these templates?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationBulkOpen(false)} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTemplates} sx={{ color: 'white', backgroundColor: 'black', borderRadius: '10px' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer></ToastContainer>
        </Paper >
    );
};

export default Template;
