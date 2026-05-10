export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'owner' | 'staff';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          sku: string | null;
          barcode: string | null;
          category_id: string | null;
          unit: string;
          buy_price: number;
          sell_price: number;
          current_stock: number;
          min_stock: number;
          deleted_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku?: string | null;
          barcode?: string | null;
          category_id?: string | null;
          unit: string;
          buy_price?: number;
          sell_price?: number;
          current_stock?: number;
          min_stock?: number;
          deleted_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string | null;
          barcode?: string | null;
          category_id?: string | null;
          unit?: string;
          buy_price?: number;
          sell_price?: number;
          current_stock?: number;
          min_stock?: number;
          deleted_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stock_transactions: {
        Row: {
          id: string;
          product_id: string;
          type: 'IN' | 'OUT' | 'ADJUST';
          quantity: number;
          stock_before: number;
          stock_after: number;
          price_at_time: number;
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          type: 'IN' | 'OUT' | 'ADJUST';
          quantity: number;
          stock_before: number;
          stock_after: number;
          price_at_time: number;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          type?: 'IN' | 'OUT' | 'ADJUST';
          quantity?: number;
          stock_before?: number;
          stock_after?: number;
          price_at_time?: number;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          address: string | null;
          note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          address?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          customer_id: string;
          amount: number;
          paid_amount: number;
          remaining_amount: number;
          status: 'UNPAID' | 'PARTIAL' | 'PAID';
          due_date: string | null;
          note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          amount: number;
          paid_amount?: number;
          remaining_amount?: number;
          status?: 'UNPAID' | 'PARTIAL' | 'PAID';
          due_date?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          amount?: number;
          paid_amount?: number;
          remaining_amount?: number;
          status?: 'UNPAID' | 'PARTIAL' | 'PAID';
          due_date?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          product_id: string;
          old_buy_price: number;
          new_buy_price: number;
          old_sell_price: number;
          new_sell_price: number;
          changed_by: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          old_buy_price: number;
          new_buy_price: number;
          old_sell_price: number;
          new_sell_price: number;
          changed_by?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          old_buy_price?: number;
          new_buy_price?: number;
          old_sell_price?: number;
          new_sell_price?: number;
          changed_by?: string | null;
          changed_at?: string;
        };
      };
    };
  };
}
