import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  if (tag) {
    revalidateTag(tag, {});
    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  }

  return NextResponse.json({ revalidated: false, message: 'Missing tag' }, { status: 400 });
}
