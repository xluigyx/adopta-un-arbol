export interface Planta {
  _id: string;
  nombre: string;
  especie: string;
  descripcion?: string;
  codigo: string;
  estadoactual: "available" | "adopted" | "maintenance";
  latitud: number;
  longitud: number;
  direccion?: string;
  fechaPlantacion: string;
  cuidador?: string;
  adoptante?: string;
  imagen?: string;
  categoria?: string;
}
