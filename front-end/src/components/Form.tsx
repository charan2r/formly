import React, { useState, useEffect, useRef } from 'react';
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
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DraggableQuestion from './DraggableQuestion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image';

interface form {
  formId: string;
  name: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface EditFormData {
  name: string;
  type: string;
  formName: string;
  description: string;
  templateId?: string;
}

interface ViewFormData extends form {
  formTemplateId: string;
  // Add any additional fields you want to display
}

const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

interface Template {
  templateId: number;
  name: string;
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


const PreviewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  templateId: string;
}> = ({ open, onClose, templateId }) => {
  const printRef = React.useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<any>(null);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });
  const [gridPadding, setGridPadding] = useState({ top: 10, bottom: 10, left: 10, right: 10 });
  const [appearanceSettings, setAppearanceSettings] = useState({
    border: {
      width: 0,
      style: 'none',
      color: '#e0e0e0',
      radius: 12
    },
    boxShadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.1)',
      enabled: true
    },
    background: {
      color: '#ffffff',
      opacity: 100
    }
  });

  const calculateGridSize = () => {
    if (paperRef.current) {
      const { width, height } = pageSizes[selectedSize];
      const parentWidth = paperRef.current.offsetWidth;
      const ratio = height / width;
      const gridWidth = Math.min(parentWidth, width);
      const gridHeight = gridWidth * ratio;
      setGridSize({ width: gridWidth, height: gridHeight });
    }
  };

  useEffect(() => {
    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);
    return () => window.removeEventListener('resize', calculateGridSize);
  }, [selectedSize]);

  useEffect(() => {
    if (open && templateId) {
      const fetchData = async () => {
        try {
          const [templateResponse, fieldsResponse] = await Promise.all([
            api.get(`/form-templates/details?id=${templateId}`),
            api.get(`/form-fields?formTemplateId=${templateId}`)
          ]);

          const template = templateResponse.data.data;
          setTemplate(template);
          setSelectedSize(template.pageSize || 'A4');
          setBackgroundColor(template.backgroundColor || '#ffffff');
          setGridPadding({
            top: parseInt(template.marginTop) || 10,
            bottom: parseInt(template.marginBottom) || 10,
            left: parseInt(template.marginLeft) || 10,
            right: parseInt(template.marginRight) || 10
          });
          setAppearanceSettings({
            border: {
              width: template.borderWidth === 0 ? undefined : template.borderWidth,
              radius: template.borderRadius,
              style: template.borderStyle,
              color: template.borderColor
            },
            boxShadow: {
              x: template.boxShadowX ?? 0,
              y: template.boxShadowY ?? 4,
              blur: template.boxShadowBlur ?? 12,
              spread: template.boxShadowSpread ?? 0,
              color: template.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)',
              enabled: true
            },
            background: {
              color: template.backgroundColor ?? '#ffffff',
              opacity: ((template.boxShadowOpacity ?? 1) * 100)
            }
          });
          setFormFields(fieldsResponse.data.data);
        } catch (error) {
          console.error('Error fetching preview data:', error);
          toast.error('Failed to load preview');
        }
      };

      fetchData();
    }
  }, [open, templateId]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePrintClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDirectPrint = async () => {
    if (printRef.current) {
      try {
        toast.info('Preparing document...');

        const pageSize = template?.pageSize || 'A4';
        const { width: pageWidth, height: pageHeight } = pageSizes[pageSize];

        // Create a temporary container with fixed dimensions
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);

        // Clone the content and set exact dimensions
        const contentClone = printRef.current.cloneNode(true) as HTMLElement;
        contentClone.style.width = `${pageWidth}px`;
        contentClone.style.height = `${pageHeight}px`;
        contentClone.style.transform = 'none';
        tempContainer.appendChild(contentClone);

        const dataUrl = await domtoimage.toPng(contentClone, {
          width: pageWidth,
          height: pageHeight,
          style: {
            transform: 'none',
            transformOrigin: 'top left',
            width: `${pageWidth}px`,
            height: `${pageHeight}px`
          }
        });

        // Clean up temporary elements
        document.body.removeChild(tempContainer);

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${template?.name || 'Form Preview'}</title>
                <style>
                  @page {
                    size: ${pageSize};
                    margin: 0;
                  }
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  img {
                    width: 100vw;
                    height: 100vh;
                    object-fit: contain;
                    page-break-inside: avoid;
                  }
                  @media print {
                    html, body {
                      width: ${pageWidth}px;
                      height: ${pageHeight}px;
                      margin: 0;
                      padding: 0;
                    }
                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                      page-break-inside: avoid;
                    }
                  }
                </style>
              </head>
              <body>
                <img 
                  src="${dataUrl}" 
                  alt="Form Preview"
                />
                <script>
                  window.onload = () => {
                    setTimeout(() => {
                      window.print();
                      window.close();
                    }, 250);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          toast.success('Document printed successfully!');
        }
        handleClose();
      } catch (error) {
        console.error('Print failed:', error);
        toast.error('Failed to print document');
        handleClose();
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (printRef.current) {
      try {
        toast.info('Preparing PDF...');

        const pageSize = template?.pageSize || 'A4';
        const { width: pageWidth, height: pageHeight } = pageSizes[pageSize];

        // Create temporary container with fixed dimensions
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);

        // Clone the content and set exact dimensions
        const contentClone = printRef.current.cloneNode(true) as HTMLElement;
        contentClone.style.width = `${pageWidth}px`;
        contentClone.style.height = `${pageHeight}px`;
        contentClone.style.transform = 'none';
        tempContainer.appendChild(contentClone);

        const dataUrl = await domtoimage.toPng(contentClone, {
          width: pageWidth,
          height: pageHeight,
          style: {
            transform: 'none',
            transformOrigin: 'top left',
            width: `${pageWidth}px`,
            height: `${pageHeight}px`
          }
        });

        // Clean up temporary elements
        document.body.removeChild(tempContainer);

        // Convert pixels to millimeters for PDF
        const mmWidth = 210; // A4 width in mm
        const mmHeight = 297; // A4 height in mm

        const pdf = new jsPDF({
          orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
          unit: 'mm',
          format: pageSize.toLowerCase()
        });

        pdf.addImage(
          dataUrl,
          'PNG',
          0,
          0,
          mmWidth,
          mmHeight,
          undefined,
          'FAST'
        );

        pdf.save(`${template?.name || 'form'}.pdf`);
        toast.success('PDF downloaded successfully!');
        handleClose();
      } catch (error) {
        console.error('PDF generation failed:', error);
        toast.error('Failed to generate PDF');
        handleClose();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 'auto',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: '30px'
        }
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        width: '100%'
      }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            {template?.name || 'Template Preview'}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            {template?.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems:'flex-end', width: '100%' }}>
            <Button
              startIcon={<PrintIcon sx={{ color: 'white' }} />}
              variant="contained"
              onClick={handleDirectPrint}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                px: 3,
                ml: 95, // Add margin to the right
                mr: 3,
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Print
            </Button>
            <Button
              startIcon={<DescriptionIcon sx={{ color: 'white' }} />}
              variant="contained"
              onClick={handleDownloadPDF}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                px: 3,
                
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Download 
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={1}
          ref={paperRef}
          sx={{
            padding: '50px',
            margin: '0 auto',
            borderRadius: 3,
            width: 'fit-content',
            minWidth: '70vw',
            maxWidth: '90vw',
          }}
        >
          <div
            ref={printRef}
            style={{
              width: '70vw',
              height: `${70 * (gridSize.height / gridSize.width)}vw`,
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: '15px',
              overflow: "hidden",
              backgroundColor: backgroundColor,
              transition: "all 0.3s ease",
              padding: `${gridPadding.top}px ${gridPadding.right}px ${gridPadding.bottom}px ${gridPadding.left}px`,
              boxSizing: "border-box",
            }}
          >
            <DraggableQuestion
              formTemplateId={templateId}
              items={formFields}
              gridSize={gridSize}
              selectedSize={selectedSize}
              pageSizes={pageSizes}
              onQuestionChange={() => { }}
              onOptionChange={() => { }}
              onDeleteOption={() => { }}
              onAddOption={() => { }}
              isViewMode={true}
              appearanceSettings={appearanceSettings}
              gridPadding={gridPadding}
            />
          </div>
        </Paper>
      </Box>
    </Dialog>
  );
};

const FormTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForms, setSelectedForms] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
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
    description: '',
    templateId: ''
  });
  const pageSizes = {
    A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
    A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
    Custom: { width: 800, height: 600 },
  };
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState<ViewFormData | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string>('');

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'templateId' && {
        type: templates.find(t => t.formTemplateId === value)?.name || ''
      })
    }));
  };


  const handleEditClick = (form: form | undefined) => {
    if (!form) return;

    setEditFormData({
      name: form.name,
      type: templates.find(t => t.formTemplateId === form.formTemplateId)?.name || '',
      formName: form.name,
      description: form.description,
      templateId: form.formTemplateId
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (form: form | undefined) => {
    if (!form) return;
    setViewFormData(form);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, formId: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(formId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newSelectedForms = forms.reduce((acc, form) => {
      acc[form.formId] = checked;
      return acc;
    }, {} as Record<string, boolean>);

    setSelectedForms(newSelectedForms);
  };


  const handleSelectForm = (id: string) => {
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

  // Method to get forms 
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await api.get('/forms');
        if (response.data.status === 'success') {
          // Filter forms to only include active ones
          const activeForms = response.data.data.filter(
            (form: form) => form.status === 'active'
          );
          setForms(activeForms);
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
        toast.error('Failed to fetch forms');
      }
    };

    fetchForms();
  }, []);

  // Method to handle form update
  const handleUpdateForm = async () => {
    try {
      const updatePayload = {
        name: editFormData.name,
        description: editFormData.description,
        formTemplateId: editFormData.templateId,
        status: 'active'
      };

      const response = await api.patch(`/forms/${selectedRowId}`, updatePayload);
      setForms(prevForms => prevForms.map(form =>
        form.formId === selectedRowId
          ? {
            ...form,
            ...response.data,
            updatedAt: new Date().toISOString()
          }
          : form
      ));

      setEditDialogOpen(false);
      toast.success("Form updated successfully!");
    } catch (error) {
      toast.error("Failed to update form");
    }
  };


  // Method to handle form creation
  const handleCreateForm = async () => {
    try {
      const formPayload = {
        name: newForm.name,
        description: newForm.description,
        formTemplateId: newForm.templateId,
        status: 'active'
      };

      const response = await api.post('/forms/create', formPayload);
      setForms([...forms, response.data]);
      setCreateFormOpen(false);
      toast.success("Form created successfully!", {
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
      toast.error("Failed to create form", {
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


  // Method to handle bulk-deletion of forms
  const handleDeleteForms = async () => {
    try {
      const response = await api.delete('/forms/bulk-delete', {
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
    }
  }


  // Method to handle deletion of form
  const handleDeleteForm = async () => {
    try {
      await api.delete(`/forms/delete?id=${formToDelete}`);
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormDetails(null);
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
      description: '',
      templateId: ''
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

  const handleShareClick = (form: form) => {
    // First fetch the form details to get the templateId
    const fetchFormDetails = async () => {
      try {
        const response = await api.get(`/forms/details?id=${form.formId}`);
        if (response.data.status === 'success') {
          const formDetails = response.data.data;
          setViewFormData({
            ...form,
            formTemplateId: formDetails.formTemplateId // Make sure this matches your API response field
          });
          setShareDialogOpen(true);
        } else {
          toast.error('Failed to fetch form details');
        }
      } catch (error) {
        console.error('Error fetching form details:', error);
        toast.error('Failed to fetch form details');
      }
    };

    fetchFormDetails();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewFormData(null);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/form-templates');
        // Filter templates to only include active ones
        const activeTemplates = response.data.data.filter(
          (template: any) => template.status === 'active'
        );
        setTemplates(activeTemplates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handlePreviewClick = (templateId: string) => {
    console.log(forms.find(form => form.formId === selectedRowId)?.templateId)
    if (!templateId) {
      toast.error("Template ID not found");
      return;
    }
    setPreviewTemplateId(templateId);
    setPreviewOpen(true);
  };

  // Add these state declarations at the top
  const [appearanceSettings, setAppearanceSettings] = useState({
    border: {
      width: 0,
      style: 'none',
      color: '#e0e0e0',
      radius: 12
    },
    boxShadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.1)',
      enabled: true
    },
    background: {
      color: '#ffffff',
      opacity: 100
    }
  });




  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 22, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Forms Repository
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Forms Repository</Typography>
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
              (user?.userType === 'Admin' || user?.permissions?.includes('Delete Form')) && (
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
              (user?.userType === 'Admin' || user?.permissions?.includes('Create Form')) && (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                  onClick={() => setCreateFormOpen(true)}
                >
                  <AddIcon sx={{ marginRight: 1 }} />
                  Add Form
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
                  borderTopLeftRadius: '12px',
                  width: '48px'
                }}
              >
                <Checkbox
                  onChange={handleSelectAll}
                  checked={forms.length > 0 && forms.every((frm) => selectedForms[frm.formId])}
                  indeterminate={forms.some((frm) => selectedForms[frm.formId]) && !forms.every((frm) => selectedForms[frm.formId])}
                />
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  fontWeight: 600,
                  color: '#333'
                }}
              >
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('name')}
                >
                  Form Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  fontWeight: 600,
                  color: '#333'
                }}
              >
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  fontWeight: 600,
                  color: '#333',
                  display: { xs: 'none', sm: 'table-cell' } // Hide on mobile
                }}
              >
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Created Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#f9f9f9',
                  fontWeight: 600,
                  color: '#333',
                  display: { xs: 'none', md: 'table-cell' } // Hide on mobile and tablet
                }}
              >
                <TableSortLabel
                  active={orderBy === 'updatedAt'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('updatedAt')}
                >
                  Last Modified Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderTopRightRadius: '12px',
                  width: '48px'
                }}
              />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.formId}
                sx={{
                  height: '48px',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell padding="checkbox" sx={{ width: '48px' }}>
                  <Checkbox
                    checked={!!selectedForms[row.formId]}
                    onChange={() => handleSelectForm(row.formId)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {new Date(row.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {new Date(row.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell padding="checkbox" sx={{ width: '48px' }}>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, row.formId)}
                    sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
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
            padding: { xs: '16px', sm: '24px' },
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#f9f9f9',
            margin: { xs: '16px', sm: '32px' }
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
            onClick={handleCloseCreateDialog}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
          {/* Header section with back button */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: { xs: 2, sm: 3 },
            mt: { xs: 1, sm: 1 },
            px: { xs: 2, sm: 3 }
          }}>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.8rem' }
              }}>
                Create Form
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Boost your employee's productivity with digital forms.
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2 }
          }}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* First Row */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom>
                    Template
                  </Typography>
                  <TextField
                    select
                    value={newForm.templateId}
                    size="small"
                    onChange={(e) => setNewForm({
                      ...newForm,
                      templateId: e.target.value,
                      type: templates.find(t => t.formTemplateId.toString() === e.target.value)?.name || ''
                    })}
                    fullWidth
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.formTemplateId} value={template.formTemplateId}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom>
                    Template Type
                  </Typography>
                  <TextField
                    value={newForm.formName}
                    size="small"
                    onChange={(e) => setNewForm({ ...newForm, formName: e.target.value })}
                    fullWidth
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Second Row */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom>
                    Form Name
                  </Typography>
                  <TextField
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    fullWidth
                    size="small"
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Third Row */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom>
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions sx={{
            p: { xs: 2, sm: 3 },
            justifyContent: 'center',
            gap: { xs: 2, sm: 3 }
          }}>
            <Button
              variant="contained"
              onClick={() => handlePreviewClick(newForm?.templateId)}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                width: { xs: '45%', sm: '35%' },
                py: 1,
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
                width: { xs: '45%', sm: '35%' },
                py: 1,
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
      {/* Edit Form Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: { xs: '16px', sm: '24px' },
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#f9f9f9',
            margin: { xs: '16px', sm: '32px' }
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
            onClick={handleCloseEditDialog}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
          {/* Header section with back button */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: { xs: 2, sm: 3 },
            mt: { xs: 1, sm: 1 },
            px: { xs: 2, sm: 3 }
          }}>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.8rem' }
              }}>
                Update Form
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Boost your employee's productivity with digital forms.
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2 }
          }}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* First Row */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom>
                    Template
                  </Typography>
                  <TextField
                    select
                    name="templateId"
                    value={editFormData.templateId || ''}
                    size="small"
                    onChange={handleEditFormChange}
                    fullWidth
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.formTemplateId} value={template.formTemplateId}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" gutterBottom>
                    Template Type
                  </Typography>
                  <TextField
                    name="formName"
                    value={editFormData.formName}
                    size="small"
                    onChange={handleEditFormChange}
                    fullWidth
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Second Row */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom>
                    Form Name
                  </Typography>
                  <TextField
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    fullWidth
                    size="small"
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Third Row */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" gutterBottom>
                    Description
                  </Typography>
                  <TextField
                    name="description"
                    fullWidth
                    multiline
                    rows={4}
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    InputProps={{
                      sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions sx={{
            p: { xs: 2, sm: 3 },
            justifyContent: 'space-between'
          }}>
            <Button
              variant="outlined"
              onClick={() => handlePreviewClick(editFormData?.templateId)}
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: '20px',
                width: { xs: '45%', sm: '35%' },
                py: 1,
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
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
                width: { xs: '45%', sm: '35%' },
                py: 1,
                '&:hover': {
                  backgroundColor: '#333'
                }
              }}
            >
              Save
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
              // onClick={() => handlePrintClick()}
              sx={{
                backgroundColor: '#FFF0F0',
                width: 56,
                height: 56,
                '&:hover': { backgroundColor: '#FFE0E0' }
              }}
            >
              <PrintIcon />
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

      {/* View Form Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#f9f9f9',
            margin: '16px',
            overflowY: 'visible',
            overflowX: 'visible'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Header section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            mt: 1,
            px: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem'
              }}>
                View Form
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Form details and information
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{
            px: 2,
            py: 2,
            overflowY: 'visible',
            overflowX: 'visible'
          }}>
            {viewFormData && (
              <Box display="flex" flexDirection="column" gap={3}>
                {/* First Row */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom>
                      Template
                    </Typography>
                    <TextField
                      value={templates.find(t => t.formTemplateId === viewFormData.formTemplateId)?.name || 'N/A'}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom>
                      Status
                    </Typography>
                    <TextField
                      value={viewFormData.status}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Second Row */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" gutterBottom>
                      Form Name
                    </Typography>
                    <TextField
                      value={viewFormData.name}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Third Row */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" gutterBottom>
                      Description
                    </Typography>
                    <TextField
                      value={viewFormData.description}
                      fullWidth
                      multiline
                      rows={4}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Fourth Row */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom>
                      Created Date
                    </Typography>
                    <TextField
                      value={new Date(viewFormData.createdAt).toLocaleDateString()}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" gutterBottom>
                      Last Modified Date
                    </Typography>
                    <TextField
                      value={new Date(viewFormData.updatedAt).toLocaleDateString()}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          },
                          '& .MuiInputBase-input.Mui-readOnly': {
                            cursor: 'default',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{
            p: 2,
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              onClick={handleCloseViewDialog}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                width: '35%',
                py: 1,
                '&:hover': {
                  backgroundColor: '#333'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Popover
        open={Boolean(menuAnchor)}
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
        {(user?.userType === 'Admin' || user?.permissions?.includes('View Form')) && (
          <MenuItem
            onClick={() => {
              handleViewClick(forms.find(form => form.formId === selectedRowId));
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
            View
          </MenuItem>
        )}
        {(user?.userType === 'Admin' || user?.permissions?.includes('Edit Form')) && (
          <MenuItem
            onClick={() => {
              handleEditClick(forms.find(form => form.formId === selectedRowId));
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
        )}
        <MenuItem
          onClick={() => {
            console.log(selectedRowId, forms)
            handlePreviewClick(forms.find(form => form.formId === selectedRowId)?.formTemplateId);
            // handleShareClick(forms.find(form => form.formId === selectedRowId)!);
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
          Share
        </MenuItem>
        {(user?.userType === 'Admin' || user?.permissions?.includes('Delete Form')) && (
          <MenuItem
            onClick={() => {
              handleDeleteConfirmation(selectedRowId);
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
        )}
      </Popover>

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        templateId={previewTemplateId}
      />

      <ToastContainer></ToastContainer>
    </Paper>
  );
};

export default FormTable;
