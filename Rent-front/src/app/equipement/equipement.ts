export interface Equipement {
  name: string;
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  selected?: boolean;
}