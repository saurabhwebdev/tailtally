'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default', // 'default', 'destructive', 'warning', 'info'
  loading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <Trash2 className="h-6 w-6 text-destructive" />,
          confirmButton: 'destructive',
          titleClass: 'text-destructive'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
          confirmButton: 'default',
          titleClass: 'text-orange-600'
        };
      case 'info':
        return {
          icon: <Info className="h-6 w-6 text-blue-500" />,
          confirmButton: 'default',
          titleClass: 'text-blue-600'
        };
      default:
        return {
          icon: <AlertCircle className="h-6 w-6 text-muted-foreground" />,
          confirmButton: 'default',
          titleClass: ''
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {styles.icon}
            <DialogTitle className={styles.titleClass}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.confirmButton}
            onClick={handleConfirm}
            disabled={loading || isLoading}
          >
            {loading || isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
