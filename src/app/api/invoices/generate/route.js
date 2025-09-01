import { NextResponse } from 'next/server';
import Sale from '@/models/Sale';

export async function POST(request) {
  try {
    const { saleId } = await request.json();

    if (!saleId) {
      return NextResponse.json(
        { error: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Find the sale with populated data
    const sale = await Sale.findById(saleId)
      .populate('customer.owner')
      .populate('customer.pet')
      .populate('salesPerson')
      .populate('items.inventory');

    if (!sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Return the sale data for invoice generation
    return NextResponse.json({
      success: true,
      data: {
        sale: sale
      }
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
