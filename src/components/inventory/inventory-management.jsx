'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  TrendingDown,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw,
  Calculator,
  Settings,
  HelpCircle,
  Upload,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import InventoryForm from './inventory-form';
import InventorySaleModal from './inventory-sale-modal';
import InventoryPurchaseModal from './inventory-purchase-modal';
import GSTSettingsModal from './gst-settings-modal';
import GSTHelpModal from './gst-help-modal';
import GSTSummaryCard from './gst-summary-card';
import BulkImportModal from './bulk-import-modal';
// Using existing toast implementation via window.showToast

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Food' },
  { value: 'treats', label: 'Treats' },
  { value: 'toys', label: 'Toys' },
  { value: 'medication', label: 'Medication' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'health', label: 'Health' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'other', label: 'Other' }
];

const PET_SPECIES = [
  { value: 'all', label: 'All Species' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'bird', label: 'Birds' },
  { value: 'fish', label: 'Fish' },
  { value: 'rabbit', label: 'Rabbits' },
  { value: 'hamster', label: 'Hamsters' },
  { value: 'other', label: 'Other' }
];

export default function InventoryManagement() {
  const { apiRequest } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [emailStatus, setEmailStatus] = useState({});

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (speciesFilter !== 'all') params.append('petSpecies', speciesFilter);
      if (activeTab === 'lowStock') params.append('lowStock', 'true');
      if (activeTab === 'expiring') params.append('expiringSoon', 'true');

      const response = await fetch(`/api/inventory?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch inventory');
      }

      setItems(data.data.items);
      setTotalPages(data.data.pagination.total);
      setTotalItems(data.data.pagination.totalCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchTerm, categoryFilter, speciesFilter, sortBy, sortOrder, activeTab]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete item');
      }

      fetchInventory();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSell = (item) => {
    setSelectedItem(item);
    setShowSaleModal(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchInventory();
  };

  const handleSaleSuccess = () => {
    setShowSaleModal(false);
    setSelectedItem(null);
    fetchInventory();
  };

  const handlePurchase = (item = null) => {
    if (item) {
      setSelectedItems([item]);
    } else if (selectedItems.length === 0) {
      setError('Please select items to purchase');
      return;
    }
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    setSelectedItems([]);
    fetchInventory();
  };

  const handleGSTSettings = (item = null) => {
    if (item) {
      setSelectedItems([item]);
    } else if (selectedItems.length === 0) {
      setError('Please select items to configure GST settings');
      return;
    }
    setShowGSTModal(true);
  };

  const handleGSTSuccess = () => {
    setShowGSTModal(false);
    setSelectedItems([]);
    fetchInventory();
  };

  const handleBulkImportSuccess = () => {
    setShowBulkImportModal(false);
    fetchInventory();
  };

  const handleBulkGSTSettings = () => {
    if (selectedItems.length === 0) {
      setError('Please select items to configure GST settings');
      return;
    }
    setShowGSTModal(true);
  };

  const handleSendEmail = async (item, type = 'low_stock') => {
    const itemId = item._id;
    
    try {
      // Set loading state
      setEmailStatus(prev => ({
        ...prev,
        [itemId]: { status: 'loading', message: 'Sending email...' }
      }));

      // Show loading toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`Sending ${type} notification for ${item.name}...`, 'info', 2000);
      }

      const response = await apiRequest('/api/inventory/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          itemId,
          itemData: {
            name: item.name,
            category: item.category,
            currentStock: item.quantity,
            lowStockThreshold: item.lowStockThreshold,
            expirationDate: item.expirationDate,
            price: item.price
          }
        })
      });

      if (response.success) {
        const statusType = response.skipped ? 'skipped' : 'success';
        const message = response.skipped ? 'Email skipped - notification preferences' : 'Email sent successfully!';
        
        setEmailStatus(prev => ({
          ...prev,
          [itemId]: { 
            status: statusType, 
            message: message
          }
        }));

        // Show success/skipped toast
        if (typeof window !== 'undefined' && window.showToast) {
          if (response.skipped) {
            window.showToast(`Email skipped for ${item.name} - notification preferences`, 'info', 4000);
          } else {
            window.showToast(`✅ Email sent successfully for ${item.name}!`, 'success', 4000);
          }
        }
      } else {
        const errorMessage = response.error || 'Failed to send email';
        setEmailStatus(prev => ({
          ...prev,
          [itemId]: { status: 'error', message: errorMessage }
        }));

        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(`❌ Failed to send email for ${item.name}: ${errorMessage}`, 'error', 5000);
        }
      }
    } catch (error) {
      console.error('Email sending error:', error);
      const errorMessage = 'Failed to send email';
      setEmailStatus(prev => ({
        ...prev,
        [itemId]: { status: 'error', message: errorMessage }
      }));

      // Show error toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`❌ Network error while sending email for ${item.name}. Please try again.`, 'error', 5000);
      }
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setEmailStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[itemId];
        return newStatus;
      });
    }, 5000);
  };

  const getEmailButtonContent = (item) => {
    const statusObj = emailStatus[item._id];
    const status = statusObj?.status;
    
    switch (status) {
      case 'loading':
        return {
          icon: Loader2,
          text: 'Sending...',
          disabled: true,
          className: 'text-blue-600'
        };
      case 'success':
        return {
          icon: CheckCircle,
          text: 'Sent',
          disabled: true,
          className: 'text-green-600'
        };
      case 'skipped':
        return {
          icon: XCircle,
          text: 'Skipped',
          disabled: true,
          className: 'text-yellow-600'
        };
      case 'error':
        return {
          icon: XCircle,
          text: 'Failed',
          disabled: true,
          className: 'text-red-600'
        };
      default:
        return {
          icon: Send,
          text: 'Send Alert',
          disabled: false,
          className: ''
        };
    }
  };

  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i._id === item._id);
      if (isSelected) {
        return prev.filter(i => i._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const selectAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...items]);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStockBadge = (item) => {
    if (item.quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.quantity <= item.minStockLevel) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    }
    return <Badge variant="outline">In Stock</Badge>;
  };

  const getExpirationBadge = (item) => {
    if (!item.expirationDate) return null;

    const expirationDate = new Date(item.expirationDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    if (expirationDate <= now) {
      return <Badge variant="destructive" className="ml-2">Expired</Badge>;
    } else if (expirationDate <= thirtyDaysFromNow) {
      return <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">Expires Soon</Badge>;
    }

    return null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your pet supplies, medication, and products
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedItems.length} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={() => handlePurchase()}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Bulk Purchase
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkGSTSettings}>
                <Calculator className="h-4 w-4 mr-2" />
                GST Settings
              </Button>
            </div>
          )}
          <Button variant="outline" onClick={() => setShowHelpModal(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            GST Help
          </Button>
          <Button variant="outline" onClick={() => setShowBulkImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline" onClick={fetchInventory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* GST Summary */}
      <div className="mb-6">
        <GSTSummaryCard onRefresh={fetchInventory} />
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, SKU, brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pet Species" />
                  </SelectTrigger>
                  <SelectContent>
                    {PET_SPECIES.map((species) => (
                      <SelectItem key={species.value} value={species.value}>
                        {species.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Inventory Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Items ({totalItems})</TabsTrigger>
          <TabsTrigger value="lowStock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <InventoryTable
            items={items}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedItems={selectedItems}
            onSort={toggleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSell={handleSell}
            onPurchase={handlePurchase}
            onGSTSettings={handleGSTSettings}
            onSendEmail={handleSendEmail}
            onToggleSelection={toggleItemSelection}
            onSelectAll={selectAllItems}
            getStockBadge={getStockBadge}
            getExpirationBadge={getExpirationBadge}
            getEmailButtonContent={getEmailButtonContent}
            formatPrice={formatPrice}
          />
        </TabsContent>

        <TabsContent value="lowStock">
          <InventoryTable
            items={items}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedItems={selectedItems}
            onSort={toggleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSell={handleSell}
            onPurchase={handlePurchase}
            onGSTSettings={handleGSTSettings}
            onSendEmail={handleSendEmail}
            onToggleSelection={toggleItemSelection}
            onSelectAll={selectAllItems}
            getStockBadge={getStockBadge}
            getExpirationBadge={getExpirationBadge}
            getEmailButtonContent={getEmailButtonContent}
            formatPrice={formatPrice}
          />
        </TabsContent>

        <TabsContent value="expiring">
          <InventoryTable
            items={items}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedItems={selectedItems}
            onSort={toggleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSell={handleSell}
            onPurchase={handlePurchase}
            onGSTSettings={handleGSTSettings}
            onSendEmail={handleSendEmail}
            onToggleSelection={toggleItemSelection}
            onSelectAll={selectAllItems}
            getStockBadge={getStockBadge}
            getExpirationBadge={getExpirationBadge}
            getEmailButtonContent={getEmailButtonContent}
            formatPrice={formatPrice}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <InventoryForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {showSaleModal && selectedItem && (
        <InventorySaleModal
          item={selectedItem}
          onSuccess={handleSaleSuccess}
          onCancel={() => {
            setShowSaleModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showPurchaseModal && (
        <InventoryPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedItems([]);
          }}
          items={selectedItems}
          onSuccess={handlePurchaseSuccess}
        />
      )}

      {showGSTModal && (
        <GSTSettingsModal
          isOpen={showGSTModal}
          onClose={() => {
            setShowGSTModal(false);
            setSelectedItems([]);
          }}
          items={selectedItems}
          onSave={handleGSTSuccess}
          bulkUpdate={selectedItems.length > 1}
        />
      )}

      {showHelpModal && (
        <GSTHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
      )}

      {showBulkImportModal && (
        <BulkImportModal
          isOpen={showBulkImportModal}
          onClose={() => setShowBulkImportModal(false)}
          onSuccess={handleBulkImportSuccess}
        />
      )}
    </div>
  );
}

// Inventory Table Component
function InventoryTable({
  items,
  loading,
  sortBy,
  sortOrder,
  selectedItems = [],
  onSort,
  onEdit,
  onDelete,
  onSell,
  onPurchase,
  onGSTSettings,
  onSendEmail,
  onToggleSelection,
  onSelectAll,
  getStockBadge,
  getExpirationBadge,
  getEmailButtonContent,
  formatPrice
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ?
      <SortAsc className="h-4 w-4 ml-1" /> :
      <SortDesc className="h-4 w-4 ml-1" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length && items.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('quantity')}
              >
                <div className="flex items-center">
                  Stock {getSortIcon('quantity')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center">
                  Price {getSortIcon('price')}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isSelected = selectedItems.find(i => i._id === item._id);
                return (
                  <TableRow key={item._id} className={isSelected ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => onToggleSelection(item)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.brand && (
                          <div className="text-sm text-muted-foreground">{item.brand}</div>
                        )}
                        {getExpirationBadge(item)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{item.sku}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.quantity}</span>
                        {getStockBadge(item)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatPrice(item.currentPrice || item.price)}</div>
                        {item.gst?.isGSTApplicable && (
                          <div className="text-xs text-muted-foreground">
                            GST {item.gst.gstRate}% • {item.gst.gstType === 'CGST_SGST' ? 'CGST+SGST' : item.gst.gstType}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {item.isActive ? (
                          <Badge variant="outline" className="w-fit">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {item.requiresPrescription && (
                          <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700">
                            Rx Required
                          </Badge>
                        )}
                        {item.gst?.isGSTApplicable && (
                          <Badge variant="outline" className="w-fit bg-green-50 text-green-700">
                            GST {item.gst.gstRate}%
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onPurchase(item)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Record Purchase
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onSell(item)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Quick Sale
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onGSTSettings(item)}>
                            <Calculator className="h-4 w-4 mr-2" />
                            GST Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onSendEmail(item, 'low_stock')}
                            disabled={getEmailButtonContent(item).disabled}
                            className={getEmailButtonContent(item).className}
                          >
                            {(() => {
                              const { icon: Icon, text } = getEmailButtonContent(item);
                              return (
                                <>
                                  <Icon className={`h-4 w-4 mr-2 ${getEmailButtonContent(item).className.includes('loading') ? 'animate-spin' : ''}`} />
                                  {text}
                                </>
                              );
                            })()}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(item._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}