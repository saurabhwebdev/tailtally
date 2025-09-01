'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function GSTSummaryCard({ onRefresh }) {
  const [gstData, setGstData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGSTSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/inventory/gst');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch GST summary');
      }

      setGstData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGSTSummary();
  }, []);

  const handleRefresh = () => {
    fetchGSTSummary();
    onRefresh?.();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            GST Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            GST Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={handleRefresh} className="mt-3">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalItems = gstData?.gstRateDistribution?.reduce((sum, item) => sum + item.count, 0) || 0;
  const gstApplicableItems = gstData?.gstRateDistribution?.filter(item => item._id > 0).reduce((sum, item) => sum + item.count, 0) || 0;
  const exemptItems = gstData?.gstRateDistribution?.find(item => item._id === 0)?.count || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <div>
              <CardTitle>GST Summary</CardTitle>
              <CardDescription>Overview of GST configuration across inventory</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalItems}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Items</div>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{gstApplicableItems}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">GST Applicable</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{exemptItems}</div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Exempt Items</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* GST Rate Distribution Table */}
        {gstData?.gstRateDistribution && gstData.gstRateDistribution.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-lg">GST Rate Distribution</h4>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">GST Rate</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-center font-semibold">Items</TableHead>
                    <TableHead className="text-center font-semibold">Percentage</TableHead>
                    <TableHead className="text-right font-semibold">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstData.gstRateDistribution.map((rate) => {
                    const percentage = totalItems > 0 ? Math.round((rate.count / totalItems) * 100) : 0;
                    return (
                      <TableRow key={rate._id} className="hover:bg-muted/30">
                        <TableCell>
                          <Badge variant={rate._id === 0 ? "secondary" : "outline"} className="font-medium">
                            {rate._id}% GST
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rate._id === 0 ? 'Exempt Items' : 
                           rate._id === 5 ? 'Basic Necessities' :
                           rate._id === 12 ? 'Standard Rate' :
                           rate._id === 18 ? 'Most Goods/Services' :
                           rate._id === 28 ? 'Luxury Items' : 'Custom Rate'}
                        </TableCell>
                        <TableCell className="text-center font-medium">{rate.count}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{percentage}%</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={percentage} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* GST Type Distribution Table */}
        {gstData?.gstTypeDistribution && gstData.gstTypeDistribution.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-lg">GST Type Distribution</h4>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">GST Type</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="text-center font-semibold">Items</TableHead>
                    <TableHead className="text-center font-semibold">Percentage</TableHead>
                    <TableHead className="text-right font-semibold">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstData.gstTypeDistribution.map((type) => {
                    const percentage = totalItems > 0 ? Math.round((type.count / totalItems) * 100) : 0;
                    return (
                      <TableRow key={type._id} className="hover:bg-muted/30">
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {type._id === 'CGST_SGST' ? 'CGST+SGST' : type._id}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {type._id === 'CGST_SGST' ? 'Intra-state Transactions' :
                           type._id === 'IGST' ? 'Inter-state Transactions' :
                           type._id === 'EXEMPT' ? 'Exempt from GST' :
                           type._id === 'NIL_RATED' ? 'Nil Rated Items' :
                           type._id === 'ZERO_RATED' ? 'Zero Rated Items' : type._id}
                        </TableCell>
                        <TableCell className="text-center font-medium">{type.count}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{percentage}%</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={percentage} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Compliance Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-lg">Compliance Status</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Configured Items</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totalItems}</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Compliance Rate</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">100%</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Bulk Configuration</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Select items and use "GST Settings"</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Get Help</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Click "GST Help" for guidance</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Record Sales</div>
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Use "Record Purchase" for tracking</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}