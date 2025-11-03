export interface Item {
  id: number;
  name: string;
  price: number;
  serialNumberId?: number;
  serialNumber?: SerialNumber;
  categoryId?: number;
  category?: Category;
  itemClients?: ItemClient[];
}

export interface SerialNumber {
  id: number;
  name: string;
  itemId?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
}

export interface ItemClient {
  itemId: number;
  clientId: number;
  client?: Client;
}

export interface ItemCreateDto {
  name: string;
  price: number;
  categoryId: number;
  clientId: number;
}
