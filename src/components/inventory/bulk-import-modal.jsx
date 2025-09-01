'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SAMPLE_CSV_DATA = `name,sku,category,brand,description,quantity,price,minStockLevel,petSpecies,requiresPrescription,isActive
Premium Dog Food,DOG-001,food,PetCorp,High-quality dry dog food,50,29.99,10,dog,false,true
Cat Treats,CAT-002,treats,FelineFresh,Salmon flavored treats,25,8.99,5,cat,false,true
Bird Seed Mix,BIRD-003,food,AvianChoice,Premium seed blend,15,12.50,3,bird,false,true
Dog Medication,MED-001,medication,VetMed,Pain relief tablets,10,45.00,2,dog,true,true`;

export default function BulkImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setFile(null);
    setCsvData([]);
    setValidationResults(null);
    setImporting(false);
    setImportProgress(0);
    setImportResults(null);
    setShowPreview(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      row._rowIndex = index + 2; // +2 because we start from line 2 (after header)
      return row;
    });

    return { headers, data };
  };

  const validateCSVData = (data) => {
    const requiredFields = ['name', 'sku', 'category', 'quantity', 'price'];
    const validCategories = ['food', 'treats', 'toys', 'medication', 'supplies', 'grooming', 'accessories', 'health', 'cleaning', 'other'];
    const validSpecies = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'];
    
    const results = {
      valid: [],
      invalid: [],
      warnings: [],
      duplicateSKUs: []
    };

    const skuMap = new Map();

    data.forEach((row) => {
      const errors = [];
      const warnings = [];

      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Missing required field: ${field}`);
        }
      });

      // Validate data types and formats
      if (row.quantity && isNaN(Number(row.quantity))) {
        errors.push('Quantity must be a number');
      }
      
      if (row.price && isNaN(Number(row.price))) {
        errors.push('Price must be a number');
      }

      if (row.minStockLevel && isNaN(Number(row.minStockLevel))) {
        errors.push('Min stock level must be a number');
      }

      // Validate category
      if (row.category && !validCategories.includes(row.category.toLowerCase())) {
        warnings.push(`Invalid category: ${row.category}. Will default to 'other'`);
      }

      // Validate pet species
      if (row.petSpecies && !validSpecies.includes(row.petSpecies.toLowerCase())) {
        warnings.push(`Invalid pet species: ${row.petSpecies}. Will default to 'other'`);
      }

      // Check for duplicate SKUs
      if (row.sku) {
        if (skuMap.has(row.sku)) {
          errors.push(`Duplicate SKU found at row ${skuMap.get(row.sku)} and ${row._rowIndex}`);
          results.duplicateSKUs.push(row.sku);
        } else {
          skuMap.set(row.sku, row._rowIndex);
        }
      }

      // Validate boolean fields
      if (row.requiresPrescription && !['true', 'false', ''].includes(row.requiresPrescription.toLowerCase())) {
        warnings.push('requiresPrescription should be true or false. Will default to false');
      }

      if (row.isActive && !['true', 'false', ''].includes(row.isActive.toLowerCase())) {
        warnings.push('isActive should be true or false. Will default to true');
      }

      const validationResult = {
        ...row,
        errors,
        warnings,
        isValid: errors.length === 0
      };

      if (errors.length === 0) {
        results.valid.push(validationResult);
      } else {
        results.invalid.push(validationResult);
      }

      if (warnings.length > 0) {
        results.warnings.push(validationResult);
      }
    });

    return results;
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const { headers, data } = parseCSV(csvText);
        setCsvData(data);
        
        const validation = validateCSVData(data);
        setValidationResults(validation);
      } catch (err) {
        setError('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!validationResults || validationResults.valid.length === 0) {
      setError('No valid items to import');
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setError(null);

    try {
      const itemsToImport = validationResults.valid.map(item => ({
        name: item.name,
        sku: item.sku,
        category: item.category.toLowerCase() || 'other',
        brand: item.brand || '',
        description: item.description || '',
        quantity: parseInt(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
        minStockLevel: parseInt(item.minStockLevel) || 0,
        petSpecies: item.petSpecies?.toLowerCase() || 'other',
        requiresPrescription: item.requiresPrescription?.toLowerCase() === 'true',
        isActive: item.isActive?.toLowerCase() !== 'false'
      }));

      const response = await fetch('/api/inventory/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToImport }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      setImportResults(result);
      setImportProgress(100);
      
      // Auto close after successful import
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Inventory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Upload a CSV file with your inventory items. The file should contain the following columns:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Required:</strong> name, sku, category, quantity, price</li>
                  <li><strong>Optional:</strong> brand, description, minStockLevel, petSpecies, requiresPrescription, isActive</li>
                </ul>
              </div>
              <Button variant="outline" onClick={downloadSampleCSV} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {!file ? (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">Select CSV File</p>
                      <p className="text-sm text-muted-foreground">
                        Choose a CSV file containing your inventory data
                      </p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                    <div>
                      <p className="text-lg font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {csvData.length} rows found
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                      </Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Different File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Validation Results
                  <div className="flex gap-2 ml-auto">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {validationResults.valid.length} Valid
                    </Badge>
                    {validationResults.invalid.length > 0 && (
                      <Badge variant="destructive">
                        {validationResults.invalid.length} Invalid
                      </Badge>
                    )}
                    {validationResults.warnings.length > 0 && (
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                        {validationResults.warnings.length} Warnings
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResults.invalid.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {validationResults.invalid.length} items have validation errors and will not be imported.
                    </AlertDescription>
                  </Alert>
                )}
                
                {validationResults.warnings.length > 0 && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {validationResults.warnings.length} items have warnings but will be imported with default values.
                    </AlertDescription>
                  </Alert>
                )}

                {validationResults.valid.length > 0 && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {validationResults.valid.length} items are ready to import.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview Table */}
          {showPreview && csvData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 10).map((row, index) => {
                        const validation = validationResults?.valid.find(v => v._rowIndex === row._rowIndex) ||
                                         validationResults?.invalid.find(v => v._rowIndex === row._rowIndex);
                        return (
                          <TableRow key={index}>
                            <TableCell>{row._rowIndex}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.sku}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell>{row.price}</TableCell>
                            <TableCell>
                              {validation?.isValid ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">Valid</Badge>
                              ) : (
                                <Badge variant="destructive">Invalid</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {csvData.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Showing first 10 rows of {csvData.length} total rows
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Progress */}
          {importing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Importing items...</span>
                    <span className="text-sm text-muted-foreground">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Import Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                    <div className="text-sm text-muted-foreground">Items Imported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{importResults.failed || 0}</div>
                    <div className="text-sm text-muted-foreground">Items Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {validationResults && validationResults.valid.length > 0 && !importing && !importResults && (
              <Button onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import {validationResults.valid.length} Items
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}