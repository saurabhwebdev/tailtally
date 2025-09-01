# Inventory GST Compliance & Integration Documentation

## Overview

The TailTally Inventory Management system is now fully GST compliant and integrated with the Owner and Pet modules. This documentation covers the GST features, compliance requirements, and integration capabilities.

## GST Compliance Features

### 1. GST Configuration

#### Supported GST Types
- **CGST + SGST**: For intra-state transactions (within the same state)
- **IGST**: For inter-state transactions (between different states)
- **GST Exempt**: Items not subject to GST
- **Nil Rated**: Items with 0% GST rate
- **Zero Rated**: Export/SEZ supplies

#### Tax Categories
- **Goods**: Physical products requiring HSN codes
- **Services**: Service offerings requiring SAC codes

#### GST Rates
- Supports all standard GST rates: 0%, 5%, 12%, 18%, 28%
- Custom rates can be configured
- Cess rates supported for applicable items

### 2. HSN/SAC Code Management

#### HSN Codes (Harmonized System of Nomenclature)
- Required for goods with turnover > ₹5 crores
- 4-8 digit classification system
- Automatic validation of format

#### SAC Codes (Services Accounting Code)
- Required for all services
- 6-digit classification system
- Mandatory for service-based inventory items

### 3. Price Breakdown & Calculations

#### Automatic GST Calculations
- Base price calculation (price excluding GST)
- CGST/SGST split for intra-state transactions
- IGST calculation for inter-state transactions
- Cess calculation when applicable
- Total price with GST

#### Price Display
- Shows base price and GST components separately
- Real-time calculation preview
- GST-inclusive final pricing

### 4. Place of Supply

#### State Code Management
- All Indian states and union territories supported
- Automatic CGST/SGST vs IGST determination
- State-wise tax compliance

### 5. Reverse Charge Mechanism

- Support for reverse charge applicable items
- Compliance with GST regulations
- Proper documentation and tracking

## Integration with Owner & Pet Modules

### 1. Purchase Recording

#### Customer Selection
- **Owner-only purchases**: Direct owner association
- **Pet-specific purchases**: Links to both pet and owner
- Customer search by name, email, or phone

#### Purchase Tracking
- Complete purchase history per customer
- Pet-specific product usage tracking
- Owner spending analytics

### 2. Invoice Generation

#### GST-Compliant Invoices
- Automatic invoice number generation
- GST breakdown display
- Customer and business details
- HSN/SAC codes included
- Place of supply information

#### Invoice Features
- PDF generation capability
- Email delivery to customers
- Invoice history and tracking
- GST return preparation support

### 3. Customer Analytics

#### Owner Insights
- Total spending with GST breakdown
- Purchase frequency analysis
- Product preference tracking
- Payment method preferences

#### Pet-Specific Analytics
- Product usage by pet species/breed
- Health-related purchase tracking
- Prescription item compliance
- Age-appropriate product recommendations

## API Endpoints

### GST Configuration
```
GET /api/inventory/gst
PUT /api/inventory/gst
```

### Purchase Recording
```
POST /api/inventory/purchase
GET /api/inventory/purchase
```

### Inventory Management
```
GET /api/inventory
POST /api/inventory
PUT /api/inventory/[id]
DELETE /api/inventory/[id]
```

## Database Schema Updates

### Inventory Model GST Fields
```javascript
gst: {
  isGSTApplicable: Boolean,
  gstRate: Number,
  gstType: String, // CGST_SGST, IGST, EXEMPT, etc.
  taxCategory: String, // GOODS, SERVICES
  hsnCode: String,
  sacCode: String,
  cgstRate: Number,
  sgstRate: Number,
  igstRate: Number,
  cessRate: Number,
  reverseCharge: Boolean,
  placeOfSupply: {
    stateCode: String,
    stateName: String
  }
}
```

### Price Breakdown
```javascript
priceBreakdown: {
  basePrice: Number,
  gstAmount: Number,
  totalPriceWithGST: Number
}
```

### Purchase Tracking
```javascript
usedByPets: [{
  pet: ObjectId,
  owner: ObjectId,
  quantity: Number,
  date: Date,
  notes: String
}]
```

## Compliance Features

### 1. GST Return Preparation
- Automated GST calculation summaries
- State-wise transaction reports
- HSN/SAC code wise summaries
- Input tax credit calculations

### 2. Audit Trail
- Complete transaction history
- GST rate change tracking
- Price modification logs
- Customer purchase patterns

### 3. Regulatory Compliance
- Automatic GST validation
- Rate change notifications
- Compliance alerts and warnings
- Regular backup and data retention

## User Interface Features

### 1. GST Settings Modal
- Intuitive GST configuration interface
- Real-time price calculation preview
- Bulk GST settings update
- Compliance guidance and tips

### 2. Purchase Recording Interface
- Step-by-step purchase workflow
- Customer selection with search
- Item quantity and notes management
- Payment method selection
- Invoice generation options

### 3. Inventory Management
- GST-aware pricing display
- Tax-inclusive/exclusive views
- Bulk operations support
- Advanced filtering and sorting

## Best Practices

### 1. GST Rate Management
- Regular review of GST rates
- Timely updates for rate changes
- Proper HSN/SAC code assignment
- State-wise compliance monitoring

### 2. Customer Data Management
- Accurate customer information
- Regular data validation
- Privacy compliance
- Consent management

### 3. Inventory Tracking
- Real-time stock updates
- Accurate pricing maintenance
- Regular audit and reconciliation
- Backup and recovery procedures

## Troubleshooting

### Common Issues
1. **Incorrect GST calculations**: Verify GST rates and type settings
2. **Missing HSN/SAC codes**: Ensure proper code assignment for compliance
3. **State code errors**: Validate place of supply configuration
4. **Integration issues**: Check Owner/Pet module connectivity

### Support Resources
- Built-in help documentation
- Compliance guidelines
- API documentation
- User training materials

## Future Enhancements

### Planned Features
1. **E-way bill generation**: For goods transportation
2. **GST return filing**: Direct integration with GST portal
3. **Advanced analytics**: Detailed GST and sales reports
4. **Multi-location support**: Branch-wise GST management
5. **Automated compliance alerts**: Proactive compliance monitoring

## Security & Privacy

### Data Protection
- Encrypted GST and financial data
- Role-based access control
- Audit logging for all transactions
- Regular security updates

### Compliance
- GDPR compliance for customer data
- GST law compliance for tax calculations
- Industry standard security practices
- Regular compliance audits

---

This documentation provides comprehensive coverage of the GST compliance and integration features. For technical implementation details, refer to the API documentation and code comments.