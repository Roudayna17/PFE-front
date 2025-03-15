export interface Equipement {
  id: number;
  nom: string;
  description: string;
  image: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  selected?: boolean;
}