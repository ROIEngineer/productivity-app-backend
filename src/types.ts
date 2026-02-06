export interface Database {
  prepare(sql: string): {
    all(...params: any[]): any[]; 
    run(...params: any[]): { lastInsertRowid: bigint | number; changes: number };
    get(...params: any[]): any | undefined; 
  };
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Note {
  id: number;
  content: string;
  updated_at: string;
}
