export const floatingToolbarStyles = {
  '.floating-toolbar': {
    '& .ql-toolbar': {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '8px 4px',
      border: 'none',
      '& .ql-formats': {
        display: 'flex',
        margin: '4px 0',
      },
      '& button': {
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.04)',
          borderRadius: '4px',
        }
      }
    }
  }
}; 