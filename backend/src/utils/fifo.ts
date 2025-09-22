import InventoryBatch from '../models/InventoryBatch';
import { IOrderItem } from '../models/Order';

export interface BatchConsumption {
  batchId: string;
  quantityConsumed: number;
  remainingQuantity: number;
}

export interface FifoResult {
  success: boolean;
  consumedBatches: BatchConsumption[];
  totalConsumed: number;
  error?: string;
}

/**
 * Consume order items using FIFO (First In, First Out) method
 * @param orderItems Array of order items to process
 * @returns Promise<FifoResult> Result of the FIFO consumption
 */
export async function consumeOrderItemsFifo(orderItems: IOrderItem[]): Promise<FifoResult> {
  const consumedBatches: BatchConsumption[] = [];
  let totalConsumed = 0;

  try {
    for (const item of orderItems) {
      let remainingQuantity = item.quantity;
      
      // Get available batches for this product, sorted by expiry date (FIFO)
      const availableBatches = await InventoryBatch.find({
        product: item.product,
        remaining: { $gt: 0 },
        expiryDate: { $gte: new Date() } // Only non-expired batches
      }).sort({ expiryDate: 1 }); // Oldest first (FIFO)

      if (availableBatches.length === 0) {
        return {
          success: false,
          consumedBatches: [],
          totalConsumed: 0,
          error: `No available batches for product ${item.name}`
        };
      }

      // Check if we have enough total quantity
      const totalAvailable = availableBatches.reduce((sum, batch) => sum + batch.remaining, 0);
      if (totalAvailable < remainingQuantity) {
        return {
          success: false,
          consumedBatches: [],
          totalConsumed: 0,
          error: `Insufficient stock for product ${item.name}. Available: ${totalAvailable}, Required: ${remainingQuantity}`
        };
      }

      // Consume from batches using FIFO
      for (const batch of availableBatches) {
        if (remainingQuantity <= 0) break;

        const consumeFromBatch = Math.min(remainingQuantity, batch.remaining);
        
        // Update batch quantity
        batch.remaining -= consumeFromBatch;
        await batch.save();

        consumedBatches.push({
          batchId: batch._id.toString(),
          quantityConsumed: consumeFromBatch,
          remainingQuantity: batch.remaining
        });

        remainingQuantity -= consumeFromBatch;
        totalConsumed += consumeFromBatch;
      }
    }

    return {
      success: true,
      consumedBatches,
      totalConsumed
    };

  } catch (error) {
    return {
      success: false,
      consumedBatches: [],
      totalConsumed: 0,
      error: `FIFO processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check available quantity for a product using FIFO logic
 * @param productId Product ID to check
 * @returns Promise<number> Available quantity
 */
export async function getAvailableQuantityFifo(productId: string): Promise<number> {
  try {
    const availableBatches = await InventoryBatch.find({
      product: productId,
      remaining: { $gt: 0 },
      expiryDate: { $gte: new Date() }
    });

    return availableBatches.reduce((sum, batch) => sum + batch.remaining, 0);
  } catch (error) {
    console.error('Error getting available quantity:', error);
    return 0;
  }
}

/**
 * Get next expiring batches for a product
 * @param productId Product ID
 * @param days Number of days to check ahead
 * @returns Promise<any[]> Expiring batches
 */
export async function getExpiringBatches(productId?: string, days: number = 7): Promise<any[]> {
  try {
    const filter: any = {
      remaining: { $gt: 0 },
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      }
    };

    if (productId) {
      filter.product = productId;
    }

    const expiringBatches = await InventoryBatch.find(filter)
      .populate('product', 'name')
      .sort({ expiryDate: 1 });

    return expiringBatches;
  } catch (error) {
    console.error('Error getting expiring batches:', error);
    return [];
  }
}