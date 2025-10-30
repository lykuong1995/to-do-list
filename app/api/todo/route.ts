import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedData = data.map(item => ({
    id: item.id,
    todo: item.todo,
    isCompleted: item.is_completed,
    createdAt: item.created_at,
  }));

  return NextResponse.json(formattedData);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('todos')
    .insert({
      id: body.id,
      todo: body.todo,
      is_completed: body.isCompleted,
      created_at: body.createdAt,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
