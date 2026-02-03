export interface Database {
  prepare(sql: string): {
    all(...params: any[]): any[];  // <-- Add ...params: any[]
    run(...params: any[]): { lastInsertRowid: bigint | number; changes: number };
    get(...params: any[]): any | undefined;  // <-- Add ...params: any[] here too
  };
}

export interface Todo {
  id: number;
  title: string;
  completed: number;
}

export interface Note {
  id: number;
  content: string;
  updated_at: string;
}
