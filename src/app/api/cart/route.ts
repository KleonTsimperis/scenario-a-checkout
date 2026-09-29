import { NextResponse } from 'next/server';
import { cartClient } from '@/lib/api/cartClient';

export async function GET() {
  const data = await cartClient.getCart();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, delta } = body;
    const data = await cartClient.updateItem(itemId, delta);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
