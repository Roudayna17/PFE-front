export class House {
    id!: number;
  
    title!: string;
  
    description!: string;
  
    location!: string;
  
    city!: string;
  
    poste_code!: string;
  
    price!: number;


    type!:string;
  
    availability!: string;
  
    created_at!: Date;
  
    created_by!: number;
  
    updated_at!: Date;
    
    updated_by!: number;
    deleted_at!: Date;
    equipments: any=[];
    characterisrtics: any=[];
    pictures: any=[];
  selected: unknown;
    
  }
  export class Picture {
    id?: number; // Facultatif
    url!: string;
    cloudinaryId?: string; // Facultatif
    defaults!: boolean;
    createdAt?: Date; // Facultatif
    updatedAt?: Date; // Facultatif
    createdBy?: number; // Facultatif
    updatedBy?: number; // Facultatif
    active?: boolean; // Facultatif
    HouseId?: any; // Facultatif
  }