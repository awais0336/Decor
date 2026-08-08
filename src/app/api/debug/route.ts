import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/actions/storefront";

export async function GET() {
  try {
    const data = await getAllCategories();
    return NextResponse.json({
      data,
      env: {
        urlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Unknown error",
      stringified: JSON.stringify(error),
      keys: Object.keys(error)
    }, { status: 500 });
  }
}
