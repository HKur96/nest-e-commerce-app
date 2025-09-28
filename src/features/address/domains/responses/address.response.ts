import { ApiProperty } from "@nestjs/swagger";

export class AddressResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  constructor(id: number, name: string) {
    (this.id = id), (this.name = name);
  }
}
